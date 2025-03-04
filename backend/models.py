from sqlmodel import SQLModel, Field
from typing import Optional

class Project(SQLModel, table=True):
    """SQLModel class for the Project table"""
    id: int = Field(default=None, primary_key=True)
    title: str
    description: str
    image: Optional[str]
    github_link: Optional[str]

class Profile(SQLModel, table=True):
    """SQLModel class for the Profile table"""
    id: int = Field(default=1, primary_key=True) 
    name: str
    title: str
    avatar: Optional[str]  
    background: Optional[str] 
    email: str
    about: str 
    
class Experience(SQLModel, table=True):
    """SQLModel class for the Experience table"""
    id: int = Field(default=None, primary_key=True)
    position: str
    company: str
    start_date: str
    end_date: Optional[str] 
    description: str
    
class Education(SQLModel, table=True):
    """SQLModel class for the Education table"""
    id: int = Field(default=None, primary_key=True)
    degree: str
    school: str
    year: str
    description: str