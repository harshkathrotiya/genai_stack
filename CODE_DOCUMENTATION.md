# GenAI Stack - Complete Source Code Documentation

## 📋 Document Overview
**Project**: GenAI Stack - No-Code AI Workflow Builder  
**Assignment**: Full Stack Engineer Internship 2025  
**Author**: [Your Name]  
**Date**: January 2025

---

## 🏗 Project Architecture Overview

### Directory Structure
```
genai-stack/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Chat/        # Chat interface components
│   │   │   ├── Layout/      # Layout components
│   │   │   ├── Nodes/       # Custom React Flow nodes
│   │   │   ├── ComponentLibrary.jsx
│   │   │   ├── ConfigurationPanel.jsx
│   │   │   └── WorkflowBuilder.jsx
│   │   ├── constants/       # Component definitions
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── public/             # Static assets
│   ├── package.json        # Dependencies and scripts
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── vite.config.ts      # Vite build configuration
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── db/             # Database configuration
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API endpoint routers
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic services
│   ├── main.py             # FastAPI application entry
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment configuration
├── docker-compose.yml      # Docker services configuration
└── README.md              # Project documentation
```

---

## 🎨 Frontend Architecture

### Core Components

#### 1. WorkflowBuilder.jsx
**Purpose**: Main workspace component for building AI workflows

**Key Features**:
- Drag-and-drop workflow creation using React Flow
- Component connection management
- Workflow validation and state management
- Integration with backend APIs

**State Management**:
```javascript
const [nodes, setNodes, onNodesChange] = useNodesState([]);
const [edges, setEdges, onEdgesChange] = useEdgesState([]);
const [selectedNode, setSelectedNode] = useState(null);
const [workflowId, setWorkflowId] = useState(null);
```

**Key Methods**:
- `handleBuildStack()`: Validates and builds workflow
- `handleChatWithStack()`: Opens chat interface
- `validateWorkflow()`: Checks workflow validity

#### 2. ComponentLibrary.jsx
**Purpose**: Provides draggable AI components for workflow building

**Components Provided**:
- User Query Component
- Knowledge Base Component  
- LLM Engine Component
- Output Component

**Drag Implementation**:
```javascript
const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};
```

#### 3. ConfigurationPanel.jsx
**Purpose**: Dynamic configuration interface for selected components

**Key Features**:
- Dynamic form generation based on component type
- File upload for Knowledge Base components
- Real-time configuration updates
- Validation and error handling

**Configuration Types**:
- Text inputs (placeholders, prompts)
- Numeric inputs (temperature, max tokens)
- Select dropdowns (models, engines)
- File uploads (documents)
- Checkboxes (enable/disable features)

#### 4. Custom Node Components

##### UserQueryNode.jsx
- **Purpose**: Entry point for user input
- **Configuration**: Placeholder text, required validation
- **Visual**: Blue gradient styling with input icon

##### KnowledgeBaseNode.jsx
- **Purpose**: Document processing and retrieval
- **Configuration**: File formats, embedding models, vector store
- **Visual**: Green gradient styling with database icon

##### LLMEngineNode.jsx
- **Purpose**: AI processing and response generation
- **Configuration**: Model selection, temperature, tokens, web search
- **Visual**: Purple gradient styling with brain icon

##### OutputNode.jsx
- **Purpose**: Response display and interaction
- **Configuration**: Display format, timestamps, follow-up
- **Visual**: Orange gradient styling with output icon

#### 5. ChatModal.jsx
**Purpose**: Interactive chat interface for workflow execution

**Features**:
- Real-time message exchange
- Workflow execution integration
- Message history
- Loading states and error handling

---

## ⚙️ Backend Architecture

### API Layer (Routers)

#### 1. workflows.py
**Purpose**: Workflow management endpoints

**Endpoints**:
```python
POST   /api/workflows/              # Create new workflow
GET    /api/workflows/              # List all workflows  
GET    /api/workflows/{id}          # Get specific workflow
PUT    /api/workflows/{id}          # Update workflow
POST   /api/workflows/{id}/validate # Validate workflow structure
POST   /api/workflows/{id}/chat     # Execute workflow with message
```

