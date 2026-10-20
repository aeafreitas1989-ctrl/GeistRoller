# ---- Stage 1: Build React frontend ----
FROM node:20-alpine AS frontend-build

WORKDIR /frontend

COPY frontend/package.json frontend/yarn.lock ./

RUN corepack enable && yarn install --frozen-lockfile

COPY frontend/ ./

# In production the API is served from the same origin.
ENV REACT_APP_BACKEND_URL=""
RUN yarn build


# ---- Stage 2: FastAPI backend + static frontend ----
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY --from=frontend-build /frontend/build ./static

EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
