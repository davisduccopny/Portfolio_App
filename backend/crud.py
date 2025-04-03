from sqlmodel import Session, select
from models import Project, Profile, Experience, Education, Skills


# Profile CRUD
def get_profile(session: Session):
    return session.exec(select(Profile)).first()

# Experience CRUD
def get_experiences(session: Session):
    return session.exec(select(Experience)).all()

def get_experience_by_id(session: Session, experience_id: int):
    return session.get(Experience, experience_id)

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

def get_education_by_id(session: Session, education_id: int):
    return session.get(Education, education_id)

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

def delete_project(session: Session, project_id: int):
    project = session.get(Project, project_id)
    if project:
        session.delete(project)
        session.commit()
# Skills CRUD
def get_skills(session: Session):
    return session.exec(select(Skills)).all()

def get_skill_by_id(session: Session, skill_id: int):
    return session.get(Skills, skill_id)

def create_skill(session: Session, skill: Skills):
    session.add(skill)
    session.commit()
    session.refresh(skill)
    return skill
def delete_skill(session: Session, skill_id: int):
    skill = session.get(Skills, skill_id)
    if skill:
        session.delete(skill)
        session.commit()
        