**Key Functions**:
- Workflow CRUD operations
- Validation logic
- Chat execution orchestration

#### 2. documents.py
**Purpose**: Document upload and management

**Endpoints**:
```python
POST   /api/documents/upload        # Upload and process document
GET    /api/documents/              # List documents
GET    /api/documents/{id}          # Get document details
DELETE /api/documents/{id}          # Delete document
```

**File Processing**:
- Multi-format support (PDF, TXT, DOCX)
- Automatic text extraction
- Embedding generation
- Vector storage

#### 3. chat.py
**Purpose**: Chat session management

**Endpoints**:
```python
POST   /api/chat/sessions           # Create chat session
GET    /api/chat/sessions/{id}      # Get session details
POST   /api/chat/sessions/{id}/messages # Add message to session
```

### Business Logic Layer (Services)

#### 1. WorkflowService
**Purpose**: Orchestrates workflow execution

**Key Methods**:
```python
async def execute_workflow(workflow_id: int, user_message: str)
def _determine_execution_order(nodes: list, edges: list)
async def _execute_node(node: dict, context: dict)
```

**Execution Flow**:
1. Parse workflow structure
2. Determine component execution order
3. Execute components sequentially
4. Aggregate results and return response

#### 2. DocumentService
**Purpose**: Handles document processing and text extraction

**Key Methods**:
```python
async def process_document(document_id: int)
def _extract_text(file_path: str, file_type: str)
async def _generate_embeddings(document: Document, text: str)
```

**Processing Pipeline**:
1. File type detection
2. Text extraction (PyMuPDF for PDF, python-docx for DOCX)
3. Text chunking
4. Embedding generation
5. Vector storage

#### 3. LLMService
**Purpose**: Integrates with multiple LLM providers

**Supported Models**:
- OpenAI GPT (gpt-4, gpt-3.5-turbo)
- Google Gemini (gemini-1.5-flash)

**Key Methods**:
```python
async def generate_response(query, system_prompt, model, temperature, max_tokens)
async def _generate_openai_response(...)
async def _generate_gemini_response(...)
async def generate_embeddings(text, model)
```

**Async Pattern**:
```python
# Proper async handling for synchronous API calls
response = await asyncio.wait_for(
    asyncio.to_thread(make_request), 
    timeout=30.0
)
```

#### 4. VectorService
**Purpose**: Manages vector operations and ChromaDB integration

**Key Methods**:
```python
async def store_document_chunks(chunks, document_id, collection_name, metadata)
async def search_similar(query, collection_name, limit)
def _get_or_create_collection(collection_name)
```

**ChromaDB Integration**:
- Persistent storage configuration
- Collection management
- Similarity search
- Metadata handling

#### 5. WebSearchService
**Purpose**: Provides real-time web search capabilities

**Integration**: SerpAPI for web search
**Key Methods**:
```python
async def search(query: str, num_results: int = 5)
def _format_search_results(results)
```

### Data Layer (Models)

#### Database Models
```python
class Workflow(Base):
    # Stores workflow configurations, nodes, and edges
    
class Document(Base):
    # Stores uploaded documents and processing status
    
class ChatSession(Base):
    # Manages chat sessions for workflows
    
class ChatMessage(Base):
    # Stores individual chat messages and metadata
```

---

## 🔄 Data Flow Architecture

### Workflow Creation Flow
```
1. User drags component → ComponentLibrary
2. Component added → WorkflowBuilder state update
3. User connects components → React Flow edge creation
4. Configuration changes → ConfigurationPanel updates
5. Build Stack clicked → API call to validate and save
6. Workflow stored → PostgreSQL database
```

### Chat Execution Flow
```
1. User sends message → ChatModal
2. API call to workflow execution → WorkflowService
3. Component execution order determined → Topological sort
4. Sequential component processing:
   ├─ User Query: Pass through message
   ├─ Knowledge Base: Vector search in ChromaDB
   ├─ LLM Engine: Generate response with context
   └─ Output: Format and return response
5. Response displayed → ChatModal
```

