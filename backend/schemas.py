from pydantic import BaseModel
from typing import List, Optional

class ProjectCreate(BaseModel):
    """Pydantic model for Project"""
    title: str
    description: str
    image: Optional[str]
    github_link: Optional[str]
    
class ProfileUpdate(BaseModel):
    """Pydantic model for Profile"""
    name: str
    title: str
    avatar: Optional[str]
    background: Optional[str]
    email: str
    about: str
    
class ExperienceCreate(BaseModel):
    """Pydantic model for Experience"""
    position: str
    company: str
    start_date: str
    end_date: Optional[str]
    description: str

class EducationCreate(BaseModel):
    """Pydantic model for Education"""
    degree: str
    school: str
    year: str
    description: str