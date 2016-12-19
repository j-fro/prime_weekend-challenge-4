-- Database Name: todos

-- Create table
CREATE TABLE list (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL
);

CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL
);

CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    complete BOOLEAN DEFAULT FALSE,
    list_id INTEGER REFERENCES list(id)
);

CREATE TABLE person_task (
    person_id INTEGER REFERENCES person(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES task(id) ON DELETE CASCADE
);
