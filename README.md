# KPI App - Team 4

### Getting Started

- **Clone the Repository:**

```bash
git clone ...
```

- **Create/Activate a Virtual Environment:**

```bash
python -m venv venv
source venv/bin/activate
```

- **Install Dependencies:**

```bash
pip install -r backend/requirements.txt
```

### Running the Project

- **Set Execute Permissions:**

Before you can execute `local_setup.sh`, make sure to set execute permissions on the file. You can do this with the following command:

```bash
chmod +x local_setup.sh
```

- **Run the Setup Script:**

```bash
./local_setup.sh
```

- **Start the Development Server:**

```bash
python backend/manage.py runserver
```

Launch the development server to run the application locally. You can access it in your web browser at `http://localhost:8000`.

- **Create docker image:**
  export DATABASE_URL=[secret_postgresql_url]
  docker build -t kpi4_image --build-arg DATABASE_URL=$DATABASE_URL .

- **Deploy to fly.io:**
  export DATABASE_URL=[secret_postgresql_url]
  flyctl deploy --build-arg DATABASE_URL=$DATABASE_URL
