-- Database Name: todos

-- Create table
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    complete BOOLEAN DEFAULT FALSE
);
