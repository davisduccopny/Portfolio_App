from sqlmodel import Session, select
from models import Project, Profile, Experience, Education


# Profile CRUD
def get_profile(session: Session):
    return session.exec(select(Profile)).first()

def update_profile(session: Session, profile_data: Profile):
    session.add(profile_data)
    session.commit()
    session.refresh(profile_data)
    return profile_data
# Experience CRUD
def get_experiences(session: Session):
    return session.exec(select(Experience)).all()

def add_experience(session: Session, experience: Experience):
    session.add(experience)
    session.commit()
    session.refresh(experience)
    return experience

def delete_experience(session: Session, experience_id: int):
    exp = session.get(Experience, experience_id)
    if exp:
        session.delete(exp)
        session.commit()
# Education CRUD
def get_education(session: Session):
    return session.exec(select(Education)).all()

def add_education(session: Session, education: Education):
    session.add(education)
    session.commit()
    session.refresh(education)
    return education

def delete_education(session: Session, education_id: int):
    edu = session.get(Education, education_id)
    if edu:
        session.delete(edu)
        session.commit()
# Projects CRUD
def get_all_projects(session: Session):
    return session.exec(select(Project)).all()

def get_project_by_id(session: Session, project_id: int):
    return session.get(Project, project_id)

def create_project(session: Session, project_data: Project):
    session.add(project_data)
    session.commit()
    session.refresh(project_data)
    return project_data

def delete_project(session: Session, project_id: int):
    project = session.get(Project, project_id)
    if project:
        session.delete(project)
        session.commit()
