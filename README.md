# Potato Guard - Potato Disease Detection System

Potato Guard is a full-stack web application for farmers in Nyandarua County, Kenya. It uses a trained CNN model to detect potato leaf and tuber diseases, recommends appropriate chemicals and management practices, and locates the nearest verified agrovets using GPS.

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Tailwind CSS, react-hot-toast, lucide-react
- **Backend**: FastAPI, SQLAlchemy, MySQL, TensorFlow, JWT auth

## Backend Setup

1. Create and configure a MySQL database (e.g. `potato_guard`), then run:

```sql
SOURCE db_schema.sql;
```

2. Copy `.env.example` to `.env` and update values (MySQL credentials, JWT secret, CORS origins).

3. Install backend dependencies and run the API:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Make sure ml_model/potato_cnn_model.keras and ml_model/class_indices.json exist
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend Setup

1. Install dependencies:

```bash
cd frontend/vite-project
npm install
```

2. Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` and will talk to the FastAPI backend at `http://localhost:8000/api`.

## Key Features

- User signup/login with JWT-based authentication
- Protected dashboard for uploading potato leaf/tuber images
- CNN-based prediction of 7 disease classes with confidence scores
- Chemical and management recommendations loaded from `backend/data/chemicals.json`
- User detection history with pagination and deletion
- GPS-based lookup of nearest agrovets using the Haversine formula
