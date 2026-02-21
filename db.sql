
-- Create the database
CREATE DATABASE IF NOT EXISTS health_tracker;
USE health_tracker;

-- Create the bmi_records table
CREATE TABLE IF NOT EXISTS bmi_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(50) NOT NULL,
    height FLOAT NOT NULL,
    weight FLOAT NOT NULL,
    bmi FLOAT NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
