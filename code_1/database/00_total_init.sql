-- 先根据构建的顺序，反向删除
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS appointmentTypes CASCADE;
DROP TABLE IF EXISTS appointmentStatus CASCADE;
DROP TABLE IF EXISTS sex CASCADE;

-- 然后再开始创建各个表
-- 初始化sex表
CREATE TABLE sex (
    sexCode INT PRIMARY KEY,
    sex VARCHAR(15) NOT NULL
);

INSERT INTO sex (sexCode, sex) VALUES (1, 'male');
INSERT INTO sex (sexCode, sex) VALUES (2, 'female');


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
('Urgent'),
('With doctor'),
('At billing'),
('Completed');

-- 初始化 appointmentTypes 表
-- 这个表主要存储了 病人的预约类型
CREATE TABLE appointmentTypes (
    appointmentTypeID SERIAL PRIMARY KEY,
    appointmentTypeName VARCHAR(255)
);

-- （这是根据客户的数据库，不要修改）
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

-- 初始化locations表
CREATE TABLE locations (
    locationID SERIAL PRIMARY KEY,
    locationName VARCHAR(255) NOT NULL
);

INSERT INTO locations (locationID, locationName) VALUES (0, 'online');
INSERT INTO locations (locationName) VALUES ('Main Surgery');
INSERT INTO locations (locationName) VALUES ('Secondary Surgery');
INSERT INTO locations (locationName) VALUES ('UNSW');

-- 初始化 patients 表
-- 这个表主要存储了 patients 的信息
CREATE TABLE patients (
    patientID SERIAL PRIMARY KEY,
    firstName VARCHAR(15) NOT NULL,   -- 名字，不可是null，最长15
    surname VARCHAR(15) NOT NULL,  -- 名字，不可是null，最长15
    medicareNo CHAR(15),  -- 医保号，8位数字
    email VARCHAR(255),  -- 邮箱，可不填
    phoneNumber VARCHAR(15) NOT NULL,  -- 手机号，不可不填
    sexCode INT NOT NULL REFERENCES sex(sexCode) CHECK (sexCode IN (1, 2))  -- 1 表示male, 2表示female，不能出现其他数字
);

-- 一些初始记录
-- 插入数据
INSERT INTO patients (firstName, surname, medicareNo, email, phoneNumber, sexCode) VALUES
('John', 'Doe', '12345678', 'john.doe@example.com', '1234567890', 1),
('Jane', 'Smith', NULL, 'jane.smith@example.com', '0987654321', 2),
('Alice', 'Wang', '87654321', NULL, '1122334455', 2),
('Bob', 'Zhang', '23456789', 'bob.zhang@example.com', '2233445566', 1),
('Charlie', 'Liu', NULL, 'charlie.liu@example.com', '3344556677', 1);


-- 创建 users 表格
CREATE TABLE IF NOT EXISTS users (
    userID SERIAL PRIMARY KEY,
    firstName VARCHAR(15) NOT NULL,
    surname VARCHAR(15) NOT NULL,
    password VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    phoneNumber VARCHAR(15) NOT NULL,
    sexCode INT NOT NULL REFERENCES sex(sexCode) CHECK (sexCode IN (1, 2)),  -- 1 表示male, 2表示female，不能出现其他数字
    locationID INT NOT NULL REFERENCES locations(locationID)
);

-- 插入合法示例记录
INSERT INTO users (firstName, surname, password, email, phoneNumber, sexCode, locationID) VALUES
    ('Zhenwei', 'Wu', 'password1', 'z123456789@ad.unsw.edu.au', '1234567890', 1, 1),
    ('Haodong', 'Ke', 'password2', NULL, '5612315485', 2, 1),
    ('Sha', 'Zhou', 'password3', NULL, '2584202356', 1, 1),
    ('Zhetai', 'Jiang', 'password4', 'z55667788@ad.unsw.edu.au', '21314654811', 1, 1),
    ('Yalin', 'Li', '12345678', 'z2165484@ad.unsw.edu.au', '5454984981', 2, 1);
INSERT INTO users (userID, firstName, surname, password, email, phoneNumber, sexCode, locationID) VALUES
	(0, 'administrator', '', 'password', 'adminadmin@ad.unsw.edu.au', '1234567890', 1, 1);  -- 超级用户


