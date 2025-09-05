from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.database import ChatSession, ChatMessage
from app.schemas.schemas import APIResponse, ChatSessionResponse
import uuid

router = APIRouter()

@router.post("/sessions", response_model=APIResponse)
async def create_chat_session(workflow_id: int, db: Session = Depends(get_db)):
    try:
        session_id = str(uuid.uuid4())
        
        chat_session = ChatSession(
            session_id=session_id,
            workflow_id=workflow_id
        )
        
        db.add(chat_session)
        db.commit()
        db.refresh(chat_session)
        
        return APIResponse(
            success=True,
            message="Chat session created",
            data={"session_id": session_id, "id": chat_session.id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_chat_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    return session

@router.post("/sessions/{session_id}/messages", response_model=APIResponse)
async def add_message_to_session(
    session_id: str,
    message_data: dict,
    db: Session = Depends(get_db)
):
    try:
        session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
        
        message = ChatMessage(
            session_id=session.id,
            message_type=message_data.get("type", "user"),
            content=message_data.get("content", ""),
            message_metadata=message_data.get("metadata", {})
        )
        
        db.add(message)
        db.commit()
        
        return APIResponse(
            success=True,
            message="Message added to session"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))