import chromadb
import os
from typing import List, Dict, Any
import hashlib
import time

class VectorService:
    def __init__(self):
        self.chroma_host = os.getenv("CHROMA_HOST", "localhost")
        self.chroma_port = os.getenv("CHROMA_PORT", "8001")
        
        # Initialize ChromaDB client with timeout and fallback
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        """Initialize ChromaDB client with proper error handling"""
        try:
            # Try persistent client first (more reliable for development)
            chroma_data_path = "./chroma_data"
            os.makedirs(chroma_data_path, exist_ok=True)
            
            self.client = chromadb.PersistentClient(path=chroma_data_path)
            # Test the client
            self.client.list_collections()
            print(f"Connected to ChromaDB with persistent storage at {chroma_data_path}")
            return
        except Exception as e:
            print(f"Persistent ChromaDB failed: {str(e)}")
            
        try:
            # Fallback to HTTP client with timeout
            import requests
            # Quick test if HTTP server is available
            response = requests.get(f"http://{self.chroma_host}:{self.chroma_port}/api/v1/heartbeat", timeout=2)
            if response.status_code == 200:
                self.client = chromadb.HttpClient(
                    host=self.chroma_host,
                    port=int(self.chroma_port)
                )
                self.client.heartbeat()
                print(f"Connected to ChromaDB HTTP server at {self.chroma_host}:{self.chroma_port}")
                return
        except Exception as e:
            print(f"HTTP ChromaDB not available: {str(e)}")
            
        # If all else fails, use in-memory client
        try:
            self.client = chromadb.Client()
            print("Using in-memory ChromaDB client (data will not persist)")
        except Exception as e:
            print(f"Failed to initialize any ChromaDB client: {str(e)}")
            self.client = None

    async def store_document_chunks(
        self, 
        chunks: List[str], 
        document_id: int, 
        collection_name: str,
        metadata: Dict[str, Any]
    ) -> int:
        """
        Store document chunks as embeddings in ChromaDB
        """
        if not self.client:
            print("ChromaDB client not available")
            return 0

        try:
            # Get or create collection
            collection = self._get_or_create_collection(collection_name)
            
            # Prepare data for ChromaDB
            documents = []
            metadatas = []
            ids = []
            
            for i, chunk in enumerate(chunks):
                if chunk.strip():  # Only add non-empty chunks
                    chunk_id = f"doc_{document_id}_chunk_{i}"
                    documents.append(chunk)
                    metadatas.append({
                        **metadata,
                        "chunk_index": i,
                        "chunk_id": chunk_id
                    })
                    ids.append(chunk_id)
            
            if documents:
                # Add documents to collection
                collection.add(
                    documents=documents,
                    metadatas=metadatas,
                    ids=ids
                )
                
                return len(documents)
            
            return 0

        except Exception as e:
            print(f"Error storing document chunks: {str(e)}")
            return 0

    async def search_similar(
        self, 
        query: str, 
        collection_name: str, 
        limit: int = 5
    ) -> str:
        """
        Search for similar documents in the vector store
        """
        if not self.client:
            return "No knowledge base documents available. The system will use general knowledge to answer your question."

        try:
            # Get collection
            collection = self._get_or_create_collection(collection_name)
            
            # Search for similar documents
            results = collection.query(
                query_texts=[query],
                n_results=limit
            )
            
            # Combine results into context
            if results and results['documents'] and results['documents'][0]:
                context_parts = []
                for doc in results['documents'][0]:
                    context_parts.append(doc)
                
                return "\n\n".join(context_parts)
            
            return "No relevant documents found in the knowledge base."

        except Exception as e:
            print(f"Error searching similar documents: {str(e)}")
            return "Knowledge base search unavailable. Using general knowledge instead."

    def _get_or_create_collection(self, collection_name: str):
        """
        Get existing collection or create new one
        """
        try:
            # Try to get existing collection
            collection = self.client.get_collection(collection_name)
        except:
            # Create new collection if it doesn't exist
            collection = self.client.create_collection(
                name=collection_name,
                metadata={"description": f"Collection for {collection_name}"}
            )
        
        return collection

    async def delete_document_embeddings(self, document_id: int, collection_name: str) -> bool:
        """
        Delete all embeddings for a specific document
        """
        if not self.client:
            return False

        try:
            collection = self._get_or_create_collection(collection_name)
            
            # Get all chunk IDs for this document
            results = collection.get(
                where={"document_id": document_id}
            )
            
            if results and results['ids']:
                # Delete chunks
                collection.delete(ids=results['ids'])
                return True
            
            return True

        except Exception as e:
            print(f"Error deleting document embeddings: {str(e)}")
            return False