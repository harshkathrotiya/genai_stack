from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
try:
    from app.routers import workflows, documents, chat, health
    from app.db.database import create_tables
except ImportError as e:
    print(f"Import error: {e}")
    # Create minimal app for testing
    app = FastAPI(title="GenAI Stack API - Basic Mode")
    
    @app.get("/")
    async def root():
        return {"message": "GenAI Stack API is running in basic mode", "error": str(e)}
        
    # Exit early
    if __name__ == "__main__":
        import uvicorn
        uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

app = FastAPI(
    title="GenAI Stack API",
    description="A No-Code/Low-Code workflow builder API for AI applications",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(workflows.router, prefix="/api/workflows", tags=["workflows"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

# Static files for uploaded documents
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Create database tables on startup
try:
    create_tables()
    print("Database tables created successfully")
except Exception as e:
    print(f"Warning: Could not create database tables: {e}")

@app.get("/")
async def root():
    return {"message": "GenAI Stack API is running!", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)