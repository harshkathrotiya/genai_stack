from sqlalchemy.orm import Session
from app.models.database import Workflow, Document
from app.services.llm_service import LLMService
from app.services.vector_service import VectorService
from app.services.web_search_service import WebSearchService
import json
from typing import Dict, Any

class WorkflowService:
    def __init__(self, db: Session):
        self.db = db
        self.llm_service = LLMService()
        self.vector_service = VectorService()
        self.web_search_service = WebSearchService()

    async def execute_workflow(self, workflow_id: int, user_message: str) -> Dict[str, Any]:
        """
        Execute a workflow with the given user message
        """
        # Get workflow
        workflow = self.db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not workflow:
            raise ValueError("Workflow not found")

        # Parse workflow structure
        nodes = json.loads(workflow.nodes) if workflow.nodes else []
        edges = json.loads(workflow.edges) if workflow.edges else []

        # Create execution context
        context = {
            "query": user_message,
            "context": "",
            "response": "",
            "metadata": {}
        }

        # Execute workflow nodes in order
        execution_order = self._determine_execution_order(nodes, edges)
        
        for node_id in execution_order:
            node = next((n for n in nodes if n["id"] == node_id), None)
            if node:
                context = await self._execute_node(node, context, workflow_id)

        return {
            "response": context.get("response", "No response generated"),
            "metadata": context.get("metadata", {}),
            "context_used": context.get("context", ""),
        }

    def _determine_execution_order(self, nodes: list, edges: list) -> list:
        """
        Determine the execution order of nodes based on connections
        """
        # Simple topological sort
        # For now, follow typical order: user-query -> knowledge-base -> llm-engine -> output
        
        node_types = {}
        for node in nodes:
            node_types[node["id"]] = node["data"]["componentType"]

        order = []
        
        # Find user-query node (starting point)
        for node_id, node_type in node_types.items():
            if node_type == "user-query":
                order.append(node_id)
                break

        # Follow connections
        remaining_nodes = set(node_types.keys()) - set(order)
        
        while remaining_nodes:
            next_node = None
            
            # Find next connected node
            for edge in edges:
                if edge["source"] in order and edge["target"] in remaining_nodes:
                    next_node = edge["target"]
                    break
            
            if next_node:
                order.append(next_node)
                remaining_nodes.remove(next_node)
            else:
                # Add remaining nodes by type priority
                type_priority = ["knowledge-base", "llm-engine", "output"]
                for node_type in type_priority:
                    for node_id in remaining_nodes:
                        if node_types[node_id] == node_type:
                            order.append(node_id)
                            remaining_nodes.remove(node_id)
                            break
                    if not remaining_nodes:
                        break
        
        return order

    async def _execute_node(self, node: dict, context: Dict[str, Any], workflow_id: int) -> Dict[str, Any]:
        """
        Execute a single node in the workflow
        """
        node_type = node["data"]["componentType"]
        node_config = node["data"].get("config", {})

        if node_type == "user-query":
            # User query node just passes the query through
            return context

        elif node_type == "knowledge-base":
            # Retrieve relevant context from documents
            context["context"] = await self._execute_knowledge_base(
                context["query"], 
                workflow_id, 
                node_config
            )
            return context

        elif node_type == "llm-engine":
            # Process with LLM
            context["response"] = await self._execute_llm_engine(
                context["query"],
                context.get("context", ""),
                node_config
            )
            return context

        elif node_type == "output":
            # Output node just formats the final response
            return context

        return context

    async def _execute_knowledge_base(self, query: str, workflow_id: int, config: dict) -> str:
        """
        Execute knowledge base component
        """
        try:
            # Get documents for this workflow
            documents = self.db.query(Document).filter(
                Document.workflow_id == workflow_id,
                Document.processed == True
            ).all()

            if not documents:
                return "No documents found in knowledge base."

            # Search for relevant context
            relevant_context = await self.vector_service.search_similar(
                query=query,
                collection_name=f"workflow_{workflow_id}",
                limit=config.get("max_results", 3)
            )

            return relevant_context

        except Exception as e:
            return f"Error retrieving context: {str(e)}"

    async def _execute_llm_engine(self, query: str, context: str, config: dict) -> str:
        """
        Execute LLM engine component
        """
        try:
            # Prepare system prompt
            system_prompt = config.get("systemPrompt", "You are a helpful AI assistant.")
            
            # Add context to prompt if available
            if context:
                system_prompt += f"\n\nContext:\n{context}"

            # Check if web search is enabled
            if config.get("webSearch", False):
                web_results = await self.web_search_service.search(query)
                if web_results:
                    system_prompt += f"\n\nWeb search results:\n{web_results}"

            # Generate response using configured LLM
            model = config.get("model", "gpt-4")
            temperature = config.get("temperature", 0.7)
            max_tokens = config.get("maxTokens", 1000)

            response = await self.llm_service.generate_response(
                query=query,
                system_prompt=system_prompt,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens
            )

            return response

        except Exception as e:
            return f"Error generating response: {str(e)}"