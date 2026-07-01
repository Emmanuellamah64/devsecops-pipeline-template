from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from app.routers import health, auth, reports

app = FastAPI(
    title="DevSecOps Pipeline Template API",
    description="Backend API for the DevSecOps security dashboard",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(reports.router, prefix="/api", tags=["reports"])

# Expose /metrics for Prometheus scraping — excluded from Swagger docs
Instrumentator(
    should_group_status_codes=False,
    excluded_handlers=[r"/metrics", r"/api/health"],
).instrument(app).expose(app, endpoint="/metrics", include_in_schema=False)


@app.get("/")
def root():
    return {"message": "DevSecOps Pipeline Template API", "version": "1.0.0"}
