-- Role Table
CREATE TABLE Role (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    description VARCHAR
);

-- Range Table
CREATE TABLE Range (
    id SERIAL PRIMARY KEY,
    min_value DECIMAL NOT NULL,
    max_value DECIMAL,
    display_value VARCHAR
);

-- Users Table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    role_id INTEGER REFERENCES Role(id)
);

-- Circle Table
CREATE TABLE Circle (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

-- User_Circle Table
CREATE TABLE User_Circle (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id),
    circle_id INTEGER REFERENCES Circle(id)
);

-- Periodicity Table
CREATE TABLE Periodicity (
    id SERIAL PRIMARY KEY,
    type VARCHAR NOT NULL UNIQUE,
    description VARCHAR
);

-- KPI Table
CREATE TABLE KPI (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    range_id INTEGER REFERENCES Range(id),
    periodicity_id INTEGER REFERENCES Periodicity(id)
);

-- Circle_KPI Table
CREATE TABLE Circle_KPI (
    id SERIAL PRIMARY KEY,
    circle_id INTEGER REFERENCES Circle(id),
    kpi_id INTEGER REFERENCES KPI(id)
);

-- Period Table
CREATE TABLE Period (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER,
    quarter INTEGER
);

-- Audit Table
CREATE TABLE Audit (
    id SERIAL PRIMARY KEY,
    circle_kpi_id INTEGER REFERENCES Circle_KPI(id),
    user_id INTEGER REFERENCES Users(id),
    period_id INTEGER REFERENCES Period(id),
    value DECIMAL NOT NULL,
    created_timestamp TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_timestamp TIMESTAMP NOT NULL DEFAULT current_timestamp
);
