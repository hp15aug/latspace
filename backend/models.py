from pydantic import BaseModel, ConfigDict
from typing import List

class Asset(BaseModel):
    name: str
    display_name: str
    type: str
    model_config = ConfigDict(extra='allow')

class Parameter(BaseModel):
    name: str
    display_name: str
    unit: str
    category: str
    section: str
    applicable_assets: List[str]
    model_config = ConfigDict(extra='allow')

class FormulaValidationRequest(BaseModel):
    expression: str
    enabled_parameters: List[str]
    model_config = ConfigDict(extra='allow')

class Plant(BaseModel):
    name: str
    model_config = ConfigDict(extra='allow')

class OnboardingConfig(BaseModel):
    plant: Plant
    model_config = ConfigDict(extra='allow')
