CREATE TABLE soil_data (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ph FLOAT,
    humidity FLOAT,
    temperature FLOAT,
    nitrogen FLOAT,
    phosphorus FLOAT,
    potassium FLOAT,
    rainfall FLOAT
);