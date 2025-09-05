from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.database import Base
import os

# Use SQLite for development if PostgreSQL is not available
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./genaistack.db")

# Create engine with appropriate settings
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()