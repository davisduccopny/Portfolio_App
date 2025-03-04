from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session
from crud import get_all_projects, get_project_by_id, create_project, delete_project,get_profile, update_profile, get_experiences, add_experience, delete_experience, get_education, add_education, delete_education
from models import Project,Profile, Experience, Education
from schemas import ProjectCreate,ProfileUpdate, ExperienceCreate, EducationCreate

router = APIRouter()

# Manage profile
@router.get("/profile")
def read_profile(session: Session = Depends(get_session)):
    profile = get_profile(session)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile")
def update_profile_info(profile_data: ProfileUpdate, session: Session = Depends(get_session)):
    profile = get_profile(session)
    if not profile:
        profile = Profile(**profile_data.model_dump()) 
    else:
        for key, value in profile_data.model_dump().items():
            setattr(profile, key, value)
    return update_profile(session, profile)

# Manage experiences
@router.get("/experience")
def read_experiences(session: Session = Depends(get_session)):
    return get_experiences(session)

@router.post("/experience")
def create_experience(exp_data: ExperienceCreate, session: Session = Depends(get_session)):
    return add_experience(session, Experience(**exp_data.model_dump()))

@router.delete("/experience/{exp_id}")
def remove_experience(exp_id: int, session: Session = Depends(get_session)):
    delete_experience(session, exp_id)
    return {"message": "Experience deleted"}

# Manage education
@router.get("/education")
def read_education(session: Session = Depends(get_session)):
    return get_education(session)

@router.post("/education")
def create_education(edu_data: EducationCreate, session: Session = Depends(get_session)):
    return add_education(session, Education(**edu_data.model_dump()))

@router.delete("/education/{edu_id}")
def remove_education(edu_id: int, session: Session = Depends(get_session)):
    delete_education(session, edu_id)
    return {"message": "Education deleted"}

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
def add_project(project: ProjectCreate, session: Session = Depends(get_session)):
    return create_project(session, Project(**project.model_dump()))

@router.put("/projects/{project_id}")
def update_project(project_id: int, project_data: ProjectCreate, session: Session = Depends(get_session)):
    project = get_project_by_id(session, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in project_data.model_dump().items():
        setattr(project, key, value)
    session.commit()
    session.refresh(project)
    return project

@router.delete("/projects/{project_id}")
def remove_project(project_id: int, session: Session = Depends(get_session)):
    if not get_project_by_id(session, project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    delete_project(session, project_id)
    return {"message": "Project deleted successfully"}
