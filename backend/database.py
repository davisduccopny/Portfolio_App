from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "mysql+pymysql://samryvnc_user_portfolio:Hoangquoc318@103.200.23.68/samryvnc_portfolio"
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session

def init_db():
    SQLModel.metadata.create_all(engine)
