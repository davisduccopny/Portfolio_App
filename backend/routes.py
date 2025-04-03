from fastapi import APIRouter, Depends, HTTPException,UploadFile, File, Form
from sqlmodel import Session, select
from database import get_session
from crud import get_all_projects, get_project_by_id, delete_project,get_profile, get_experiences, add_experience, delete_experience, get_education, add_education, delete_education,get_skills,create_skill,delete_skill
from crud import get_education_by_id,get_experience_by_id,get_skill_by_id
from models import Project,Profile, Experience, Education, Skills
from schemas import ProjectCreate,ProfileUpdate, ExperienceCreate, EducationCreate, SkillCreate
from typing import List, Optional

import re
import io
import base64
import os
import uuid


router = APIRouter()

# Manage profile
@router.get("/profile")
def read_profile(session: Session = Depends(get_session)):
    profile = get_profile(session)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
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
    session: Session = Depends(get_session)
):
    """Cập nhật profile và lưu ảnh lên server"""
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

    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    print(avatar.filename)
    print(background.filename)
    if avatar and avatar.filename != None and avatar.filename != "":
        if profile.avatar:
            old_avatar_path = profile.avatar.lstrip("/")
            if os.path.exists(old_avatar_path):
                os.remove(old_avatar_path)

        avatar_filename = f"{uuid.uuid4().hex}_{avatar.filename}"
        avatar_path = os.path.join(UPLOAD_DIR, avatar_filename)

        with open(avatar_path, "wb") as f:
            f.write(await avatar.read())

        profile.avatar = f"/{UPLOAD_DIR}/{avatar_filename}"  # Lưu đường dẫn đúng

    if background and background.filename != None and background.filename != "":
        if profile.background:
            old_background_path = profile.background.lstrip("/")
            if os.path.exists(old_background_path):
                os.remove(old_background_path)

        background_filename = f"{uuid.uuid4().hex}_{background.filename}"
        background_path = os.path.join(UPLOAD_DIR, background_filename)

        with open(background_path, "wb") as f:
            f.write(await background.read())

        profile.background = f"/{UPLOAD_DIR}/{background_filename}" 

    session.add(profile)
    session.commit()

    return {
        "message": "Profile updated successfully",
        "avatar": profile.avatar,
        "background": profile.background,
    }

# Manage experiences
@router.get("/experience")
def read_experiences(session: Session = Depends(get_session)):
    return get_experiences(session)

@router.get("/experience/{exp_id}")
def read_experience(exp_id: int, session: Session = Depends(get_session)):
    experience = get_experience_by_id(session, exp_id)
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    return experience

@router.post("/experience")
def create_experience(exp_data: ExperienceCreate, session: Session = Depends(get_session)):
    return add_experience(session, Experience(**exp_data.model_dump()))

@router.delete("/experience/{exp_id}")
def remove_experience(exp_id: int, session: Session = Depends(get_session)):
    delete_experience(session, exp_id)
    return {"message": "Experience deleted"}

@router.put("/experience/{exp_id}")
def update_experience(exp_id: int, exp_data: ExperienceCreate, session: Session = Depends(get_session)):
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
def read_education(session: Session = Depends(get_session)):
    return get_education(session)

@router.get("/education/{edu_id}")
def read_education_by_id(edu_id: int, session: Session = Depends(get_session)):
    education = get_education_by_id(session, edu_id)
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
    return education

@router.post("/education")
def create_education(edu_data: EducationCreate, session: Session = Depends(get_session)):
    return add_education(session, Education(**edu_data.model_dump()))

@router.delete("/education/{edu_id}")
def remove_education(edu_id: int, session: Session = Depends(get_session)):
    delete_education(session, edu_id)
    return {"message": "Education deleted"}

@router.put("/education/{edu_id}")
def update_education(edu_id: int, edu_data: EducationCreate, session: Session = Depends(get_session)):
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
def read_projects(session: Session = Depends(get_session)):
    return get_all_projects(session)

@router.get("/projects/{project_id}")
def read_project(project_id: int, session: Session = Depends(get_session)):
    project = get_project_by_id(session, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
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
    session: Session = Depends(get_session)
    ):
    """Thêm mới project và xử lý upload ảnh"""
    project = Project(
        title=title,
        description=description,
        client=client,
        project_date=project_date,
        github_link=github_link,
        category=category
    )

    if image and image.filename:
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)

        image_filename = f"{uuid.uuid4().hex}_{image.filename}"
        image_path = os.path.join(UPLOAD_DIR, image_filename)

        with open(image_path, "wb") as f:
            f.write(await image.read())

        project.image = f"/{UPLOAD_DIR}/{image_filename}"  # Lưu đường dẫn ảnh

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
    session: Session = Depends(get_session)
    ):
    """Cập nhật thông tin project và xử lý upload ảnh"""
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

    if image and image.filename:
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)
        if project.image:
            old_image_path = project.image.lstrip("/")
            if os.path.exists(old_image_path):
                os.remove(old_image_path)
        image_filename = f"{uuid.uuid4().hex}_{image.filename}"
        image_path = os.path.join(UPLOAD_DIR, image_filename)

        with open(image_path, "wb") as f:
            f.write(await image.read())

        project.image = f"/{UPLOAD_DIR}/{image_filename}"  # Lưu đường dẫn ảnh mới

    session.commit()
    session.refresh(project)

    return {
        "message": "Project updated successfully",
        "project": project
    }

@router.delete("/projects/{project_id}")
def remove_project(project_id: int, session: Session = Depends(get_session)):
    project = get_project_by_id(session, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Xóa ảnh hiện có nếu tồn tại
    if project.image:
        image_path = project.image.lstrip("/")
        if os.path.exists(image_path):
            os.remove(image_path)
    
    delete_project(session, project_id)
    return {"message": "Project deleted successfully"}
# Manage skills
@router.get("/skills")
def read_skills(session: Session = Depends(get_session)):
    return get_skills(session)

@router.get("/skills/{skill_id}")
def read_skill(skill_id: int, session: Session = Depends(get_session)):
    skill = get_skill_by_id(session, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill

@router.post("/skills")
def add_skill(skill: SkillCreate, session: Session = Depends(get_session)):
    return create_skill(session, Skills(**skill.model_dump()))

@router.delete("/skills/{skill_id}")
def remove_skill(skill_id: int, session: Session = Depends(get_session)):
    delete_skill(session, skill_id)
    return {"message": "Skill deleted"}

@router.put("/skills/{skill_id}")
def update_skill(skill_id: int, skill_data: SkillCreate, session: Session = Depends(get_session)):
    skill = get_skill_by_id(session, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    for key, value in skill_data.model_dump().items():
        setattr(skill, key, value)
    session.commit()
    session.refresh(skill)
    return skill