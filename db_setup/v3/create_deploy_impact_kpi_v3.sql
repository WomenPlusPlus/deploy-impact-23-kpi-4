-- Create User Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(255) NOT NULL
);

-- Create Circle Table
CREATE TABLE IF NOT EXISTS circles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create User_Circle Junction Table
CREATE TABLE IF NOT EXISTS user_circle (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    circle_id INTEGER REFERENCES circles(id) ON DELETE CASCADE
);

-- Create KPI Table
CREATE TABLE IF NOT EXISTS kpis (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    range VARCHAR(255) NOT NULL,
    periodicity VARCHAR(255) NOT NULL
);

-- Create Circle_KPI Junction Table
CREATE TABLE IF NOT EXISTS circle_kpi (
    id SERIAL PRIMARY KEY,
    circle_id INTEGER REFERENCES circles(id) ON DELETE CASCADE,
    kpi_id INTEGER REFERENCES kpis(id) ON DELETE CASCADE
);

-- Create Audit Table
CREATE TABLE IF NOT EXISTS audits (
    id SERIAL PRIMARY KEY,
    circle_kpi_id INTEGER REFERENCES circle_kpi(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    value DECIMAL NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Period Table
CREATE TABLE IF NOT EXISTS periods (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12)
);

-- Create DataPoint Table
CREATE TABLE IF NOT EXISTS datapoints (
    id SERIAL PRIMARY KEY,
    circle_kpi_id INTEGER REFERENCES circle_kpi(id) ON DELETE CASCADE,
    period_id INTEGER REFERENCES periods(id) ON DELETE CASCADE,
    value_id INTEGER REFERENCES audits(id) ON DELETE CASCADE
);
