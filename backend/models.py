from sqlmodel import SQLModel, Field
from typing import Optional

class Project(SQLModel, table=True):
    """SQLModel class for the Project table"""
    id: int = Field(default=None, primary_key=True)
    title: str
    description: str
    image: Optional[str]
    client: Optional[str]
    project_date: Optional[str]
    github_link: Optional[str]
    category: str
    


class Profile(SQLModel, table=True):
    """SQLModel class for the Profile table"""
    id: int = Field(default=1, primary_key=True) 
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
    
class Experience(SQLModel, table=True):
    """SQLModel class for the Experience table"""
    id: int = Field(default=None, primary_key=True)
    position: str
    company: str
    start_date: str
    end_date: Optional[str] 
    description: str

class Skills(SQLModel, table=True):
    """SQLModel class for the Skills table"""
    id: int = Field(default=None, primary_key=True)
    skill: str
    percentage: int
    

    
class Education(SQLModel, table=True):
    """SQLModel class for the Education table"""
    id: int = Field(default=None, primary_key=True)
    degree: str
    school: str
    year: str
    description: str