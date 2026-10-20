# GeistRoller

A personal digital character-sheet and dice-rolling tool for **Geist: The Sin-Eaters 2nd Edition** and **Mage: The Awakening 2nd Edition**.

Built with React, FastAPI, and MongoDB. The application does not use an AI Storyteller or any external LLM service.

## Features

- Separate Geist and Mage character templates
- Chronicles of Darkness d10 roller with 8/9/10-again, rote quality, chance dice, and configurable exceptional-success thresholds
- Mage Arcana, Rotes, Praxes, Arcana Attainments, learned/Legacy Attainments, spell Factors, Reach, Paradox, Mana, Yantras, Mage Armor, and Mage Sight tools
- Geist Haunts, Keys, Mementos, Ceremonies, Synergy, Plasm, and Remembrance tracking
- Attributes, Skills, Merits, Aspirations, Conditions, inventory, armor, health, Willpower, Beats, and Experience
- Character JSON import/export
- Manual campaign data API retained for future/local campaign tracking

## Quick start with Docker

### Prerequisites

- Docker Desktop / Docker Compose
- Git

### 1. Clone and configure

```bash
git clone <your-repo-url>
cd GeistRoller
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

The default local configuration is:

```env
MONGO_URL=mongodb://mongo:27017
DB_NAME=geist_storyteller
CORS_ORIGINS=*
```

`DB_NAME=geist_storyteller` is intentionally retained so existing local Docker data continues to use the same database.

### 2. Run

```bash
docker compose up --build -d
```

Open **http://localhost:8001**.

### 3. Stop

```bash
docker compose down
```

MongoDB data persists in the `mongo_data` Docker volume. To deliberately erase it:

```bash
docker compose down -v
```

## Development

### Backend

```bash
pip install -r backend/requirements.txt
pytest backend/tests -q
cd backend
uvicorn server:app --reload --port 8001
```

### Frontend

```bash
cd frontend
corepack enable
yarn install
yarn build
```

For local frontend development against a separately running backend, set `REACT_APP_BACKEND_URL=http://localhost:8001`.

## Project structure

```text
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── server.py
│   ├── models.py
│   ├── dice_engine.py
│   ├── database.py
│   ├── requirements.txt
│   └── tests/
└── frontend/
    ├── src/
    │   ├── data/
    │   ├── components/
    │   │   ├── character/
    │   │   └── cards/
    │   └── pages/
    ├── package.json
    └── yarn.lock
```

## Notes

This is a fan-made personal-use tool. Game content and trademarks belong to their respective rights holders.
