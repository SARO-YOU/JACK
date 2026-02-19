import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours
    
    # Email (Gmail SMTP - may not work on Render free tier)
    EMAIL_USER = os.getenv('EMAIL_USER')
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    
    # Resend (for email sending)
    RESEND_API_KEY = os.getenv('RESEND_API_KEY')
    
    # Admin
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')
    ALLOWED_ADMIN_NAMES = ['Jacob Mae','Bernice Makena', 'DLQ 33', 'Immanuel Taiti']  # Change these to actual admin names
    
    # App
    SECRET_KEY = os.getenv('SECRET_KEY')
    MAX_DELIVERY_FEE = int(os.getenv('MAX_DELIVERY_FEE', 220))
    
    # CORS
    CORS_HEADERS = 'Content-Type'