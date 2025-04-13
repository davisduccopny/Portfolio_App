from sqlmodel import SQLModel, Field,Column
from sqlalchemy import func
from typing import Optional
import datetime
from sqlalchemy.dialects.mysql import TEXT,VARCHAR

class Project(SQLModel, table=True):
    """SQLModel class for the Project table"""
    id: int = Field(default=None, primary_key=True)
    title: str
    description: str = Field(sa_column=Column(TEXT))
    image: Optional[str] = Field(sa_column=Column(VARCHAR(500)))
    client: Optional[str]
    project_date: Optional[str]
    github_link: Optional[str]
    category: str
    


class Profile(SQLModel, table=True):
    """SQLModel class for the Profile table"""
    id: int = Field(default=1, primary_key=True) 
    name: str
    title: str = Field(sa_column=Column(VARCHAR(500)))
    avatar: Optional[str] = Field(sa_column=Column(VARCHAR(500)))
    background: Optional[str] = Field(sa_column=Column(VARCHAR(500)))
    birthdate: Optional[str]
    degree: Optional[str]
    freelance: Optional[str] 
    email: str
    phone: Optional[str]
    address: Optional[str] = Field(sa_column=Column(VARCHAR(500)))
    google_map: str = Field(sa_column=Column(VARCHAR(500)))
    website: Optional[str]
    x_link: Optional[str]
    finallyacebook_link: Optional[str]
    github_link: Optional[str]
    linkedin_link: Optional[str]
    instagram_link: Optional[str]
    skype_link: Optional[str]
    about: str = Field(sa_column=Column(TEXT))
    sumary: Optional[str] = Field(sa_column=Column(TEXT))
    des_about_1: Optional[str] = Field(sa_column=Column(TEXT))
    des_about_2: Optional[str] = Field(sa_column=Column(TEXT))
    des_about_3: Optional[str] = Field(sa_column=Column(TEXT))
    des_about_4: Optional[str] = Field(sa_column=Column(TEXT))
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
    description: str = Field(sa_column=Column(TEXT))

class Skills(SQLModel, table=True):
    """SQLModel class for the Skills table"""
    id: int = Field(default=None, primary_key=True)
    skill: str
    percentage: int
    

    
class Education(SQLModel, table=True):
    """SQLModel class for the Education table"""
    id: int = Field(default=None, primary_key=True)
    degree: str
    school: str = Field(sa_column=Column(VARCHAR(500)))
    year: str
    description: str = Field(sa_column=Column(TEXT))

class ContactForm(SQLModel, table=True):
    """SQLModel class for the ContactForm table"""
    id: int = Field(default=None, primary_key=True)
    name: str
    email: str 
    subject: str = Field(sa_column=Column(VARCHAR(500)))
    message: str = Field(sa_column=Column(TEXT))
    created_at: Optional[datetime.datetime] = Field(
        default=None,
        sa_column_kwargs={"server_default": func.current_timestamp()}
    )

class Testimonials(SQLModel, table=True):
    """SQLModel class for the Testimonials table"""
    id: int = Field(default=None, primary_key=True)
    name: str
    position: str
    company: str
    description: str = Field(sa_column=Column(TEXT))
    image: Optional[str] = Field(sa_column=Column(VARCHAR(500)))

class Login(SQLModel,table=True):
    """SQLModel class for the LoginRequest table"""
    id: int = Field(default=None, primary_key=True)
    username: str
    password: str
    
class Blogs(SQLModel, table=True):
    """SQLModel class for the Blogs table"""
    id: int = Field(default=None, primary_key=True)
    title: str = Field(sa_column=Column(VARCHAR(500)))
    description: str = Field(sa_column=Column(VARCHAR(500)))
    body_blog: str = Field(sa_column=Column(TEXT))
    image: Optional[str] = Field(sa_column=Column(VARCHAR(500)))
    category: str
    created_at: Optional[datetime.datetime] = Field(
        default=None,
        sa_column_kwargs={"server_default": func.current_timestamp()}
    )
    