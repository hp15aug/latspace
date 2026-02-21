# LatSpace Frontend

The LatSpace frontend is a high-end, modern wizard-based React interface built on Next.js 16. Its purpose is to elegantly guide industrial operations managers through the complex process of onboarding their facilities, assets, and environmental monitoring parameters into the LatSpace ecosystem.

## Core Features

- **Progressive Disclosure:** Uses a state-managed step wizard to break down physical asset architecture, parameter selection, and mathematical formula definitions into digestible stages.
- **Micro-Animations & SaaS Aesthetics:** Integrates Framer Motion for smooth transitions, dynamic UI updates (like adding/removing assets), and a polished, professional look using the Inter typeface.
- **Robust State Management:** Utilizes a global React Context (`WizardContext.tsx`) built into `layout.tsx` to handle cross-step validation and persistent data accumulation.
- **Live Form Validation:** Employs `react-hook-form` coupled with `zod` schema resolvers for immediate, strict user-input verification (e.g., unique internal naming constraints, required address formats).
- **Backend Hybrid Integration:** Fetches dynamic parameters conditionally matching user-selected asset types, with robust fallbacks in place for offline or development scenarios. It also reaches out to the server to safely validate user-defined AST mathematical formulas against variable scopes.
- **JSON Payload Generation:** Culminates in an interactive, copy/downloadable final review stage demonstrating the final structured output payload to be synced with the FastAPI backend.

## Key Screens & Flows

1. **Welcome Screen:** Introductory context setting with a clean, centered interface.
2. **Plant Information:** Basic facility data gathering.
3. **Asset Registration:** Dynamic multi-input listing to build the facility's physical hierarchy (Boilers, Turbines, Kilns, etc.).
4. **Parameter Selection:** Conditional fetching and multi-option checkboxes grouped by category to determine exactly what datastreams the plant outputs. Allows category overrides.
5. **Formula Engine:** Users map inputs to outputs via syntax-highlighted inputs that ping the server for AST validity based on their chosen variables.
6. **Final Review:** Outputs a beautifully rendered `config.json` highlighting with `react-syntax-highlighter`.

## Tech Stack Overview

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Vanilla CSS imports for animations/scrollbars)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Forms/Validation:** React Hook Form & Zod
- **Font:** Google Inter

## Development Setup

The repository relies on standard `npm` packaging.

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

By default, the Next.js server runs on [http://localhost:3000](http://localhost:3000). 
The environment configuration (`.env` or `next.config.ts`) expects a locally running backend at `http://localhost:8000` to fetch dynamic parameters, but it provides dummy fallback data out of the box if no server is running.
