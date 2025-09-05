# GenAI Stack - No-Code AI Workflow Builder

## 🎯 Assignment Overview
**Position**: Full Stack Engineer Internship 2025  
**Company**: AI Planet  
**Submission Date**: January 2025

## 🚀 Live Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📋 Project Summary
GenAI Stack is a comprehensive No-Code/Low-Code web application that enables users to visually create and interact with intelligent AI workflows. Users can drag and drop components to build workflows that handle user input, extract knowledge from documents, interact with language models, and return answers through a chat interface.

## ✅ Assignment Requirements Fulfilled

### Core Components Implemented
- ✅ **User Query Component**: Entry point for user questions
- ✅ **Knowledge Base Component**: Document upload, processing, and vector search
- ✅ **LLM Engine Component**: Multi-LLM support (OpenAI GPT + Google Gemini)
- ✅ **Output Component**: Interactive chat interface

### Tech Stack Requirements Met
- ✅ **Frontend**: React.js with Vite
- ✅ **Backend**: FastAPI
- ✅ **Database**: PostgreSQL
- ✅ **Drag & Drop**: React Flow
- ✅ **Vector Store**: ChromaDB
- ✅ **LLM Integration**: OpenAI GPT + Google Gemini
- ✅ **Web Search**: SerpAPI
- ✅ **Document Processing**: PyMuPDF + python-docx

### Key Features Delivered
- ✅ Visual workflow builder with drag-and-drop interface
- ✅ Real-time chat interface for workflow execution
- ✅ Document upload and vector-based knowledge retrieval
- ✅ Multi-LLM support with web search capabilities
- ✅ Workflow validation and state management
- ✅ Responsive design with Tailwind CSS
- ✅ Complete API with comprehensive error handling

## 🏗 Architecture Overview

### Frontend Architecture
```
React.js Application (Vite)
├── WorkflowBuilder (Main Canvas)
├── ComponentLibrary (Drag Components)
├── ConfigurationPanel (Component Settings)
├── ChatModal (Interaction Interface)
└── Custom Nodes (4 Core Components)
```

### Backend Architecture
```
FastAPI Application
├── Routers (API Endpoints)
├── Services (Business Logic)
├── Models (Database Schema)
├── Schemas (Data Validation)
└── External Integrations (LLM, Vector DB, Search)
```

### Data Flow
```
User Input → Workflow Validation → Component Execution → LLM Processing → Response Display
```

## 🚦 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- PostgreSQL (running)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Add your API keys to .env

# Start server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📱 How to Use

1. **Build Workflow**: Drag components from library to canvas
2. **Connect Components**: Draw connections between components
3. **Configure Settings**: Click components to set their parameters
4. **Build Stack**: Validate and prepare workflow for execution
5. **Chat Interface**: Test your workflow with real queries

## 🧪 Testing Examples

### Example Workflow 1: Simple Q&A
```
User Query → LLM Engine → Output
```

### Example Workflow 2: Document-Powered
```
User Query → Knowledge Base → LLM Engine → Output
```

### Example Workflow 3: Web-Enhanced
```
User Query → LLM Engine (with web search) → Output
```

## 📚 Documentation

- **Architecture Design**: [Link to HLD/LLD Document]
- **Code Documentation**: [Link to Detailed Documentation]
- **Demo Video**: [Link to Demo Video]

## 🎯 Assignment Deliverables

- ✅ **Full source code** (frontend + backend)
- ✅ **README with setup instructions**
- ✅ **Clear component structure and modular design**
- ✅ **All four core components implemented**
- ✅ **Document upload and processing**
- ✅ **Vector embeddings and search**
- ✅ **LLM integration (multiple providers)**
- ✅ **Web search integration**
- ✅ **Interactive chat interface**
- ✅ **Workflow validation and execution**
- ✅ **Professional UI with Tailwind CSS**

## 👨‍💻 Developer Information

**Name**: [Your Name]  
**Email**: [Your Email]  
**Position**: Full Stack Engineer Internship 2025  
**GitHub**: [Your GitHub Profile]

## 📞 Support

For any questions or issues:
1. Check the API documentation at `/docs`
2. Review the troubleshooting section in main README
3. Contact: [Your Email]

---

**Thank you for considering my application for the Full Stack Engineer Internship at AI Planet!** 🚀