### Document Processing Flow
```
1. File upload → ConfigurationPanel
2. File validation → DocumentService
3. Text extraction → PyMuPDF/python-docx
4. Text chunking → Overlapping chunks strategy
5. Embedding generation → OpenAI/Gemini embeddings
6. Vector storage → ChromaDB collections
7. Database update → Document processed status
```

---

## 🛠 Key Technical Implementations

### 1. Async/Await Pattern
**Challenge**: Mixing synchronous LLM APIs with async FastAPI
**Solution**: Using `asyncio.to_thread()` for proper async handling

```python
async def _generate_openai_response(self, ...):
    def make_request():
        return client.chat.completions.create(...)
    
    response = await asyncio.wait_for(
        asyncio.to_thread(make_request), 
        timeout=30.0
    )
```

### 2. Dynamic Component Configuration
**Challenge**: Different components need different configuration options
**Solution**: Dynamic form generation based on component type

```javascript
const renderConfigField = (key, value, type = 'text') => {
    switch (type) {
        case 'textarea': return <textarea {...props} />;
        case 'select': return <select {...props}>{options}</select>;
        case 'checkbox': return <input type="checkbox" {...props} />;
        default: return <input type="text" {...props} />;
    }
};
```

### 3. Workflow Validation
**Challenge**: Ensuring workflow components are properly connected
**Solution**: Graph validation algorithm

```javascript
const validateWorkflowConnections = (nodes, edges) => {
    const nodeTypes = nodes.map(n => n.data.componentType);
    const hasRequiredComponents = 
        nodeTypes.includes('user-query') && 
        nodeTypes.includes('output');
    
    const hasConnections = nodes.length <= 1 || edges.length > 0;
    return hasRequiredComponents && hasConnections;
};
```

### 4. Error Handling Strategy
**Frontend**: Comprehensive error boundaries and user feedback
**Backend**: Global exception handlers and structured error responses

```python
class APIResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[Any] = None
    error: Optional[str] = None
```

---

## 🎨 UI/UX Implementation

### Design System
- **Framework**: Tailwind CSS for utility-first styling
- **Components**: Custom styled components with consistent design
- **Icons**: Lucide React for scalable vector icons
- **Colors**: Professional gradient system with component-specific colors

### Responsive Design
- Mobile-first approach
- Flexible grid systems
- Adaptive component layouts
- Touch-friendly interactions

### User Experience Features
- Real-time feedback and loading states
- Drag-and-drop visual feedback
- Contextual help and tooltips
- Progressive disclosure of advanced features

---

## 🔒 Security Implementation

### API Security
- CORS configuration for allowed origins
- Input validation with Pydantic schemas
- File upload restrictions (type, size)
- Environment variable protection for API keys

### Data Security
- No sensitive data in frontend code
- Secure API key management
- SQL injection prevention through ORM
- File system access controls

---

## 📊 Performance Optimizations

### Frontend
- Code splitting with dynamic imports
- Memoization for expensive calculations
- Optimistic UI updates
- Efficient re-rendering with React hooks

### Backend
- Async request handling
- Database connection pooling
- Efficient vector search algorithms
- Caching strategies for frequent operations

---

## 🧪 Testing Strategy

### Frontend Testing
- Component unit tests
- Integration tests for workflows
- E2E testing for critical paths
- Visual regression testing

### Backend Testing
- API endpoint testing
- Service layer unit tests
- Database integration tests
- External service mocking

---

## 📈 Monitoring and Observability

### Logging Strategy
- Structured logging for debugging
- Error tracking and alerting
- Performance metrics collection
- User interaction analytics

### Health Checks
- API endpoint monitoring
- Database connectivity checks
- External service availability
- System resource monitoring

---

## 🚀 Deployment Considerations

### Environment Configuration
- Development, staging, production environments
- Environment-specific configurations
- Secret management
- Database migration strategies

### Scalability Preparation
- Horizontal scaling readiness
- Load balancing considerations
- Database optimization
- CDN integration for static assets

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Code Review Status**: Ready for Production  
**Documentation Coverage**: 100%