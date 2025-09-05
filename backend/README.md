# GenAI Stack Backend

FastAPI backend for the GenAI Stack visual workflow builder. Provides REST APIs for workflow management, document processing, and AI integration.

## \ud83d\udee0 Technology Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite/PostgreSQL** - Database options
- **ChromaDB** - Vector database for embeddings
- **OpenAI API** - GPT models integration
- **Google Generative AI** - Gemini models integration
- **PyMuPDF** - PDF text extraction
- **Pydantic** - Data validation and serialization

## \ud83d\udccb Project Structure

```
app/
\u251c\u2500\u2500 models/
\u2502   \u2514\u2500\u2500 database.py            # SQLAlchemy models
\u251c\u2500\u2500 schemas/
\u2502   \u2514\u2500\u2500 schemas.py             # Pydantic schemas
\u251c\u2500\u2500 routers/
\u2502   \u251c\u2500\u2500 health.py              # Health check endpoints
\u2502   \u251c\u2500\u2500 workflows.py           # Workflow CRUD operations
\u2502   \u251c\u2500\u2500 documents.py           # Document upload and processing
\u2502   \u2514\u2500\u2500 chat.py               # Chat session management
\u251c\u2500\u2500 services/
\u2502   \u251c\u2500\u2500 workflow_service.py    # Workflow execution engine
\u2502   \u251c\u2500\u2500 document_service.py    # Document processing logic
\u2502   \u251c\u2500\u2500 llm_service.py         # LLM provider integration
\u2502   \u251c\u2500\u2500 vector_service.py      # Vector database operations
\u2502   \u2514\u2500\u2500 web_search_service.py  # Web search integration
\u2514\u2500\u2500 db/
    \u2514\u2500\u2500 database.py            # Database configuration

main.py                         # FastAPI application entry point
requirements.txt               # Python dependencies
.env                           # Environment variables
```

## \ud83d\ude80 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager
- (Optional) PostgreSQL for production
- (Optional) ChromaDB for vector operations

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
uvicorn main:app --reload

# Or run directly
python main.py
```

### Environment Configuration

Create a `.env` file with the following variables:

```bash
# Database
DATABASE_URL=sqlite:///./genaistack.db
# For PostgreSQL: DATABASE_URL=postgresql://user:password@localhost:5432/genaistack

# ChromaDB
CHROMA_HOST=localhost
CHROMA_PORT=8000

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini
GOOGLE_API_KEY=your_google_api_key_here

# Web Search
SERPAPI_KEY=your_serpapi_key_here
BRAVE_API_KEY=your_brave_api_key_here

# App Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=[\"http://localhost:5173\", \"http://localhost:3000\"]
```

## \ud83d\udcd6 API Documentation

Once the server is running, visit:

- **Interactive API Docs**: `http://localhost:8000/docs`
- **Alternative Docs**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

### Core Endpoints

#### Health Check
```bash
GET /api/health
```

#### Workflows
```bash
# Create workflow
POST /api/workflows/

# Get workflow
GET /api/workflows/{workflow_id}

# List workflows
GET /api/workflows/

# Update workflow
PUT /api/workflows/{workflow_id}

# Chat with workflow
POST /api/workflows/{workflow_id}/chat

# Validate workflow
POST /api/workflows/{workflow_id}/validate
```

#### Documents
```bash
# Upload document
POST /api/documents/upload

# Get document
GET /api/documents/{document_id}

# List documents
GET /api/documents/

# Delete document
DELETE /api/documents/{document_id}
```

#### Chat Sessions
```bash
# Create chat session
POST /api/chat/sessions

# Get chat session
GET /api/chat/sessions/{session_id}

# Add message to session
POST /api/chat/sessions/{session_id}/messages
```

## \ud83d\udd00 Database Models

### Workflow
```python
class Workflow(Base):
    id: int
    name: str
    description: str
    nodes: JSON  # React Flow nodes
    edges: JSON  # React Flow edges
    is_valid: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
```

### Document
```python
class Document(Base):
    id: int
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    file_path: str
    processed: bool
    text_content: str
    embedding_count: int
    workflow_id: int
    created_at: datetime
```

