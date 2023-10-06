ARG PYTHON_VERSION=3.10-slim-bullseye

# Stage 1/2: Build the React frontend
FROM node:latest AS frontend-build

WORKDIR /code/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Stage 2/2: Build the Django backend
FROM python:${PYTHON_VERSION}
ARG DATABASE_URL
ENV DATABASE_URL $DATABASE_URL
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code/backend

COPY backend/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /code/backend
COPY backend ./

# Copy the built React app from the frontend-build stage to the Django static files directory
COPY --from=frontend-build /code/frontend/build /code/backend/build

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose the port that Django runs on (default is 8000)
EXPOSE 8000

# Start the Django development server
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD ["gunicorn", "--bind", ":8000", "--workers", "2", "backend.wsgi"]
