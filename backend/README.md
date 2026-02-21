# LatSpace Backend API

This is the backend for the LatSpace onboarding wizard.

## Purpose

The backend provides a REST API built with FastAPI that:
- Serves initial dummy data for parameters and assets based on plant types.
- Validates mathematical formulas (ensuring expressions are safely formed and only contain allowed parameters) used in the onboarding UI.
- Receives and handles the final plant configuration payload generated at the end of the wizard process.

## Features

- **In-Memory Store:** Uses a lifespan event handler to load mock initial data from `data/assets.json` and `data/parameters.json` into memory when the server starts, and clears it when it stops.
- **Dynamic Parameter Filtering:** Filters and returns applicable parameters dynamically based on the specific asset types selected by the user.
- **AST-Based Formula Validation:** Uses Python's native `ast` (Abstract Syntax Tree) module to safely parse user-provided mathematical formulas, extracting the variables without using dangerous methods like `eval()`.
- **CORS Support:** Full Cross-Origin Resource Sharing enabled for easy integration with frontend applications running on different ports/domains.
- **Auto-Reloading Server:** Integrated with Uvicorn for seamless hot-reloading during development.

## API Endpoints

### 1. Health Check
- **Endpoint:** `GET /`
- **Description:** Basic route to verify the API is running.
- **Response:** `{"status": "ok", "message": "LatSpace API is running"}`

### 2. Fetch Parameters
- **Endpoint:** `GET /api/parameters`
- **Query Params:** `asset_types` (Optional, string) - A comma-separated list of asset types (e.g., `boiler,turbine`).
- **Description:** Returns a list of parameters. If `asset_types` is provided, it first finds all assets matching those types, and then recursively filters parameters whose `applicable_assets` list intersects with the names of the matching assets.
- **Response:** List of parameter objects.

### 3. Validate Formula
- **Endpoint:** `POST /api/validate-formula`
- **Payload Structure:** 
  ```json
  {
      "expression": "steam_generation / coal_consumption",
      "enabled_parameters": ["steam_generation", "coal_consumption", "electricity_output"]
  }
  ```
- **Description:** Takes an expression and a list of currently enabled parameter names. It parses the syntax and checks if all mathematical variables present in the expression exist in the `enabled_parameters` list.
- **Response:** 
  - Valid: `{"is_valid": true, "missing_parameters": []}`
  - Invalid Syntax: `{"is_valid": false, "missing_parameters": [], "error": "Invalid syntax: ..."}`
  - Missing Parameters: `{"is_valid": false, "missing_parameters": ["unknown_variable"]}`

### 4. Submit Onboarding Configuration
- **Endpoint:** `POST /api/onboarding`
- **Payload Structure:** Full onboarding config containing `plant` info, list of selected `assets`, list of `parameters`, and list of defined `formulas`.
- **Description:** Mock endpoint that accepts the final assembled JSON payload from the frontend and acknowledges the configuration has been "successfully onboarded."
- **Response:** 
  ```json
  {
      "status": "success",
      "message": "Plant configuration accepted",
      "data_received": { ... payload ... }
  }
  ```

## Requirements

The project uses Python >= 3.10 and the following libraries:
- `fastapi`
- `uvicorn`
- `pydantic`

See `requirements.txt` for the full dependency list.

## Running the Development Server

To run the backend locally, you can use the standard python executable. 

If a virtual environment is present:

```bash
source venv/bin/activate
uvicorn main:app --reload
```

Or just directly:

```bash
python main.py
```

The server will auto-reload on file changes and the API will be available at `http://localhost:8000`.