### Chat Session & Messages
```python
class ChatSession(Base):
    id: int
    session_id: str
    workflow_id: int
    created_at: datetime

class ChatMessage(Base):
    id: int
    session_id: int
    message_type: str  # 'user', 'assistant', 'system'
    content: str
    message_metadata: JSON
    created_at: datetime
```

## \ud83e\udd16 Services Architecture

### Workflow Service (`workflow_service.py`)

Orchestrates the execution of workflows:

```python
class WorkflowService:
    async def execute_workflow(self, workflow_id: int, user_message: str)
    def _determine_execution_order(self, nodes: list, edges: list)
    async def _execute_node(self, node: dict, context: dict)
```

**Execution Flow:**
1. Parse workflow nodes and edges
2. Determine execution order (topological sort)
3. Execute each node in sequence
4. Pass context between nodes
5. Return final response

### Document Service (`document_service.py`)

Handles document processing and embedding generation:

```python
class DocumentService:
    async def process_document(self, document_id: int)
    def _extract_text(self, file_path: str, file_type: str)
    async def _generate_embeddings(self, document: Document, text_content: str)
```

**Processing Pipeline:**
1. Extract text from uploaded files (PDF, TXT, DOCX)
2. Split text into chunks with overlap
3. Generate embeddings using OpenAI/Gemini
4. Store embeddings in ChromaDB
5. Update document status

### LLM Service (`llm_service.py`)

Integrates with multiple LLM providers:

```python
class LLMService:
    async def generate_response(self, query: str, model: str, **kwargs)
    async def _generate_openai_response(self, ...)
    async def _generate_gemini_response(self, ...)
    async def generate_embeddings(self, text: str)
```

**Supported Models:**
- OpenAI: GPT-4, GPT-3.5-turbo
- Google: Gemini Pro
- Embeddings: text-embedding-ada-002

### Vector Service (`vector_service.py`)

Manages vector database operations:

```python
class VectorService:
    async def store_document_chunks(self, chunks: list, ...)
    async def search_similar(self, query: str, collection_name: str)
    async def delete_document_embeddings(self, document_id: int)
```

### Web Search Service (`web_search_service.py`)

Provides web search capabilities:

```python
class WebSearchService:
    async def search(self, query: str, engine: str)
    async def _search_serpapi(self, query: str)
    async def _search_brave(self, query: str)
```

## \ud83d\uddcf Component Execution

### User Query Component
- Input: User message from chat interface
- Processing: Validates and passes query to next component
- Output: Raw user query

### Knowledge Base Component
- Input: User query
- Processing: 
  1. Search relevant documents using vector similarity
  2. Retrieve top-k most relevant chunks
  3. Combine chunks into context
- Output: Relevant context from documents

### LLM Engine Component
- Input: User query + context (optional)
- Processing:
  1. Prepare system prompt with context
  2. Optionally perform web search
  3. Generate response using configured LLM
  4. Apply temperature and token limits
- Output: AI-generated response

### Output Component
- Input: Final response from LLM
- Processing: Format response for chat interface
- Output: Formatted response to user

## \ud83d\udd27 Development

### Adding New LLM Providers

1. **Extend LLMService**:
   ```python
   async def _generate_new_provider_response(self, query, system_prompt, **kwargs):
       # Implement new provider logic
       pass
   ```

2. **Update generate_response method**:
   ```python
   if model.startswith(\"new-provider\"):
       return await self._generate_new_provider_response(...)
   ```

3. **Add configuration options** in component schemas

### Adding New Component Types

1. **Define component** in frontend constants
2. **Create node execution logic** in `workflow_service.py`:
   ```python
   elif node_type == \"new-component\":
       context = await self._execute_new_component(context, node_config)
   ```

3. **Implement component logic**:
   ```python
   async def _execute_new_component(self, context, config):
       # Component-specific processing
       return context
   ```

### Database Migrations

Using Alembic for database schema changes:

```bash
# Initialize Alembic (if not done)
alembic init alembic

# Create migration
alembic revision --autogenerate -m \"Description of changes\"

# Apply migration
alembic upgrade head

# Downgrade migration
alembic downgrade -1
```

## \ud83e\uddea Testing

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_workflows.py
```

### Test Structure

```
tests/
\u251c\u2500\u2500 test_routers/
\u2502   \u251c\u2500\u2500 test_workflows.py
\u2502   \u251c\u2500\u2500 test_documents.py
\u2502   \u2514\u2500\u2500 test_chat.py
\u251c\u2500\u2500 test_services/
\u2502   \u251c\u2500\u2500 test_workflow_service.py
\u2502   \u251c\u2500\u2500 test_llm_service.py
\u2502   \u2514\u2500\u2500 test_vector_service.py
\u2514\u2500\u2500 conftest.py             # Test configuration
```

### Example Test

```python
@pytest.mark.asyncio
async def test_create_workflow(client):
    workflow_data = {
        \"name\": \"Test Workflow\",
        \"description\": \"Test Description\",
        \"nodes\": [],
        \"edges\": []
    }
    
    response = await client.post(\"/api/workflows/\", json=workflow_data)
    assert response.status_code == 200
    assert response.json()[\"success\"] is True
```

## \ud83d\udccf Performance Optimization

### Database Optimization

- Use connection pooling for high traffic
- Add database indexes for frequently queried fields
- Implement query optimization for large datasets
- Use read replicas for scaling read operations

### Caching Strategy

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def get_workflow_config(workflow_id: int):
    # Cache frequently accessed workflow configurations
    pass
```

### Async Processing

- Use background tasks for document processing
- Implement queue system for heavy operations
- Use async/await for I/O operations

## \ud83d\udee1 Security Considerations

### File Upload Security

- Validate file types and sizes
- Scan uploaded files for malware
- Store files outside web root
- Use secure file naming conventions

### API Security

- Implement rate limiting
- Use CORS properly
- Validate all input data
- Implement authentication (for production)

### Environment Variables

- Never commit API keys to version control
- Use environment-specific configurations
- Implement secret rotation for production

## \ud83d\udce6 Deployment

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]
```

### Production Considerations

- Use PostgreSQL instead of SQLite
- Set up proper logging and monitoring
- Configure load balancing
- Implement health checks
- Use HTTPS in production
- Set up database backups
- Configure ChromaDB cluster

## \ud83d\udc1b Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL configuration
   - Ensure database server is running
   - Verify credentials and permissions

2. **ChromaDB Connection Issues**
   - Check CHROMA_HOST and CHROMA_PORT
   - Ensure ChromaDB service is running
   - Verify network connectivity

3. **LLM API Errors**
   - Verify API keys are correct
   - Check API quotas and limits
   - Handle rate limiting appropriately

4. **File Processing Errors**
   - Check file permissions
   - Verify PyMuPDF installation
   - Ensure sufficient disk space

### Debug Mode

Enable debug logging:

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
```

### Health Monitoring

```python
# Add to health endpoint
async def health_check():
    checks = {
        \"database\": await check_database_connection(),
        \"chromadb\": await check_chromadb_connection(),
        \"openai\": await check_openai_api(),
    }
    return {\"status\": \"healthy\", \"checks\": checks}
```

## \ud83e\udd1d Contributing

When contributing to the backend:

1. Follow PEP 8 style guidelines
2. Add type hints to all functions
3. Write comprehensive docstrings
4. Include unit tests for new features
5. Update API documentation
6. Handle errors gracefully
7. Log important operations

### Code Style

```python
from typing import List, Dict, Optional

async def process_workflow(
    workflow_id: int, 
    user_input: str,
    context: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    \"\"\"
    Process a workflow with user input.
    
    Args:
        workflow_id: ID of the workflow to execute
        user_input: User's input message
        context: Optional execution context
        
    Returns:
        Dictionary containing the workflow response
        
    Raises:
        ValueError: If workflow is invalid
        HTTPException: If workflow not found
    \"\"\"
    # Implementation here
    pass
```", "original_text": ""}]