from fastapi import APIRouter, Depends, HTTPException,UploadFile, File, Form,Query
from sqlmodel import Session, select
from database import get_session
from crud import get_all_projects, get_project_by_id, delete_project,get_profile, get_experiences, add_experience, delete_experience, get_education, add_education, delete_education,get_skills,create_skill,delete_skill
from crud import get_education_by_id,get_experience_by_id,get_skill_by_id,read_contact_form,get_contact_form_by_id,delete_contact_form,create_contact_form
from crud import get_testimonials,get_testimonial_by_id,create_testimonial,delete_testimonial,get_blogs,get_blog_by_id,create_blog,delete_blog
from models import Project,Profile, Experience, Education, Skills,Login,ContactForm,Testimonials,Blogs
from schemas import ProjectCreate,ProfileUpdate, ExperienceCreate, EducationCreate, SkillCreate,LoginCreate,ContactCreate,TestimonialsCreate,BlogsCreate
from typing import List, Optional,Union
from config import BASE_URL_IMAGE, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
import cloudinary.uploader
from cloudinary.exceptions import NotFound
from config import cloudinary

import re
import io
import base64
import os
import uuid

from passlib.context import CryptContext
from datetime import datetime, timedelta,timezone
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

# Verify token
def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if 'exp' not in payload or datetime.now(timezone.utc) > datetime.fromtimestamp(payload['exp'], tz=timezone.utc):
            raise HTTPException(status_code=401, detail="Token has expired")
        return True 
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
@router.post("/verify_token")
async def verify_token_endpoint(token: str = Depends(verify_token)):
    return {"message": "Token is valid"}

# Manage profile
@router.get("/profile")
def read_profile(session: Session = Depends(get_session)):
    profile = get_profile(session)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    if profile.avatar:  
        profile.avatar = f"{BASE_URL_IMAGE}{profile.avatar}"
    if profile.background:
        profile.background = f"{BASE_URL_IMAGE}{profile.background}"
    return profile

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-image-ckeditor")
async def upload_image(file: UploadFile = File(...)):
    """Xử lý upload ảnh từ CKEditor"""
    folder_image = UPLOAD_DIR + "/ckeditor"
    if not os.path.exists(folder_image):
        os.makedirs(folder_image)

    file_extension = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4().hex}.{file_extension}"
    file_path = os.path.join(folder_image, file_name)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    return {"url": f"/{folder_image}/{file_name}"}

