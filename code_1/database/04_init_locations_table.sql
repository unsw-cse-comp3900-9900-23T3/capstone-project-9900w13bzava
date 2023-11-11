-- 初始化locations表
CREATE TABLE locations (
    locationID SERIAL PRIMARY KEY,
    locationName VARCHAR(255) NOT NULL
);

-- 0表示线上，其他的表示具体的店面
INSERT INTO locations (locationID, locationName) VALUES (0, 'online');
INSERT INTO locations (locationName) VALUES ('Main Surgery');
