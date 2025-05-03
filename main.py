from fastapi import FastAPI,Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes import router,render_resume_html,render_blogs_html,render_blog_detail_html,render_project_detail,render_index_html,render_tag_list_html,render_tutorial_by_tag
from routes import render_blog_tutorial_detail_html
from database import init_db,get_session
from fastapi.staticfiles import StaticFiles
from fastapi import Request,Depends
from sqlmodel import Session
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from config import ORIGINS_URL

templates = Jinja2Templates(directory="templates")

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS_URL, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request, session: Session = Depends(get_session), limit: int = Query(9), offset: int = 0):
    data = render_index_html(session, limit=limit, offset=offset)
    return templates.TemplateResponse("index.html", 
                                      {"request": request, 
                                        "profile": data["profile"],
                                        "blogs": data["blogs"],
                                        "tags_used": data["tags_used"],
                                        "main_blog": data["main_blog"],
                                        "small_blogs": data["small_blogs"],
                                        "blogs_newest": data["blogs_newest"]})

@app.get("/resume", response_class=HTMLResponse)
async def resume(request: Request, session: Session = Depends(get_session), limit: int = Query(100), offset: int = 0):
    data = render_resume_html(session, limit=limit, offset=offset)
    return templates.TemplateResponse("resume.html", {"request": request, "data": data})
@app.get("/blogs-page", response_class=HTMLResponse)
async def blogs(request: Request, session: Session = Depends(get_session), limit: int = Query(12),page: int = Query(1, ge=1)):
    offset = (page - 1) * limit
    data = render_blogs_html(session,limit=limit, offset=offset,option_response=1)
    total = data['blogs']['total']
    total_pages = (total + limit - 1) // limit
    return templates.TemplateResponse(
        "blogs.html", 
        {
            "request": request,
            "blogs":   data['blogs']['blogs'],
            "current_page": page,
            "total_pages": total_pages,
            "limit": limit,
            "categories": data['categories'],
            "tags": data['tags'],
            "profile": data['profile'],
            "title_name": "Blogs",
            "show_p": "Explore our latest articles, insights, and updates. Stay informed and inspired with our curated content."
        },
    )

@app.get("/blogs/filter-blogs-tag-render/{tag_id}/{slug}", response_class=HTMLResponse)
async def filter_blogs_by_tag_render(request: Request,tag_id:int, session: Session = Depends(get_session), limit: int = Query(12),page: int = Query(1, ge=1)):
    offset = (page - 1) * limit
    data = render_blogs_html(session,limit=limit, offset=offset,tag_id=tag_id,option_response=3)
    total = data['blogs']['total']
    total_pages = (total + limit - 1) // limit
    return templates.TemplateResponse(
        "blogs.html", 
        {
            "request": request,
            "blogs":   data['blogs']['blogs'],
            "current_page": page,
            "total_pages": total_pages,
            "limit": limit,
            "categories": data['categories'],
            "tags": data['tags'],
            "profile": data['profile'],
            "title_name": data['option_name'],
            "show_p": f" {total} PAGES"
        },
    )


@app.get("/blogs/filter-blogs-category-render/{category_id}/{slug}", response_class=HTMLResponse)
async def filter_blogs_by_category_render(request: Request,category_id:int, session: Session = Depends(get_session), limit: int = Query(12),page: int = Query(1, ge=1)):
    offset = (page - 1) * limit
    data = render_blogs_html(session,limit=limit, offset=offset,category_id=category_id,option_response=2)
    total = data['blogs']['total']
    total_pages = (total + limit - 1) // limit
    return templates.TemplateResponse(
        "blogs.html", 
        {
            "request": request,
            "blogs":   data['blogs']['blogs'],
            "current_page": page,
            "total_pages": total_pages,
            "limit": limit,
            "categories": data['categories'],
            "tags": data['tags'],
            "profile": data['profile'],
            "title_name": data['option_name'],
            "show_p": f" {total} PAGES"
        },
    )

@app.get("/blogs/filter-blogs-search-string-render", response_class=HTMLResponse)
async def filter_blogs_by_search_string_render(request: Request,q: str = Query(..., alias="q"), session: Session = Depends(get_session), limit: int = Query(12),page: int = Query(1, ge=1)):
    offset = (page - 1) * limit
    data = render_blogs_html(session,limit=limit, offset=offset,search_string=q,option_response=4)
    total = data['blogs']['total']
    total_pages = (total + limit - 1) // limit
    return templates.TemplateResponse(
        "blogs.html", 
        {
            "request": request,
            "blogs":   data['blogs']['blogs'],
            "current_page": page,
            "total_pages": total_pages,
            "limit": limit,
            "categories": data['categories'],
            "tags": data['tags'],
            "profile": data['profile'],
            "title_name": data['option_name'],
            "show_p": f" {total} PAGES",
            "search": q
        },
    )

@app.get("/blogs-body/{blog_id}/{slug}", response_class=HTMLResponse,name="blog_detail")
async def blog_detail(request: Request,blog_id:int, session: Session = Depends(get_session)):
    data = render_blog_detail_html(session, blog_id=blog_id)
    return templates.TemplateResponse(
        "blog_detail.html", 
        {
            "request": request,
            "blog": data['blog'],
            "related_blogs": data['related_blogs'],
            "blogs_newest": data['blogs_newest'],
            "profile": data['profile']
        },
    )

@app.get("/projects-body/{project_id}/{slug}", response_class=HTMLResponse)
async def project_detail(request: Request,project_id:int, session: Session = Depends(get_session)):
    data = render_project_detail(session, project_id=project_id)
    return templates.TemplateResponse(
        "portfolio-details.html", 
        {
            "request": request,
            "project": data['project'],
            "profile": data['profile']
        },
    )

@app.get("/learning-hub/tutorials", response_class=HTMLResponse)
async def tutorials_render(request: Request, session: Session = Depends(get_session)):
    data = render_tag_list_html(session)
    return templates.TemplateResponse(
        "tutorials.html", 
        {
            "request": request,
            "tags": data['tags'],
            "profile": data['profile']
        },
    )

@app.get("/learning-hub/tutorials/{tag_id}/{slug}", response_class=HTMLResponse)
async def tutorials_by_tag_render(request: Request,tag_id:int, session: Session = Depends(get_session), limit: int = Query(12),page: int = Query(1, ge=1)):
    offset = (page - 1) * limit
    data = render_tutorial_by_tag(session,tag_id=tag_id,limit=limit, offset=offset)
    total = data['tutorials']['total']
    total_pages = (total + limit - 1) // limit
    return templates.TemplateResponse(
        "tutorial_list.html", 
        {
            "request": request,
            "tag_active": tag_id,
            "tutorials":   data['tutorials']['tutorials'],
            "current_page": page,
            "total_pages": total_pages,
            "limit": limit,
            "tags": data['tags'],
            "profile": data['profile'],
            "title_name": data['option_name'],
            "show_p": f" {total} PAGES"
        },
    )

@app.get("/learning-hub/tutorials-blog-body/{blog_id}/{slug}", response_class=HTMLResponse,name="blog_tutorial_detail")
async def blog_tutorial_detail(request: Request,blog_id:int, session: Session = Depends(get_session)):
    data = render_blog_tutorial_detail_html(session, blog_id=blog_id)
    return templates.TemplateResponse(
        "tutorial-blog-detail.html", 
        {
            "request": request,
            "blog": data['blog'],
            "related_blogs": data['related_blogs'],
            "list_blog_tutorial": data['list_blog_tutorial'],
            "previous_blog": data['previous_blog'],
            "next_blog": data['next_blog'],
            "profile": data['profile']
        },
    )
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