@router.put("/profile")
async def update_profile_info(
    name: str = Form(...),
    title: str = Form(...),
    birthdate: Optional[str] = Form(None),
    degree: Optional[str] = Form(None),
    freelance: Optional[str] = Form(None),
    email: str = Form(...),
    phone: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    google_map: str = Form(...),
    website: Optional[str] = Form(None),
    x_link: Optional[str] = Form(None),
    finallyacebook_link: Optional[str] = Form(None),
    github_link: Optional[str] = Form(None),
    linkedin_link: Optional[str] = Form(None),
    instagram_link: Optional[str] = Form(None),
    skype_link: Optional[str] = Form(None),
    about: str = Form(...),
    sumary: Optional[str] = Form(None),
    des_about_1: Optional[str] = Form(None),
    des_about_2: Optional[str] = Form(None),
    des_about_3: Optional[str] = Form(None),
    des_about_4: Optional[str] = Form(None),
    clients: Optional[int] = Form(None),
    projects: Optional[int] = Form(None),
    hours: Optional[int] = Form(None),
    workers: Optional[int] = Form(None),
    avatar: Optional[UploadFile] = File(None),
    background: Optional[UploadFile] = File(None),
    session: Session = Depends(get_session),
    valid_token: bool = Depends(verify_token)
):
    """Update profile information"""
    profile = session.exec(select(Profile)).first()
    if not profile:
        profile = Profile()

    # Cập nhật dữ liệu form
    profile.name = name
    profile.title = title
    profile.birthdate = birthdate
    profile.degree = degree
    profile.freelance = freelance
    profile.email = email
    profile.phone = phone
    profile.address = address
    profile.google_map = google_map
    profile.website = website
    profile.x_link = x_link
    profile.finallyacebook_link = finallyacebook_link
    profile.github_link = github_link
    profile.linkedin_link = linkedin_link
    profile.instagram_link = instagram_link
    profile.skype_link = skype_link
    profile.about = about
    profile.sumary = sumary
    profile.des_about_1 = des_about_1
    profile.des_about_2 = des_about_2
    profile.des_about_3 = des_about_3
    profile.des_about_4 = des_about_4
    profile.clients = clients
    profile.projects = projects
    profile.hours = hours
    profile.workers = workers
 
    if avatar and avatar.filename != "":
        if profile.avatar:
            try:
                # Kiểm tra ảnh có tồn tại không trước khi xóa
                cloudinary.api.resource(profile.avatar)
                cloudinary.api.delete_resources([profile.avatar])
            except NotFound:
                print("Avatar không tồn tại trong Cloudinary, bỏ qua xóa.")

        upload_result = cloudinary.uploader.upload(
            avatar.file,
            folder="portfolio/profile/"
        )
        profile.avatar = upload_result["public_id"]

    if background and background.filename != "":
        if profile.background:
            try:
                cloudinary.api.resource(profile.background)
                cloudinary.api.delete_resources([profile.background])
            except NotFound:
                print("Background không tồn tại trong Cloudinary, bỏ qua xóa.")

        upload_result = cloudinary.uploader.upload(
            background.file,
            folder="portfolio/profile/"
        )
        profile.background = upload_result["public_id"]
        
    session.add(profile)
    session.commit()

    return {
        "message": "Profile updated successfully",
        "avatar": profile.avatar,
        "background": profile.background,
    }

# Manage experiences
@router.get("/experience")
def read_experiences(session: Session = Depends(get_session), limit: int = Query(5, ge=0), offset: int = Query(0, ge=0)):
    return get_experiences(session, limit=limit, offset=offset)

@router.get("/experience/{exp_id}")
def read_experience(exp_id: int, session: Session = Depends(get_session)):
    experience = get_experience_by_id(session, exp_id)
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    return experience

