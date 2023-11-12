CREATE TABLE IF NOT EXISTS appointments (
    appointmentID SERIAL PRIMARY KEY,   
    appointmentDate TIMESTAMP NOT NULL,  
    duration INT,  
    startTime TIMESTAMP NOT NULL,  
    userID INT REFERENCES users(userID), 
    patientID INT REFERENCES patients(patientID),
    appointmentTypeID INT REFERENCES appointmentTypes(appointmentTypeID), 
    locationID INT REFERENCES locations(locationID), 
    appointmentStatusID INT REFERENCES appointmentStatus(appointmentStatusID), 
    note VARCHAR(255)
);

INSERT INTO appointments (appointmentDate, duration, startTime, userID, patientID, appointmentTypeID, locationID, appointmentStatusID, note) VALUES
    ('2023-11-01 09:00:00', 10, '2023-11-01 09:00:00', 1, 2, 29, 1, 7, 'zhenwei wu range a appointment for jane smith'),  
    ('2023-11-01 09:00:00', 15, '2023-11-01 09:30:00', 1, 1, 26, 1, 3, 'hihihi'),  
    ('2023-11-01 09:00:00', 15, '2023-11-01 10:00:00', 1, 5, 2, 1, 4, 'how are you'),  

    ('2023-11-01 09:30:00', 15, '2023-11-01 09:30:00', 2, 3, 3, 1, 3, 'for Alice Wang, need more care'),  
    ('2023-11-01 10:00:00', 5, '2023-11-01 10:00:00', 3, 4, 4, 0, 4, 'for Bob Zhang, too much care'),   
    ('2023-11-01 10:30:00', 10, '2023-11-01 10:30:00', 4, 5, 5, 1, 5, 'need arrange room for him'),  
    ('2023-11-01 11:00:00', 15, '2023-11-01 11:00:00', 5, 1, 6, 0, 6, 'some headache problem'),  
    ('2023-11-02 09:00:00', 10, '2023-11-02 09:00:00', 1, 3, 7, 1, 2, 'may be xxxx'),  
    ('2023-11-02 09:45:00', 15, '2023-11-02 09:45:00', 2, 5, 8, 1, 6, 'should use more xxx '), 
    ('2023-11-02 10:15:00', 10, '2023-11-02 10:15:00', 3, 1, 9, 0, 7, 'hey, how are you!'), 
    ('2023-11-02 11:00:00', 5, '2023-11-02 11:00:00', 4, 2, 10, 1, 1, 'He is fine'), 
    ('2023-11-02 13:00:00', 10, '2023-11-02 13:00:00', 5, 4, 11, 0, 2, 'ask Dr.haodong for advice'),   
    ('2022-09-27 09:00:00', 10, '2022-10-27 09:00:00', 1, 2, 2, 1, 7, 'completed') 
;