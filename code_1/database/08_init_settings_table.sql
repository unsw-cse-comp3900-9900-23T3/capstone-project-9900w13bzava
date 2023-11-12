CREATE TABLE IF NOT EXISTS settings (
    settingID SERIAL PRIMARY KEY,
    userID INT NOT NULL REFERENCES users(userID), 
    timerange VARCHAR(15) NOT NULL,
    breaktimerange VARCHAR(15) NOT NULL
);

INSERT INTO settings (userID, timerange, breaktimerange) VALUES
    (0, '6:00 18:00', '12:00 12:00'),
    (1, '6:00 18:00', '12:00 12:00'),
    (2, '6:00 18:00', '12:00 12:00'),
    (3, '6:00 18:00', '12:00 12:00'),
    (4, '6:00 18:00', '12:00 12:00'),
    (5, '6:00 18:00', '12:00 12:00');