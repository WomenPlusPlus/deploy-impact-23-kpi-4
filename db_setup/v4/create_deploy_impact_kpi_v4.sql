-- Create Role Table
CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- Create Range Table
CREATE TABLE IF NOT EXISTS range (
    id SERIAL PRIMARY KEY,
    range_value VARCHAR(255) UNIQUE NOT NULL
);

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role_id INTEGER REFERENCES role(id) ON DELETE CASCADE
);

-- Create Circle Table
CREATE TABLE IF NOT EXISTS circle (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create User_Circle Junction Table
CREATE TABLE IF NOT EXISTS user_circle (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    circle_id INTEGER REFERENCES circle(id) ON DELETE CASCADE
);

-- Create KPI Table
CREATE TABLE IF NOT EXISTS kpi (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    range_id INTEGER REFERENCES range(id) ON DELETE CASCADE,
    periodicity VARCHAR(255) NOT NULL
);

-- Create Circle_KPI Junction Table
CREATE TABLE IF NOT EXISTS circle_kpi (
    id SERIAL PRIMARY KEY,
    circle_id INTEGER REFERENCES circle(id) ON DELETE CASCADE,
    kpi_id INTEGER REFERENCES kpi(id) ON DELETE CASCADE
);

-- Create Period Table
CREATE TABLE IF NOT EXISTS period (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER,
    quarter INTEGER
);

-- Create Audit Table
CREATE TABLE IF NOT EXISTS audit (
    id SERIAL PRIMARY KEY,
    circle_kpi_id INTEGER REFERENCES circle_kpi(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    period_id INTEGER REFERENCES period(id) ON DELETE CASCADE,
    value DECIMAL NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT current_timestamp
);
