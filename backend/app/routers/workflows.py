from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.database import Workflow
from app.schemas.schemas import (
    WorkflowCreate, 
    WorkflowUpdate, 
    WorkflowResponse, 
    APIResponse,
    WorkflowExecutionRequest,
    WorkflowExecutionResponse
)
from app.services.workflow_service import WorkflowService
import json

router = APIRouter()

@router.post("/", response_model=APIResponse)
async def create_workflow(
    workflow: WorkflowCreate,
    db: Session = Depends(get_db)
):
    try:
        db_workflow = Workflow(
            name=workflow.name,
            description=workflow.description,
            nodes=json.dumps([node.dict() for node in workflow.nodes]),
            edges=json.dumps([edge.dict() for edge in workflow.edges]),
            is_valid=False
        )
        db.add(db_workflow)
        db.commit()
        db.refresh(db_workflow)
        
        return APIResponse(
            success=True,
            message="Workflow created successfully",
            data={"workflow_id": db_workflow.id}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(workflow_id: int, db: Session = Depends(get_db)):
    workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return WorkflowResponse(
        id=workflow.id,
        name=workflow.name,
        description=workflow.description,
        nodes=json.loads(workflow.nodes) if workflow.nodes else [],
        edges=json.loads(workflow.edges) if workflow.edges else [],
        is_valid=workflow.is_valid,
        is_active=workflow.is_active,
        created_at=workflow.created_at,
        updated_at=workflow.updated_at
    )

@router.get("/", response_model=List[WorkflowResponse])
async def list_workflows(db: Session = Depends(get_db)):
    workflows = db.query(Workflow).filter(Workflow.is_active == True).all()
    return [
        WorkflowResponse(
            id=w.id,
            name=w.name,
            description=w.description,
            nodes=json.loads(w.nodes) if w.nodes else [],
            edges=json.loads(w.edges) if w.edges else [],
            is_valid=w.is_valid,
            is_active=w.is_active,
            created_at=w.created_at,
            updated_at=w.updated_at
        ) for w in workflows
    ]

@router.put("/{workflow_id}", response_model=APIResponse)
async def update_workflow(
    workflow_id: int,
    workflow_update: WorkflowUpdate,
    db: Session = Depends(get_db)
):
    workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    if workflow_update.name is not None:
        workflow.name = workflow_update.name
    if workflow_update.description is not None:
        workflow.description = workflow_update.description
    if workflow_update.nodes is not None:
        workflow.nodes = json.dumps([node.dict() for node in workflow_update.nodes])
    if workflow_update.edges is not None:
        workflow.edges = json.dumps([edge.dict() for edge in workflow_update.edges])
    if workflow_update.is_valid is not None:
        workflow.is_valid = workflow_update.is_valid
    
    db.commit()
    
    return APIResponse(
        success=True,
        message="Workflow updated successfully"
    )

@router.post("/{workflow_id}/chat", response_model=APIResponse)
async def chat_with_workflow(
    workflow_id: int,
    request: dict,
    db: Session = Depends(get_db)
):
    """
    Process a chat message through the specified workflow
    """
    try:
        workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        if not workflow.is_valid:
            raise HTTPException(status_code=400, detail="Workflow is not valid")
        
        # Initialize workflow service
        workflow_service = WorkflowService(db)
        
        # Execute the workflow with user message
        result = await workflow_service.execute_workflow(
            workflow_id=workflow_id,
            user_message=request.get("message", "")
        )
        
        return APIResponse(
            success=True,
            message="Message processed successfully",
            data=result
        )
        
    except Exception as e:
        return APIResponse(
            success=False,
            error=str(e)
        )

@router.post("/{workflow_id}/validate", response_model=APIResponse)
async def validate_workflow(workflow_id: int, db: Session = Depends(get_db)):
    """
    Validate a workflow and mark it as valid/invalid
    """
    try:
        workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        # Parse nodes and edges
        nodes = json.loads(workflow.nodes) if workflow.nodes else []
        edges = json.loads(workflow.edges) if workflow.edges else []
        
        # Basic validation logic
        is_valid = validate_workflow_structure(nodes, edges)
        
        workflow.is_valid = is_valid
        db.commit()
        
        return APIResponse(
            success=True,
            message=f"Workflow {'is valid' if is_valid else 'is invalid'}",
            data={"is_valid": is_valid}
        )
        
    except Exception as e:
        return APIResponse(
            success=False,
            error=str(e)
        )

def validate_workflow_structure(nodes: list, edges: list) -> bool:
    """
    Basic workflow validation logic
    """
    # Check for required components
    node_types = [node.get('data', {}).get('componentType') for node in nodes]
    
    has_user_query = 'user-query' in node_types
    has_output = 'output' in node_types
    
    if not has_user_query or not has_output:
        return False
    
    # Check if nodes are connected
    if len(nodes) > 1 and len(edges) == 0:
        return False
    
    return True