-- appointments表，存的是所有预约
CREATE TABLE IF NOT EXISTS appointments (
    appointmentID SERIAL PRIMARY KEY,     -- 主键，自增
    appointmentDate TIMESTAMP NOT NULL,  -- 预约日期和时间
    duration INT,  -- 持续时间，0到15分钟之间
    startTime TIMESTAMP NOT NULL,  -- 预约的开始时间，包括日期和时间
    userID INT REFERENCES users(userID), -- 外键，引用users表
    patientID INT REFERENCES patients(patientID), -- 外键，引用patients表
    appointmentTypeID INT REFERENCES appointmentTypes(appointmentTypeID), -- 预约类型ID（外键，如果存在对应的表则需要添加引用）
    locationID INT REFERENCES locations(locationID),  -- 0表示线上
    appointmentStatusID INT REFERENCES appointmentStatus(appointmentStatusID), -- 预约状态ID（外键，如果存在对应的表则需要添加引用）
    note VARCHAR(255)
);

-- 在appointments表中插入更多数据
INSERT INTO appointments (appointmentDate, duration, startTime, userID, patientID, appointmentTypeID, locationID, appointmentStatusID, note) VALUES
    ('2023-11-01 09:00:00', 10, '2023-11-01 09:00:00', 1, 2, 29, 1, 7, 'zhenwei wu range a appointment for jane smith'),  -- Zhenwei Wu为Jane Smith安排了一个长时间预约
    ('2023-11-01 09:00:00', 15, '2023-11-01 09:30:00', 1, 1, 26, 1, 3, 'hihihi'),  -- Zhenwei Wu为Jane Smith安排了一个长时间预约
    ('2023-11-01 09:00:00', 15, '2023-11-01 10:00:00', 1, 5, 2, 1, 4, 'how are you'),  -- Zhenwei Wu为Jane Smith安排了一个长时间预约

    ('2023-11-01 09:30:00', 15, '2023-11-01 09:30:00', 2, 3, 3, 1, 3, 'for Alice Wang, need more care'),  -- Haodong Ke为Alice Wang安排了一个短时间预约
    ('2023-11-01 10:00:00', 5, '2023-11-01 10:00:00', 3, 4, 4, 0, 4, 'for Bob Zhang, too much care'),   -- Sha Zhou为Bob Zhang安排了一个新患者的预约
    ('2023-11-01 10:30:00', 10, '2023-11-01 10:30:00', 4, 5, 5, 1, 5, 'need arrange room for him'),  -- Zhetai Jiang为Charlie Liu安排了一个切除预约
    ('2023-11-01 11:00:00', 15, '2023-11-01 11:00:00', 5, 1, 6, 0, 6, 'some headache problem'),  -- Yalin Li为John Doe安排了一个操作预约
    ('2023-11-02 09:00:00', 10, '2023-11-02 09:00:00', 1, 3, 7, 1, 2, 'may be xxxx'),  -- Zhenwei Wu为Alice Wang安排了一个免疫预约
    ('2023-11-02 09:45:00', 15, '2023-11-02 09:45:00', 2, 5, 8, 1, 6, 'should use more xxx '),  -- Haodong Ke为Charlie Liu安排了一个保险体检预约
    ('2023-11-02 10:15:00', 10, '2023-11-02 10:15:00', 3, 1, 9, 0, 7, 'hey, how are you!'),  -- Sha Zhou为John Doe安排了一个潜水体检预约
    ('2023-11-02 11:00:00', 5, '2023-11-02 11:00:00', 4, 2, 10, 1, 1, 'He is fine'),  -- Zhetai Jiang为Jane Smith安排了一个会议
    ('2023-11-02 13:00:00', 10, '2023-11-02 13:00:00', 5, 4, 11, 0, 2, 'ask Dr.haodong for advice'),   -- Yalin Li为Bob Zhang安排了一个手术预约
    ('2022-09-27 09:00:00', 10, '2022-10-27 09:00:00', 1, 2, 2, 1, 7, 'completed')  -- 一年前的一次线下预约
;