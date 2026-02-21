import json
from contextlib import asynccontextmanager
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import Asset, Parameter, FormulaValidationRequest, OnboardingConfig
import ast

import uvicorn

DATA_DIR = Path(__file__).parent / "data"

# In-memory storage for mock data
db = {
    "assets": [],
    "parameters": []
}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load the mock JSON data
    try:
        with open(DATA_DIR / "assets.json", "r") as f:
            db["assets"] = [Asset(**a) for a in json.load(f)]
            
        with open(DATA_DIR / "parameters.json", "r") as f:
            db["parameters"] = [Parameter(**p) for p in json.load(f)]
        print(f"Loaded {len(db['assets'])} assets and {len(db['parameters'])} parameters successfully.")
    except Exception as e:
        print(f"Failed to load mock data: {e}")
        
    yield
    # Shutdown: Clear data
    db.clear()

app = FastAPI(title="LatSpace API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok", "message": "LatSpace API is running"}

@app.get("/api/parameters", response_model=List[Parameter])
async def get_parameters(asset_types: Optional[str] = None):
    if not asset_types:
        return db["parameters"]
        
    requested_types = [t.strip().lower() for t in asset_types.split(",")]
    
    # 1. Find all asset names that correspond to the requested types
    matching_asset_names = {
        asset.name for asset in db["assets"]
        if asset.type in requested_types
    }
    
    # 2. Filter parameters where applicable_assets intersects with matching_asset_names
    filtered_params = [
        p for p in db["parameters"]
        if any(a in matching_asset_names for a in p.applicable_assets)
    ]
    
    
    return filtered_params

@app.post("/api/validate-formula")
async def validate_formula(request: FormulaValidationRequest):
    try:
        tree = ast.parse(request.expression, mode='eval')
    except SyntaxError as e:
        return {"is_valid": False, "missing_parameters": [], "error": f"Invalid syntax: {e.msg}"}
    
    extracted_vars = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Name):
            extracted_vars.add(node.id)
            
    enabled_set = set(request.enabled_parameters)
    missing = sorted(list(extracted_vars - enabled_set))
    
    if missing:
        return {"is_valid": False, "missing_parameters": missing}
        
    return {"is_valid": True, "missing_parameters": []}

@app.post("/api/onboarding")
async def onboarding(payload: OnboardingConfig):
    print(f"Successfully onboarded plant: {payload.plant.name}")
    return {
        "status": "success",
        "message": "Plant configuration accepted",
        "data_received": payload.model_dump()
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",   # file_name:variable_name
        host="0.0.0.0",
        port=8000,
        reload=True   # Auto-reload for development
    )