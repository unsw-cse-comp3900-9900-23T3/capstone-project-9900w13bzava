CREATE TABLE locations (
    locationID SERIAL PRIMARY KEY,
    locationName VARCHAR(255) NOT NULL
);

INSERT INTO locations (locationID, locationName) VALUES (0, 'online');
INSERT INTO locations (locationName) VALUES ('Main Surgery');
