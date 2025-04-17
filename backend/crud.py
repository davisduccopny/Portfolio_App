from sqlmodel import Session, select,func
from fastapi import HTTPException
from models import Project, Profile, Experience, Education, Skills, ContactForm, Testimonials,Blogs
from config import BASE_URL_IMAGE

# Profile CRUD
def get_profile(session: Session):
    return session.exec(select(Profile)).first()

# Experience CRUD
def get_experiences(session: Session, limit: int = 5, offset: int = 0):
    total = session.exec(select(func.count()).select_from(Experience)).one()
    base_query = select(Experience).order_by(Experience.id.asc())
    if limit > 0:
        base_query = base_query.offset(offset).limit(limit)

    experiences = session.exec(base_query).all()

    return {
        "total": total,
        "experiences": experiences
    }

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
def get_education(session: Session, limit: int = 5, offset: int = 0):
    total = session.exec(select(func.count()).select_from(Education)).one()
    base_query = select(Education).order_by(Education.id.asc())
    if limit > 0:
        base_query = base_query.offset(offset).limit(limit)

    education_list = session.exec(base_query).all()

    return {
        "total": total,
        "education": education_list
    }

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
def get_all_projects(session: Session, limit: int = 5, offset: int = 0):
    total = session.exec(select(func.count()).select_from(Project)).one()
    base_query = select(Project).order_by(Project.id.asc())
    if limit > 0:
        base_query = base_query.offset(offset).limit(limit)

    projects = session.exec(base_query).all()

    for project in projects:
        if project.image:
            project.image = f"{BASE_URL_IMAGE}{project.image}"

    return {
        "total": total,
        "projects": projects
    }

def get_project_by_id(session: Session, project_id: int):
    return session.get(Project, project_id)

def delete_project(session: Session, project_id: int):
    project = session.get(Project, project_id)
    if project:
        session.delete(project)
        session.commit()
# Skills CRUD
def get_skills(session: Session, limit: int = 5, offset: int = 0):
    total = session.exec(select(func.count()).select_from(Skills)).one()
    base_query = select(Skills).order_by(Skills.id.asc())
    
    if limit > 0:
        base_query = base_query.offset(offset).limit(limit)

    skills = session.exec(base_query).all()

    return {
        "total": total,
        "skills": skills
    }

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
# Contact CRUD
def read_contact_form(session: Session, limit: int = 5, offset: int = 0):
    total = session.exec(select(func.count()).select_from(ContactForm)).one()
    base_query = select(ContactForm).order_by(ContactForm.created_at.desc())
    if limit > 0:
        base_query = base_query.offset(offset).limit(limit)

    contact_forms = session.exec(base_query).all()

    return {
        "total": total,
        "contact_forms": contact_forms
    }

def get_contact_form_by_id(session: Session, contact_id: int):
    return session.get(ContactForm, contact_id)

def create_contact_form(session: Session, contact: ContactForm):
    session.add(contact)
    session.commit()
    session.refresh(contact)
    return contact

def delete_contact_form(session: Session, contact_id: int):
    contact = session.get(ContactForm, contact_id)
    if contact:
        session.delete(contact)
        session.commit()
# Testimonials CRUD
def get_testimonials(session: Session, limit: int = 5, offset: int = 0):
    total = session.exec(select(func.count()).select_from(Testimonials)).one()
    base_query = select(Testimonials).order_by(Testimonials.id.desc())
    if limit > 0:
        base_query = base_query.offset(offset).limit(limit)

    testimonials = session.exec(base_query).all()

    for testimonial in testimonials:
        if testimonial.image:
            testimonial.image = f"{BASE_URL_IMAGE}{testimonial.image}"

    return {
        "total": total,
        "testimonials": testimonials
    }

def get_testimonial_by_id(session: Session, testimonial_id: int):
    return session.get(Testimonials, testimonial_id)

def create_testimonial(session: Session, testimonial: Testimonials):
    session.add(testimonial)
    session.commit()
    session.refresh(testimonial)
    return testimonial

def delete_testimonial(session: Session, testimonial_id: int):
    testimonial = session.get(Testimonials, testimonial_id)
    if testimonial:
        session.delete(testimonial)
        session.commit()

