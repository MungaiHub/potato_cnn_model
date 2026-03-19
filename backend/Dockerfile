FROM python:3.10-slim AS backend

WORKDIR /app

# Install basic build tools (TensorFlow and some deps may need them)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code into a proper python package folder.
# Your code imports from `backend.*`, so `backend/` must exist in the container.
COPY . /app/backend

# Expose FastAPI port
EXPOSE 8000

# Run the FastAPI app with uvicorn
ENV PYTHONPATH=/app
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

