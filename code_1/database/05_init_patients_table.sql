-- 初始化 patients 表
-- 这个表主要存储了 patients 的信息
CREATE TABLE patients (
    patientID SERIAL PRIMARY KEY,
    firstName VARCHAR(15) NOT NULL,   -- 名字，不可是null，最长15
    surname VARCHAR(15) NOT NULL,  -- 名字，不可是null，最长15
    medicareNo CHAR(8) CHECK (medicareNo IS NULL OR medicareNo ~ '^[0-9]{1,8}$'),  -- 医保号，8位数字
    email VARCHAR(255),  -- 邮箱，可不填
    phoneNumber VARCHAR(15) NOT NULL,  -- 手机号，不可不填
    sexCode INT NOT NULL REFERENCES sex(sexCode) CHECK (sexCode IN (1, 2)),  -- 1 表示male, 2表示female，不能出现其他数字
);

-- 一些初始记录
-- 插入数据
INSERT INTO patients (firstName, surname, medicareNo, email, phoneNumber, sexCode) VALUES
('John', 'Doe', '12345678', 'john.doe@example.com', '1234567890', 1),
('Jane', 'Smith', NULL, 'jane.smith@example.com', '0987654321', 2),
('Alice', 'Wang', '87654321', NULL, '1122334455', 2),
('Bob', 'Zhang', '23456789', 'bob.zhang@example.com', '2233445566', 1),
('Charlie', 'Liu', NULL, 'charlie.liu@example.com', '3344556677', 1);
