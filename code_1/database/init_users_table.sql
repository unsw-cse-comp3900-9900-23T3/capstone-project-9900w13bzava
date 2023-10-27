-- 创建 users 表格
CREATE TABLE IF NOT EXISTS users (
    userID SERIAL PRIMARY KEY,
    firstName VARCHAR(15) NOT NULL,
    surname VARCHAR(15) NOT NULL,
    password VARCHAR(15) NOT NULL
);

-- 插入示例数据
INSERT INTO users (firstName, surname, password)
VALUES
    ('John', 'Doe', 'password1'),
    ('Alice', 'Smith', 'password2'),
    ('Bob', 'Johnson', 'password3');