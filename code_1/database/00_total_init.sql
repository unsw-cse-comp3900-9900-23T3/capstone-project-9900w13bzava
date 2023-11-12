-- drop tables
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS appointmentTypes CASCADE;
DROP TABLE IF EXISTS appointmentStatus CASCADE;
DROP TABLE IF EXISTS sex CASCADE;

-- init sex
CREATE TABLE sex (
    sexCode INT PRIMARY KEY,
    sex VARCHAR(15) NOT NULL
);

INSERT INTO sex (sexCode, sex) VALUES (1, 'male');
INSERT INTO sex (sexCode, sex) VALUES (2, 'female');


-- init appointmentStatus table
CREATE TABLE appointmentStatus (
    appointmentStatusID SERIAL PRIMARY KEY,
    appointmentStatusName VARCHAR(255)
);

-- based on BP database
INSERT INTO appointmentStatus (appointmentStatusName) VALUES 
('Unavailable'),
('Booked'),
('Waiting'),
('Urgent'),
('With doctor'),
('At billing'),
('Completed');

-- init appointmentTypes table
CREATE TABLE appointmentTypes (
    appointmentTypeID SERIAL PRIMARY KEY,
    appointmentTypeName VARCHAR(255)
);

-- based on NP databse
INSERT INTO appointmentTypes (appointmentTypeName)
VALUES
    ('Standard appt.'),
    ('Long appt.'),
    ('Short appt.'),
    ('New patient'),
    ('Excision'),
    ('Procedure'),
    ('Immunisation'),
    ('Insurance medical'),
    ('DVA medical'),
    ('Diving medical'),
    ('Meeting'),
    ('Operation'),
    ('Assist'),
    ('Home visit'),
    ('Hospital visit'),
    ('Nursing home (RACF) visit'),
    ('Teleconference'),
    ('Drug rep.'),
    ('Antenatal visit'),
    ('Acupuncture'),
    ('Health Assessment'),
    ('Care Plan'),
    ('Other'),
    ('Cervical screening'),
    ('Recall'),
    ('Internet'),
    ('Workers Comp.'),
    ('Telehealth Consult'),
    ('Telephone Consult'),
    ('Best Health Connect (Telehealth)');

-- init locations table
CREATE TABLE locations (
    locationID SERIAL PRIMARY KEY,
    locationName VARCHAR(255) NOT NULL
);

INSERT INTO locations (locationID, locationName) VALUES (0, 'online');
INSERT INTO locations (locationName) VALUES ('Main Surgery');


-- init patients table
CREATE TABLE patients (
    patientID SERIAL PRIMARY KEY,
    firstName VARCHAR(15) NOT NULL,   
    surname VARCHAR(15) NOT NULL, 
    medicareNo CHAR(15),  -- medicare card number
    email VARCHAR(255), 
    phoneNumber VARCHAR(15) NOT NULL, 
    sexCode INT NOT NULL REFERENCES sex(sexCode) CHECK (sexCode IN (1, 2))
);

INSERT INTO patients (firstName, surname, medicareNo, email, phoneNumber, sexCode) VALUES
('John', 'Doe', '12345678', 'john.doe@example.com', '1234567890', 1),
('Jane', 'Smith', NULL, 'jane.smith@example.com', '0987654321', 2),
('Alice', 'Wang', '87654321', NULL, '1122334455', 2),
('Bob', 'Zhang', '23456789', 'bob.zhang@example.com', '2233445566', 1),
('Charlie', 'Liu', NULL, 'charlie.liu@example.com', '3344556677', 1);


-- init users table
CREATE TABLE IF NOT EXISTS users (
    userID SERIAL PRIMARY KEY,
    firstName VARCHAR(15) NOT NULL,
    surname VARCHAR(15) NOT NULL,
    password VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    phoneNumber VARCHAR(15) NOT NULL,
    sexCode INT NOT NULL REFERENCES sex(sexCode) CHECK (sexCode IN (1, 2)),
    locationID INT NOT NULL REFERENCES locations(locationID)
);

INSERT INTO users (firstName, surname, password, email, phoneNumber, sexCode, locationID) VALUES
    ('Zhenwei', 'Wu', 'password1', 'z123456789@ad.unsw.edu.au', '1234567890', 1, 1),
    ('Haodong', 'Ke', 'password2', NULL, '5612315485', 2, 1),
    ('Sha', 'Zhou', 'password3', NULL, '2584202356', 1, 1),
    ('Zhetai', 'Jiang', 'password4', 'z55667788@ad.unsw.edu.au', '21314654811', 1, 1),
    ('Yalin', 'Li', '12345678', 'z2165484@ad.unsw.edu.au', '5454984981', 2, 1);
INSERT INTO users (userID, firstName, surname, password, email, phoneNumber, sexCode, locationID) VALUES
	(0, 'administrator', '', 'password', 'adminadmin@ad.unsw.edu.au', '1234567890', 1, 1);  -- admin


-- init appointments table
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


-- create setting table
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