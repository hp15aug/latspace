# LatSpace: Industrial ESG Platform

LatSpace is a full-stack, wizard-based application designed to elegantly guide industrial operations managers through the complex process of onboarding their facilities, physical assets, and environmental monitoring parameters into the LatSpace ecosystem.

This repository contains the complete source code for both the frontend user interface and the backend REST API, configured for seamless local development and production-ready containerization.

## Project Structure

The project is divided into two main isolated services:

- **Frontend (`/frontend`)**: A modern, high-end React interface built on Next.js 16. It handles the progressive disclosure wizard, dynamic form validation, micro-animations, and JSON payload generation.
- **Backend (`/backend`)**: A robust REST API built with Python and FastAPI. It serves dynamic mock data (parameters and assets), validates AST-based mathematical formulas, and receives the final onboarding configurations.

### In-Depth Documentation
For detailed information regarding the individual services, please consult their respective README files:
- 📖 [**Frontend Documentation**](./frontend/README.md) — (Features, UI flows, Tech Stack, Next.js Setup)
- 📖 [**Backend Documentation**](./backend/README.md) — (API Endpoints, Python Setup, Formula Engine)

## Quick Start & Deployment

The entire LatSpace stack is fully containerized using Docker. The easiest and recommended way to run the project is using Docker Compose.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.
- Ensure the Docker daemon is actively running.

### Running with Docker Compose

From the root directory of this repository, simply run:

```bash
docker compose up --build
```

This command will:
1. Build the lightweight Python backend image and launch it on **Port 8000**.
2. Build the optimized Next.js standalone frontend image and launch it on **Port 3000**.
3. Establish an internal bridged network between the two containers for seamless server-side communication.

Once the build is complete and both containers are running, you can access the application at:
👉 **http://localhost:3000**

### Shutting Down
To gracefully stop the containers, use:
```bash
docker compose down
```

## Tech Stack Highlights

**Frontend App:**
- Next.js 16 (App Router paradigm)
- TypeScript / Tailwind CSS / Framer Motion
- React Hook Form / Zod Validation

**Backend API:**
- Python 3.10+ / FastAPI / Uvicorn
- Pydantic models
- Native `ast` (Abstract Syntax Tree) module for secure formula evaluation

**Infrastructure:**
- Multi-stage Dockerfiles (Alpine Base Images)
- Docker Compose configuration
