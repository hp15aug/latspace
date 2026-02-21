# LatSpace: Industrial ESG Platform

**Track Chosen:** Track B: Parameter Onboarding Wizard (Full-Stack)  
**Why this track?** I chose this track because transforming a rigid, easily broken Excel workflow into a dynamic, intuitive web experience perfectly highlights my strengths in handling complex state management and robust client-side validation. It allows me to showcase a polished, resilient solution that directly solves the core user frustration of onboarding parameters and formulas interactively.

---

## Assignment Details

### Architecture Decisions & Tradeoffs
- **Next.js & React Hook Form + Zod (Frontend):** Selected to handle the progressive disclosure wizard. This provides rigorous, instant client-side validation for complex nested relationships (like verifying mathematical formulas against available parameters) before any API interaction.
- **FastAPI & Python `ast` (Backend):** Chosen for its exceptional performance, typing, and auto-generated OpenAPI documentation. I deliberately used the native `ast` module to safely parse and validate mathematical expressions, avoiding risky alternatives like `eval()`.
- **In-Memory Data Architecture (Tradeoff):** To streamline the setup and review process for this assignment, I opted for structured, in-memory mock data (for parameters/assets) rather than scaffolding a full relational database (PostgreSQL/SQLite). The REST API handles this smoothly and could be trivially swapped out for a fully-fledged ORM later.
- **Client-Side Wizard State (Tradeoff):** The wizard state is maintained entirely on the client until the final "Deploy" step. This avoids writing partial or invalid states to the database, but it does mean a hard browser refresh will clear the user's progress.

### What I'd Improve with More Time
- **Persistent Drafts & Auto-Saving:** I would introduce a database to save intermediate wizard progress (drafts) locally or server-side, preventing users from losing potentially hours of configuration if they close their tab.
- **Intelligent Formula Editor:** I would replace the standard formula input with an advanced editor featuring autocomplete for valid variables (based on selected assets) and real-time syntax highlighting.
- **Automated E2E Testing:** Add a suite of end-to-end tests via Cypress or Playwright to simulate extreme edge cases across the multi-step form and thoroughly test formula validation under varying user scenarios.

---

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

## Quick Start & Setup Instructions

There are two ways to run the LatSpace application: using Docker Compose (Recommended), or running the services manually.

### 1. Running with Docker Compose (Recommended)

**Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

From the root directory of this repository, simply run:

```bash
docker compose up --build
```
This command will build and launch both the Python backend on **Port 8000** and the Next.js frontend on **Port 3000**, with them communicating on an internal network.
👉 Access the app at: **http://localhost:3000**

*(To elegantly stop, run: `docker compose down`)*

### 2. Running Manually (Local Development)

If you prefer to run the services bare-metal without Docker:

**Backend (Python + FastAPI)**
Launch a terminal, and start the Uvicorn server:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn application.main:app --reload
```
👉 The API will be available at **http://localhost:8000**

**Frontend (Next.js)**
Open a separate terminal to run the UI:
```bash
cd frontend
npm install
npm run dev
```
👉 The web app will be available at **http://localhost:3000**

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
