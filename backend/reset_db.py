import os
from app import app, db
from sqlalchemy import text

def reset_database():
    with app.app_context():
        print("🗑️  Dropping all tables with CASCADE...")
        
        # Get database connection
        with db.engine.connect() as conn:
            # Drop all tables using raw SQL with CASCADE
            conn.execute(text("""
                DROP SCHEMA public CASCADE;
                CREATE SCHEMA public;
                GRANT ALL ON SCHEMA public TO postgres;
                GRANT ALL ON SCHEMA public TO public;
            """))
            conn.commit()
        
        print("✅ All tables dropped!")
        
        print("🏗️  Creating all tables...")
        db.create_all()
        print("✅ Tables created!")
        
        print("✅ Database reset complete!")

if __name__ == '__main__':
    reset_database()