-- 初始化sex表
CREATE TABLE sex (
    sexCode INT PRIMARY KEY,
    sex VARCHAR(15) NOT NULL
);

INSERT INTO sex (sexCode, sex) VALUES (1, 'male');
INSERT INTO sex (sexCode, sex) VALUES (2, 'female');