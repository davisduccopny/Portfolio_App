from pydantic import BaseModel
from typing import List, Optional
import datetime

class ProjectCreate(BaseModel):
    """Pydantic model for Project"""
    title: str
    description: str
    image: Optional[str]
    client: Optional[str]
    project_date: Optional[str]
    github_link: Optional[str]
    category: str
    slug: Optional[str] = None
    
class ProfileUpdate(BaseModel):
    """Pydantic model for Profile"""
    name: str
    title: str
    avatar: Optional[str]  
    background: Optional[str]
    birthdate: Optional[str]
    degree: Optional[str]
    freelance: Optional[str] 
    email: str
    phone: Optional[str]
    address: Optional[str]
    google_map: str
    website: Optional[str]
    x_link: Optional[str]
    finallyacebook_link: Optional[str]
    github_link: Optional[str]
    linkedin_link: Optional[str]
    instagram_link: Optional[str]
    skype_link: Optional[str]
    about: str 
    sumary: Optional[str]
    des_about_1: Optional[str]
    des_about_2: Optional[str]
    des_about_3: Optional[str]
    des_about_4: Optional[str]
    clients: Optional[int]
    projects: Optional[int]
    hours: Optional[int]
    workers: Optional[int]
    
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
class SkillCreate(BaseModel):
    """Pydantic model for Skills"""
    skill: str
    percentage: int
    
class ContactCreate(BaseModel):
    """Pydantic model for ContactForm"""
    name: str
    email: str
    subject: str
    message: str
    created_at: Optional[datetime.datetime] = None
    
class TestimonialsCreate(BaseModel):
    """Pydantic model for Testmonial"""
    name: str
    position: str
    company: str
    description: str
    image: Optional[str]
    
class BlogCreate(BaseModel):
    """Pydantic model for Blog"""
    title: str
    description: str
    body_blog: str
    image: Optional[str] = None
    slug: Optional[str] = None
    category_id: int  
    tag_ids: Optional[List[int]] = [] 
    
class LoginCreate(BaseModel):
    """Pydantic model for login"""
    username: str
    password: str

class CategoryUsed(BaseModel):
    id: int
    name: str
    slug: str
    
class TagUsed(BaseModel):
    id: int
    name: str
    slug: str
    display: str
class TutorialUsed(BaseModel):
    title: str
    slug: str
    description: str
    image: Optional[str] = None
    tag_id:Optional[int] = None