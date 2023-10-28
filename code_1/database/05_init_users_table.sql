-- 创建 users 表格
CREATE TABLE IF NOT EXISTS users (
    userID SERIAL PRIMARY KEY,
    firstName VARCHAR(15) NOT NULL,
    surname VARCHAR(15) NOT NULL,
    password VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    phoneNumber VARCHAR(15) NOT NULL,
    sexCode INT NOT NULL REFERENCES sex(sexCode) CHECK (sexCode IN (1, 2))  -- 1 表示male, 2表示female，不能出现其他数字
);

-- 插入合法示例记录
INSERT INTO users (firstName, surname, password, email, phoneNumber, sexCode) VALUES
    ('Zhenwei', 'Wu', 'password1', 'z123456789@ad.unsw.edu.au', '1234567890', 1),
    ('Haodong', 'Ke', 'password2', NULL, '5612315485', 2),
    ('Sha', 'Zhou', 'password3', NULL, '2584202356', 1),
    ('Zhetai', 'Jiang', 'password4', 'z55667788@ad.unsw.edu.au', '21314654811', 1),
    ('Yalin', 'Li', '12345678', 'z2165484@ad.unsw.edu.au', '5454984981', 2);