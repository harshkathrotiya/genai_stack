import fitz  # PyMuPDF
import os
from sqlalchemy.orm import Session
from app.models.database import Document
from app.services.vector_service import VectorService

class DocumentService:
    def __init__(self, db: Session):
        self.db = db
        self.vector_service = VectorService()

    async def process_document(self, document_id: int) -> bool:
        """
        Process a document: extract text and generate embeddings
        """
        try:
            document = self.db.query(Document).filter(Document.id == document_id).first()
            if not document:
                return False

            # Extract text based on file type
            text_content = self._extract_text(document.file_path, document.file_type)
            
            # Update document with extracted text
            document.text_content = text_content
            document.processed = True
            
            # Generate embeddings and store in vector database
            if text_content.strip():
                embedding_count = await self._generate_embeddings(document, text_content)
                document.embedding_count = embedding_count
            
            self.db.commit()
            return True

        except Exception as e:
            print(f"Error processing document {document_id}: {str(e)}")
            # Mark as processed but with error
            document = self.db.query(Document).filter(Document.id == document_id).first()
            if document:
                document.processed = True
                self.db.commit()
            return False

    def _extract_text(self, file_path: str, file_type: str) -> str:
        """
        Extract text from different file types
        """
        try:
            if file_type.lower() == '.pdf':
                return self._extract_text_from_pdf(file_path)
            elif file_type.lower() == '.txt':
                return self._extract_text_from_txt(file_path)
            elif file_type.lower() == '.docx':
                return self._extract_text_from_docx(file_path)
            else:
                return ""
        except Exception as e:
            print(f"Error extracting text from {file_path}: {str(e)}")
            return ""

    def _extract_text_from_pdf(self, file_path: str) -> str:
        """
        Extract text from PDF using PyMuPDF
        """
        text = ""
        try:
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text()
            doc.close()
        except Exception as e:
            print(f"Error extracting PDF text: {str(e)}")
        return text

    def _extract_text_from_txt(self, file_path: str) -> str:
        """
        Extract text from TXT file
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            print(f"Error reading TXT file: {str(e)}")
            return ""

    def _extract_text_from_docx(self, file_path: str) -> str:
        """
        Extract text from DOCX file
        """
        try:
            # Try to import python-docx if available
            try:
                from docx import Document
                doc = Document(file_path)
                text = []
                for paragraph in doc.paragraphs:
                    text.append(paragraph.text)
                return '\n'.join(text)
            except ImportError:
                print("Warning: python-docx not installed, skipping DOCX text extraction")
                return "DOCX text extraction requires python-docx package"
        except Exception as e:
            print(f"Error extracting DOCX text: {str(e)}")
            return "Error extracting DOCX content"

    async def _generate_embeddings(self, document: Document, text_content: str) -> int:
        """
        Generate embeddings for document text and store in vector database
        """
        try:
            # Split text into chunks
            chunks = self._split_text_into_chunks(text_content)
            
            # Create collection name based on workflow
            collection_name = f"workflow_{document.workflow_id}" if document.workflow_id else "general"
            
            # Store chunks in vector database
            embedding_count = await self.vector_service.store_document_chunks(
                chunks=chunks,
                document_id=document.id,
                collection_name=collection_name,
                metadata={
                    "filename": document.original_filename,
                    "file_type": document.file_type,
                    "document_id": document.id
                }
            )
            
            return embedding_count

        except Exception as e:
            print(f"Error generating embeddings: {str(e)}")
            return 0

    def _split_text_into_chunks(self, text: str, chunk_size: int = 1000, overlap: int = 100) -> list:
        """
        Split text into overlapping chunks
        """
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = start + chunk_size
            chunk = text[start:end]
            
            # Try to break at word boundaries
            if end < text_length:
                last_space = chunk.rfind(' ')
                if last_space > chunk_size * 0.8:  # Only break if not too early
                    chunk = chunk[:last_space]
                    end = start + last_space
            
            chunks.append(chunk.strip())
            start = end - overlap
            
        return [chunk for chunk in chunks if chunk.strip()]