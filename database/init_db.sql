CREATE TABLE soil_data (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ph FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    temperature FLOAT NOT NULL,
    nitrogen FLOAT NOT NULL,
    phosphorus FLOAT NOT NULL,
    potassium FLOAT NOT NULL,
    rainfall FLOAT NOT NULL
);