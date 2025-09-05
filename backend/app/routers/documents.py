from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from app.db.database import get_db
from app.models.database import Document
from app.schemas.schemas import DocumentResponse, APIResponse
from app.services.document_service import DocumentService

router = APIRouter()

@router.post("/upload", response_model=APIResponse)
async def upload_document(
    file: UploadFile = File(...),
    workflow_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    try:
        # Validate file type
        allowed_types = ['.pdf', '.txt', '.docx']
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {file_extension} not supported. Allowed: {allowed_types}"
            )
        
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        import uuid
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create database record
        document = Document(
            filename=unique_filename,
            original_filename=file.filename,
            file_type=file_extension,
            file_size=os.path.getsize(file_path),
            file_path=file_path,
            workflow_id=workflow_id
        )
        
        db.add(document)
        db.commit()
        db.refresh(document)
        
        # Process document asynchronously (but handle errors gracefully)
        document_service = DocumentService(db)
        try:
            await document_service.process_document(document.id)
        except Exception as process_error:
            print(f"Warning: Document processing failed: {process_error}")
            # Continue anyway - document is uploaded, processing can be retried
        
        return APIResponse(
            success=True,
            message="Document uploaded successfully",
            data={"document_id": document.id, "filename": unique_filename}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return document

@router.get("/", response_model=List[DocumentResponse])
async def list_documents(workflow_id: int = None, db: Session = Depends(get_db)):
    query = db.query(Document)
    if workflow_id:
        query = query.filter(Document.workflow_id == workflow_id)
    
    documents = query.all()
    return documents

@router.delete("/{document_id}", response_model=APIResponse)
async def delete_document(document_id: int, db: Session = Depends(get_db)):
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Delete file from filesystem
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
        
        # Delete from database
        db.delete(document)
        db.commit()
        
        return APIResponse(
            success=True,
            message="Document deleted successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))