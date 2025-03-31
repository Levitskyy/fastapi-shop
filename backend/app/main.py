

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import database
from app.routers import products
from app.auth.routes import auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.init_db()
    yield

app = FastAPI(
    root_path='/api',
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",
    "ws://localhost:3000",
    "http://localhost:8000",
    "ws://localhost:8000",
    "http://localhost:80",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time"]
)

app.include_router(products.router, prefix='/products', tags=['products'])
app.include_router(auth_router, prefix='/auth', tags=['auth'])