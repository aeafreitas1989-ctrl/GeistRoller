# Geist: The Sin-Eaters — AI Storyteller

An AI-powered Storyteller for **Geist: the Sin-Eaters 2nd Edition**, where the AI takes the role of the Storyteller with full access to the rules of the game.

Built with React, FastAPI, and MongoDB.

---

## Features

- AI Storyteller with deep knowledge of Geist 2e rules, Haunts, Keys, Conditions, and character mechanics
- Interactive digital character sheet with full Sin-Eater stats
- Card-based tracking for Conditions, Haunts, Keys, Merits, Ceremonies, and Mementos
- Dice roller with game-specific logic (10-again, rote, chance die, Haunt activation)
- Clickable roll suggestions embedded in AI responses
- End-of-Chapter Beat calculation
- Session & Campaign management
- Dark gothic horror UI

---

## Quick Start (Docker Compose)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- An [Emergent LLM Key](https://emergentagent.com) for AI features

### 1. Clone & configure

```bash
git clone <your-repo-url>
cd <repo-folder>
cp .env.example .env
```

Edit `.env` and add your Emergent LLM key:

```
EMERGENT_LLM_KEY=sk-emergent-xxxxxxxxxxxxxxxx
```

### 2. Run

```bash
docker-compose up --build
```

The app will be available at **http://localhost:8001**.

### 3. Stop

```bash
docker-compose down
```

Data persists in a Docker volume (`mongo_data`). To wipe data:
```bash
docker-compose down -v
```

---

## Deploy to a Cloud Service

The single `Dockerfile` bundles frontend + backend into one container. You can deploy it to any service that supports Docker containers.

### Requirements
- A MongoDB instance (e.g., [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)
- Set these environment variables on your hosting platform:

| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net`) |
| `DB_NAME` | Database name (default: `geist_storyteller`) |
| `EMERGENT_LLM_KEY` | Your Emergent LLM key for AI features |
| `CORS_ORIGINS` | Allowed origins (set to `*` or your domain) |

### Example: Railway / Render / Fly.io

1. Push your repo to GitHub
2. Connect the repo to your hosting platform
3. Set the environment variables above
4. Deploy — the Dockerfile will be detected automatically
5. Expose port **8001**

---

## Development

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/
uvicorn server:app --reload --port 8001
```

### Frontend (React)
```bash
cd frontend
yarn install
REACT_APP_BACKEND_URL=http://localhost:8001 yarn start
```

---

## Project Structure

```
├── Dockerfile              # Multi-stage build (React + FastAPI)
├── docker-compose.yml      # App + MongoDB
├── .env.example            # Environment variable template
├── backend/
│   ├── server.py           # FastAPI routes + static file serving
│   ├── models.py           # Pydantic data models
│   ├── ai_prompts.py       # AI system prompts & context builders
│   ├── campaign_utils.py   # Campaign helper functions
│   ├── database.py         # MongoDB connection
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── data/            # Static game data (Haunts, Keys, Merits, etc.)
    │   ├── components/      # React components
    │   │   ├── character/   # Character sheet sub-components
    │   │   └── cards/       # Game card sub-components
    │   └── pages/
    └── package.json
```

---

## License

This project is a fan-made tool for personal use with the Geist: the Sin-Eaters tabletop RPG by Onyx Path Publishing. All game content belongs to its respective copyright holders.
