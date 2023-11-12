CREATE TABLE appointmentStatus (
    appointmentStatusID SERIAL PRIMARY KEY,
    appointmentStatusName VARCHAR(255)
);

INSERT INTO appointmentStatus (appointmentStatusName) VALUES 
('Unavailable'),
('Booked'),
('Waiting'),
('Urgent'),
('With doctor'),
('At billing'),
('Completed');