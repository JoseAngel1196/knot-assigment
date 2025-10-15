#!/usr/bin/env python3
"""
Database setup script for local development
Run this to initialize your SQLite database with tables
"""

import sys
from pathlib import Path

backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Import after path setup
from sqlalchemy import create_engine
from backend.models import Base
from backend import settings

def setup_database():
    """Initialize the SQLite database and create all tables"""
    print("🔧 Setting up SQLite database...")
    
    # Create the database engine
    engine = create_engine(
        settings.DATABASE_URL,
        echo=True,  # Show SQL queries for debugging
        connect_args={"check_same_thread": False}  # SQLite specific
    )
    
    try:
        # Create all tables
        print("📋 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        
        print("✅ Database setup complete!")
        print(f"📁 Database file: {settings.DATABASE_URL}")
        
        # Show created tables
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"📊 Created tables: {', '.join(tables)}")
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        sys.exit(1)
    
    finally:
        engine.dispose()

if __name__ == "__main__":
    setup_database()