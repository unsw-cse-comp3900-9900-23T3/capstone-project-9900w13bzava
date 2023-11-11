-- 创建 setting 表格
CREATE TABLE IF NOT EXISTS settings (
    settingID SERIAL PRIMARY KEY,
    userID INT NOT NULL REFERENCES users(userID),  -- 1 表示male, 2表示female，不能出现其他数字
    timerange VARCHAR(15) NOT NULL,
    breaktimerange VARCHAR(15) NOT NULL
);

-- 先把每个用户都设置为默认设置
INSERT INTO settings (userID, timerange, breaktimerange) VALUES
    (0, '6:00 18:00', '12:00 12:00'),
    (1, '6:00 18:00', '12:00 12:00'),
    (2, '6:00 18:00', '12:00 12:00'),
    (3, '6:00 18:00', '12:00 12:00'),
    (4, '6:00 18:00', '12:00 12:00'),
    (5, '6:00 18:00', '12:00 12:00');