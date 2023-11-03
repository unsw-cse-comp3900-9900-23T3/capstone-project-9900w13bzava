-- appointments表，存的是所有预约
CREATE TABLE IF NOT EXISTS appointments (
    appointmentID SERIAL PRIMARY KEY,     -- 主键，自增
    appointmentDate TIMESTAMP NOT NULL,  -- 预约日期和时间
    duration INT CHECK (duration >= 0 AND duration <= 15),  -- 持续时间，0到15分钟之间
    startTime TIMESTAMP NOT NULL,  -- 预约的开始时间，包括日期和时间
    userID INT REFERENCES users(userID), -- 外键，引用users表
    patientID INT REFERENCES patients(patientID), -- 外键，引用patients表
    appointmentTypeID INT REFERENCES appointmentTypes(appointmentTypeID), -- 预约类型ID（外键，如果存在对应的表则需要添加引用）
    locationID INT CHECK REFERENCES locations(locationID),  -- 0表示线上
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