from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

# Workflow schemas
class WorkflowNodeBase(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class WorkflowEdgeBase(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = None
    nodes: List[WorkflowNodeBase] = []
    edges: List[WorkflowEdgeBase] = []

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    nodes: Optional[List[WorkflowNodeBase]] = None
    edges: Optional[List[WorkflowEdgeBase]] = None
    is_valid: Optional[bool] = None

class WorkflowResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    is_valid: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Document schemas
class DocumentCreate(BaseModel):
    filename: str
    file_type: str
    workflow_id: Optional[int] = None

class DocumentResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    processed: bool
    embedding_count: int
    workflow_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

# Chat schemas
class ChatMessageCreate(BaseModel):
    message: str
    workflow_id: int

class ChatMessageResponse(BaseModel):
    id: int
    message_type: str
    content: str
    message_metadata: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True

class ChatSessionResponse(BaseModel):
    id: int
    session_id: str
    workflow_id: int
    messages: List[ChatMessageResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

# Component configuration schemas
class ComponentConfig(BaseModel):
    component_type: str
    config: Dict[str, Any]

# API Response schemas
class APIResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[Any] = None
    error: Optional[str] = None

class WorkflowExecutionRequest(BaseModel):
    workflow_id: int
    input_data: Dict[str, Any]
    
class WorkflowExecutionResponse(BaseModel):
    execution_id: str
    status: str
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    processing_time: Optional[float] = None