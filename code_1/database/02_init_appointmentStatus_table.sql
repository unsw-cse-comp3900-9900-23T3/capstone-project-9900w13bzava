-- 初始化 appointmentStatus 表
-- 这个表主要存储了 病人预约的状态，
CREATE TABLE appointmentStatus (
    appointmentStatusID SERIAL PRIMARY KEY,
    appointmentStatusName VARCHAR(255)
);

-- (固定的，不需要增删改)
INSERT INTO appointmentStatus (appointmentStatusName) VALUES 
('Unavailable'),
('Booked'),
('Waiting'),
('With doctor'),
('At billing'),
('Completed'),
('DNA'),
('Reserved'),
('Invoiced'),
('Paid');