@router.post("/experience")
def create_experience(exp_data: ExperienceCreate, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Create a new experience"""
    return add_experience(session, Experience(**exp_data.model_dump()))

@router.delete("/experience/{exp_id}")
def remove_experience(exp_id: int, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Delete an experience"""
    delete_experience(session, exp_id)
    return {"message": "Experience deleted"}

@router.put("/experience/{exp_id}")
def update_experience(exp_id: int, exp_data: ExperienceCreate, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Update information of an experience"""
    experience = get_experience_by_id(session, exp_id)
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    for key, value in exp_data.model_dump().items():
        setattr(experience, key, value)
    session.commit()
    session.refresh(experience)
    return experience

# Manage education
@router.get("/education")
def read_education(session: Session = Depends(get_session),limit: int = Query(5, ge=0), offset: int = Query(0, ge=0)):
    """Get education records"""
    return get_education(session,limit=limit,offset=offset)

@router.get("/education/{edu_id}")
def read_education_by_id(edu_id: int, session: Session = Depends(get_session)):
    education = get_education_by_id(session, edu_id)
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
    return education

@router.post("/education")
def create_education(edu_data: EducationCreate, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Create a new education"""
    return add_education(session, Education(**edu_data.model_dump()))

@router.delete("/education/{edu_id}")
def remove_education(edu_id: int, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Delete an education"""
    delete_education(session, edu_id)
    return {"message": "Education deleted"}

@router.put("/education/{edu_id}")
def update_education(edu_id: int, edu_data: EducationCreate, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Update information of an education"""
    education = get_education_by_id(session, edu_id)
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
    for key, value in edu_data.model_dump().items():
        setattr(education, key, value)
    session.commit()
    session.refresh(education)
    return education

# Manage projects
@router.get("/projects")
def read_projects(session: Session = Depends(get_session), limit: int = Query(5, ge=0), offset: int = Query(0, ge=0)):
    """Get projects"""
    return get_all_projects(session, limit=limit, offset=offset)

@router.get("/projects/categories", response_model=List[str])
def get_unique_categories_projects(session: Session = Depends(get_session)):
    statement = select(Project.category).distinct()
    results = session.exec(statement).all()
    return results

@router.get("/projects/{project_id}")
def read_project(project_id: int, session: Session = Depends(get_session)):
    project = get_project_by_id(session, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.image:
        project.image = f"{BASE_URL_IMAGE}{project.image}"
    return project

@router.post("/projects")
async def add_project(
    title: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    client: Optional[str] = Form(None),
    project_date: Optional[str] = Form(None),
    github_link: Optional[str] = Form(None),
    category: str = Form(...),
    session: Session = Depends(get_session),
    valid_token: bool = Depends(verify_token)
    ):
    """Add new Project"""
    project = Project(
        title=title,
        description=description,
        client=client,
        project_date=project_date,
        github_link=github_link,
        category=category
    )

    if image and image.filename != "":
        if project.image:
            try:
                # Kiểm tra ảnh có tồn tại không trước khi xóa
                cloudinary.api.resource(project.image)
                cloudinary.api.delete_resources([project.image])
            except NotFound:
                print("Image không tồn tại trong Cloudinary, bỏ qua xóa.")

        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="portfolio/projects/"
        )
        project.image = upload_result["public_id"]

    session.add(project)
    session.commit()
    session.refresh(project)

    return {
        "message": "Project created successfully",
        "project": project
    }

@router.put("/projects/{project_id}")
async def update_project(
    project_id: int,
    title: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    client: Optional[str] = Form(None),
    project_date: Optional[str] = Form(None),
    github_link: Optional[str] = Form(None),
    category: str = Form(...),
    session: Session = Depends(get_session),
    valid_token: bool = Depends(verify_token)
    ):
    """Update info image and upload project"""
    project = get_project_by_id(session, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Cập nhật dữ liệu form
    project.title = title
    project.description = description
    project.client = client
    project.project_date = project_date
    project.github_link = github_link
    project.category = category

    if image and image.filename != "":
        if project.image:
            try:
                # Kiểm tra ảnh có tồn tại không trước khi xóa
                cloudinary.api.resource(project.image)
                cloudinary.api.delete_resources([project.image])
            except NotFound:
                print("Image không tồn tại trong Cloudinary, bỏ qua xóa.")

        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="portfolio/projects/"
        )
        project.image = upload_result["public_id"]

    session.commit()
    session.refresh(project)

    return {
        "message": "Project updated successfully",
        "project": project
    }

@router.delete("/projects/{project_id}")
def remove_project(project_id: int, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Delete a project"""
    project = get_project_by_id(session, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Xóa ảnh hiện có nếu tồn tại trên Cloudinary
    if project.image:
        try:
            cloudinary.api.resource(project.image)
            cloudinary.api.delete_resources([project.image])
        except NotFound:
            print("Image không tồn tại trong Cloudinary, bỏ qua xóa.")
    
    delete_project(session, project_id)
    return {"message": "Project deleted successfully"}
# Manage skills
@router.get("/skills")
def read_skills(session: Session = Depends(get_session), limit: int = Query(5, ge=0), offset: int = Query(0, ge=0)):
    """Get skills"""
    return get_skills(session, limit=limit, offset=offset)

@router.get("/skills/{skill_id}")
def read_skill(skill_id: int, session: Session = Depends(get_session)):
    skill = get_skill_by_id(session, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill

@router.post("/skills")
def add_skill(skill: SkillCreate, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Create a new skill"""
    return create_skill(session, Skills(**skill.model_dump()))

@router.delete("/skills/{skill_id}")
def remove_skill(skill_id: int, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Delete a skill"""
    delete_skill(session, skill_id)
    return {"message": "Skill deleted"}

@router.put("/skills/{skill_id}")
def update_skill(skill_id: int, skill_data: SkillCreate, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Update information of a skill"""
    skill = get_skill_by_id(session, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    for key, value in skill_data.model_dump().items():
        setattr(skill, key, value)
    session.commit()
    session.refresh(skill)
    return skill
# Login
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login")
def login(request: LoginCreate, session: Session = Depends(get_session)):
    user = session.exec(select(Login).where(Login.username == request.username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Username not found")
    if not pwd_context.verify(request.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
    
@router.put("/login")
def update_login(request: LoginCreate,session: Session = Depends(get_session),valid_token: bool = Depends(verify_token)):
    login = session.exec(select(Login)).first()
    if not login:
        raise HTTPException(status_code=404, detail="Login not found")
    if request.password:
        hashed_password = pwd_context.hash(request.password)
        login.password = hashed_password
    if request.username:
        existing_user = session.exec(select(Login).where(Login.username == request.username)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
        login.username = request.username
    session.commit()
    return {"message": "Login updated successfully"}
# Contact form
@router.get("/contact")
def read_contact(session: Session = Depends(get_session), limit: int = Query(5, ge=0), offset: int = Query(0, ge=0)):
    """Get contact form entries"""
    return read_contact_form(session, limit=limit, offset=offset)

@router.get("/contact/{contact_id}")
def read_contact_by_id(contact_id: int, session: Session = Depends(get_session)):
    contact = get_contact_form_by_id(session, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.post("/contact")
def create_contactForm(name: str = Form(...),
    email: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...), session: Session = Depends(get_session)):
    """Create a new contact form entry"""
    contact = ContactForm(
        name=name,
        email=email,
        subject=subject,
        message=message
    )
    return create_contact_form(session, contact)

@router.delete("/contact/{contact_id}")
def remove_contact(contact_id: int, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Delete a contact form entry"""
    delete_contact_form(session, contact_id)
    return {"message": "Contact form entry deleted"}
# Testimonials
@router.get("/testimonials")
def read_testimonials(session: Session = Depends(get_session), limit: int = Query(5, ge=0), offset: int = Query(0, ge=0)):
    return get_testimonials(session, limit=limit, offset=offset)

@router.get("/testimonials/{testimonial_id}")
def read_testimonial(testimonial_id: int, session: Session = Depends(get_session)):
    testimonial = get_testimonial_by_id(session, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    if testimonial.image:
        testimonial.image = f"{BASE_URL_IMAGE}{testimonial.image}"
    return testimonial

@router.post("/testimonials")
def add_testimonial(
    name: str = Form(...),
    position: str = Form(...),
    company: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    session: Session = Depends(get_session),
    valid_token: bool = Depends(verify_token)
    ):
    """Add new Testimonial"""
    testimonial = Testimonials(
        name=name,
        position=position,
        company=company,
        description=description
    )
    if image and image.filename != "":
        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="portfolio/testimonials/"
        )
        testimonial.image = upload_result["public_id"]
    return create_testimonial(session, testimonial)

@router.put("/testimonials/{testimonial_id}")
def update_testimonial(
    testimonial_id: int,
    name: str = Form(...),
    position: str = Form(...),
    company: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    session: Session = Depends(get_session),
    valid_token: bool = Depends(verify_token)
    ):
    """Update info image and upload Testimonial"""
    testimonial = get_testimonial_by_id(session, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    # Cập nhật dữ liệu form
    testimonial.name = name
    testimonial.position = position
    testimonial.company = company
    testimonial.description = description

    if image and image.filename != "":
        if testimonial.image:
            try:
                cloudinary.api.resource(testimonial.image)
                cloudinary.api.delete_resources([testimonial.image])
            except NotFound:
                print("Image không tồn tại trong Cloudinary, bỏ qua xóa.")

        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="portfolio/testimonials/"
        )
        testimonial.image = upload_result["public_id"]

    session.commit()
    session.refresh(testimonial)

    return {
        "message": "Testimonial updated successfully",
        "testimonial": testimonial
    }
    
@router.delete("/testimonials/{testimonial_id}")
def remove_testimonial(testimonial_id: int, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Delete a Testimonial"""
    testimonial = get_testimonial_by_id(session, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    # Xóa ảnh hiện có nếu tồn tại trên Cloudinary
    if testimonial.image:
        try:
            cloudinary.api.resource(testimonial.image)
            cloudinary.api.delete_resources([testimonial.image])
        except NotFound:
            print("Image không tồn tại trong Cloudinary, bỏ qua xóa.")
    
    delete_testimonial(session, testimonial_id)
    return {"message": "Testimonial deleted successfully"}
# Blogs
@router.get("/blogs")
def read_blogs(session: Session = Depends(get_session),limit: int = Query(5, ge=0),offset: int = Query(0, ge=0)):
    return get_blogs(session, limit=limit, offset=offset)

@router.get("/blogs/categories")
def get_unique_categories_blogs(session: Session = Depends(get_session)):
    statement = select(Blogs.category).distinct()
    results = session.exec(statement).all()
    return results

@router.get("/blogs/{blog_id}")
def get_blog_by_id_route(blog_id: int, session: Session = Depends(get_session)):
    blog = get_blog_by_id(session, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    if blog.image:
        blog.image = f"{BASE_URL_IMAGE}{blog.image}"
    return blog

@router.post("/blogs")
async def add_blog(
    title: str = Form(...),
    description: str = Form(...),
    body_blog: str = Form(...),
    image: Optional[UploadFile] = File(None),
    category: str = Form(...),
    session: Session = Depends(get_session),
    valid_token: bool = Depends(verify_token)
    ):
    """Add new Blog"""
    blog = Blogs(
        title=title,
        description=description,
        body_blog=body_blog,
        category=category
    )
    if image and image.filename != "":
        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="portfolio/blogs/"
        )
        blog.image = upload_result["public_id"]
    return create_blog(session, blog)

@router.put("/blogs/{blog_id}")
async def update_blog(
    blog_id: int,
    title: str = Form(...),
    description: str = Form(...),
    body_blog: str = Form(...),
    image: Optional[UploadFile] = File(None),
    category: str = Form(...),
    session: Session = Depends(get_session),
    valid_token: bool = Depends(verify_token)
    ):
    """Update info image and upload Blog"""
    blog = get_blog_by_id(session, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    # Cập nhật dữ liệu form
    blog.title = title
    blog.description = description
    blog.body_blog = body_blog
    blog.category = category

    if image and image.filename != "":
        if blog.image:
            try:
                cloudinary.api.resource(blog.image)
                cloudinary.api.delete_resources([blog.image])
            except NotFound:
                print("Image không tồn tại trong Cloudinary, bỏ qua xóa.")

        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="portfolio/blogs/"
        )
        blog.image = upload_result["public_id"]

    session.commit()
    session.refresh(blog)

    return {
        "message": "Blog updated successfully",
        "blog": blog
    }
    
@router.delete("/blogs/{blog_id}")
def remove_blog(blog_id: int, session: Session = Depends(get_session), valid_token: bool = Depends(verify_token)):
    """Delete a Blog"""
    blog = get_blog_by_id(session, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Xóa ảnh hiện có nếu tồn tại trên Cloudinary
    if blog.image:
        try:
            cloudinary.api.resource(blog.image)
            cloudinary.api.delete_resources([blog.image])
        except NotFound:
            print("Image không tồn tại trong Cloudinary, bỏ qua xóa.")
    
    delete_blog(session, blog_id)
    return {"message": "Blog deleted successfully"}