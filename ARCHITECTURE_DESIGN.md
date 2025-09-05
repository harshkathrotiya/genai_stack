# GenAI Stack - High Level & Low Level Design

## 📋 Document Overview
**Project**: GenAI Stack - No-Code AI Workflow Builder  
**Assignment**: Full Stack Engineer Internship 2025  
**Author**: [Your Name]  
**Date**: January 2025

---

## 🏗 High Level Design (HLD)

### System Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React.js)    │◄──►│   (FastAPI)     │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                      │                      │
├─ WorkflowBuilder     ├─ API Endpoints       ├─ OpenAI/Gemini
├─ ComponentLibrary    ├─ Business Logic      ├─ ChromaDB
├─ ChatInterface       ├─ Data Processing     ├─ SerpAPI
└─ ConfigPanel         └─ Database Layer      └─ PostgreSQL
```

### Core Components Architecture

1. **User Query Component**
   - Purpose: Entry point for user input
   - Functionality: Captures and validates user questions
   - Output: Passes query to next component in workflow

2. **Knowledge Base Component**
   - Purpose: Document processing and retrieval
   - Functionality: Upload, process, embed, and search documents
   - Technologies: PyMuPDF, ChromaDB, OpenAI Embeddings

3. **LLM Engine Component**
   - Purpose: AI processing and response generation
   - Functionality: Multi-LLM support with web search
   - Technologies: OpenAI GPT, Google Gemini, SerpAPI

4. **Output Component**
   - Purpose: Response display and interaction
   - Functionality: Chat interface with follow-up support
   - Features: Timestamps, conversation history

### Technology Stack Decision Matrix

| Component | Technology | Reasoning |
|-----------|------------|-----------|
| Frontend Framework | React.js | Component-based, rich ecosystem, requirement |
| Backend Framework | FastAPI | Async support, auto-documentation, Python ecosystem |
| Database | PostgreSQL | ACID compliance, JSON support, scalability |
| Vector Database | ChromaDB | Easy integration, persistent storage |
| Workflow Engine | React Flow | Drag-drop support, visual workflow building |
| Styling | Tailwind CSS | Utility-first, rapid development, consistent design |

---

## 🔧 Low Level Design (LLD)

### Database Schema

```sql
-- Workflows Table
CREATE TABLE workflows (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    nodes JSON,
    edges JSON,
    is_valid BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents Table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    file_path VARCHAR(500),
    processed BOOLEAN DEFAULT FALSE,
    text_content TEXT,
    embedding_count INTEGER DEFAULT 0,
    workflow_id INTEGER REFERENCES workflows(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat Sessions Table
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE,
    workflow_id INTEGER REFERENCES workflows(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES chat_sessions(id),
    message_type VARCHAR(20),
    content TEXT,
    message_metadata JSON,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints Design

#### Workflow Management
```
POST   /api/workflows/              # Create workflow
GET    /api/workflows/              # List workflows
GET    /api/workflows/{id}          # Get workflow
PUT    /api/workflows/{id}          # Update workflow
POST   /api/workflows/{id}/validate # Validate workflow
POST   /api/workflows/{id}/chat     # Execute workflow
```

#### Document Management
```
POST   /api/documents/upload        # Upload document
GET    /api/documents/              # List documents
GET    /api/documents/{id}          # Get document
DELETE /api/documents/{id}          # Delete document
```

#### Chat Management
```
POST   /api/chat/sessions           # Create chat session
GET    /api/chat/sessions/{id}      # Get session
POST   /api/chat/sessions/{id}/messages # Add message
```

### Component State Management

#### Frontend State Flow
```
1. User Action (Drag/Drop/Configure)
   ↓
2. Component State Update (React Hooks)
   ↓
3. API Call (if needed)
   ↓
4. Server Processing
   ↓
5. Response Update
   ↓
6. UI Re-render
```

#### Workflow Execution Flow
```
1. User Query Input
   ↓
2. Workflow Validation
   ↓
3. Component Execution Order Determination
   ↓
4. Sequential Component Processing
   ├─ Knowledge Base Search (if applicable)
   ├─ Web Search (if enabled)
   └─ LLM Processing
   ↓
5. Response Generation
   ↓
6. Output Display
```

### Security Considerations

1. **API Key Management**
   - Environment variables for sensitive data
   - No API keys in frontend code
   - Secure key rotation capability

2. **Input Validation**
   - Pydantic schemas for request validation
   - File type and size restrictions
   - SQL injection prevention

3. **CORS Configuration**
   - Restricted origins for production
   - Proper headers handling

### Performance Optimizations

1. **Database**
   - Indexes on frequently queried columns
   - Connection pooling
   - Async operations

2. **Frontend**
   - Code splitting with React.lazy
   - Memoization for expensive computations
   - Optimistic UI updates

3. **Vector Search**
   - Persistent ChromaDB storage
   - Efficient embedding generation
   - Chunking strategy for large documents

### Error Handling Strategy

1. **Frontend**
   - Try-catch blocks for API calls
   - User-friendly error messages
   - Fallback UI states

2. **Backend**
   - Global exception handlers
   - Structured error responses
   - Logging for debugging

3. **External Services**
   - Retry mechanisms
   - Graceful degradation
   - Alternative service fallbacks

---

## 🚀 Deployment Architecture

### Development Environment
```
Local Machine
├─ Frontend (localhost:5173)
├─ Backend (localhost:8000)
├─ PostgreSQL (localhost:5432)
└─ ChromaDB (local files)
```

### Production Considerations
```
Cloud Infrastructure
├─ Frontend (Vercel/Netlify)
├─ Backend (AWS/GCP/Azure)
├─ Database (Managed PostgreSQL)
├─ Vector Store (ChromaDB Cloud/Pinecone)
└─ File Storage (S3/Cloud Storage)
```

---

## 📊 System Metrics & Monitoring

### Key Performance Indicators
- Workflow execution time
- Document processing speed
- LLM response latency
- User engagement metrics

### Monitoring Points
- API response times
- Database query performance
- External service availability
- Error rates and types

---

## 🔄 Future Enhancements

### Phase 1 Extensions
- User authentication and workspace management
- Workflow templates and sharing
- Advanced analytics dashboard

### Phase 2 Extensions
- Real-time collaboration
- Custom component SDK
- Multi-language support

### Phase 3 Extensions
- Enterprise features
- Advanced AI capabilities
- Integration marketplace

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Review Status**: Ready for Submission