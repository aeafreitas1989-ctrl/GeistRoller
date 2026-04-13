# ---- Stage 1: Build React frontend ----
FROM node:20-alpine AS frontend-build

WORKDIR /frontend

COPY frontend/package.json ./

RUN corepack enable && yarn install

COPY frontend/ ./

# In production, API is served from the same origin
ENV REACT_APP_BACKEND_URL=""
RUN yarn build

# ---- Stage 2: Python backend + static frontend ----
FROM python:3.11-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt \
    --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/

# Copy backend source
COPY backend/ ./

# Copy built frontend into backend/static
COPY --from=frontend-build /frontend/build ./static

EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