# Blogs CRUD
def get_blogs(session: Session, limit: int = 5, offset: int = 0):
    total = session.exec(select(func.count()).select_from(Blogs)).one()
    base_query = select(Blogs).order_by(Blogs.created_at.desc())

    if limit > 0:
        base_query = base_query.offset(offset).limit(limit)

    blogs = session.exec(base_query).all()

    blog_summaries = []
    for blog in blogs:
        if blog is None:
            continue
        
        blog_dict = {
            "id": blog.id,
            "title": blog.title,
            "description": blog.description,
            "created_at": blog.created_at,
            "image": f"{BASE_URL_IMAGE}{blog.image}" if blog.image else None,
            "category": {
                "id": blog.category.id,
                "name": blog.category.name
            } if blog.category else None,
            "tags": [{"id": tag.id, "name": tag.name} for tag in blog.tags]
        }

        blog_summaries.append(blog_dict)

    return {
        "total": total,
        "blogs": blog_summaries
    }

def query_blogs_by_search_string(session: Session, search_string: str, limit: int = 5, offset: int = 0):
    total = session.exec(select(func.count()).select_from(Blogs).where(
        (Blogs.title.ilike(f"%{search_string}%")) | (Blogs.description.ilike(f"%{search_string}%"))
    )).one()
    base_query = select(Blogs).where(
        (Blogs.title.ilike(f"%{search_string}%")) | (Blogs.description.ilike(f"%{search_string}%"))
    ).order_by(Blogs.created_at.desc())

    if limit > 0:
        base_query = base_query.offset(offset).limit(limit)

    blogs = session.exec(base_query).all()

    blog_summaries = []
    for blog in blogs:
        if blog is None:
            continue
        
        blog_dict = {
            "id": blog.id,
            "title": blog.title,
            "description": blog.description,
            "created_at": blog.created_at,
            "image": f"{BASE_URL_IMAGE}{blog.image}" if blog.image else None,
            "category": {
                "id": blog.category.id,
                "name": blog.category.name
            } if blog.category else None,
            "tags": [{"id": tag.id, "name": tag.name} for tag in blog.tags]
        }

        blog_summaries.append(blog_dict)

    return {
        "total": total,
        "blogs": blog_summaries
    }

def read_blogs_by_category_id(session: Session, category_id: int, limit: int = 5, offset: int = 0):
    total = session.exec(select(func.count()).select_from(Blogs).where(Blogs.category_id == category_id)).one()
    base_query = select(Blogs).where(Blogs.category_id == category_id).order_by(Blogs.created_at.desc())

    if limit > 0:
        base_query = base_query.offset(offset).limit(limit)

    blogs = session.exec(base_query).all()

    blog_summaries = []
    for blog in blogs:
        if blog is None:
            continue
        
        blog_dict = {
            "id": blog.id,
            "title": blog.title,
            "description": blog.description,
            "created_at": blog.created_at,
            "image": f"{BASE_URL_IMAGE}{blog.image}" if blog.image else None,
            "category": {
                "id": blog.category.id,
                "name": blog.category.name
            } if blog.category else None,
            "tags": [{"id": tag.id, "name": tag.name} for tag in blog.tags]
        }

        blog_summaries.append(blog_dict)

    return {
        "total": total,
        "blogs": blog_summaries
    }

def read_blogs_by_tag_ids(session:Session, tag_id:int, limit:int=5, offset:int=0):
    total = session.exec(select(func.count()).select_from(Blogs).where(Blogs.tags.any(id=tag_id))).one()
    base_query = select(Blogs).where(Blogs.tags.any(id=tag_id)).order_by(Blogs.created_at.desc())

    if limit > 0:
        base_query = base_query.offset(offset).limit(limit)

    blogs = session.exec(base_query).all()

    blog_summaries = []
    for blog in blogs:
        if blog is None:
            continue

        blog_dict = {
            "id": blog.id,
            "title": blog.title,
            "description": blog.description,
            "created_at": blog.created_at,
            "image": f"{BASE_URL_IMAGE}{blog.image}" if blog.image else None,
            "category": {
                "id": blog.category.id,
                "name": blog.category.name
            } if blog.category else None,
            "tags": [{"id": tag.id, "name": tag.name} for tag in blog.tags]
        }

        blog_summaries.append(blog_dict)

    return {
        "total": total,
        "blogs": blog_summaries
    }
    

def create_blog(session: Session, blog: Blogs):
    session.add(blog)
    session.commit()
    session.refresh(blog)
    return blog

def delete_blog(session: Session, blog_id: int):
    blog = session.get(Blogs, blog_id)
    if blog:
        session.delete(blog)
        session.commit()