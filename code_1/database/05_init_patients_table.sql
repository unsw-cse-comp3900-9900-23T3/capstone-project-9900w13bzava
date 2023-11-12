CREATE TABLE patients (
    patientID SERIAL PRIMARY KEY,
    firstName VARCHAR(15) NOT NULL,  
    surname VARCHAR(15) NOT NULL,  
    medicareNo CHAR(15),  
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
