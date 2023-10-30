import psycopg2
import json
from datetime import datetime


# 连接参数
DATABASE_HOST = 'localhost'
DATABASE_PORT = '5432'  # 默认为5432，除非你有不同的配置
DATABASE_NAME = '9900_database'
DATABASE_USER = 'postgres'
DATABASE_PASSWORD = 'password'

# 传入的query是查询语句
# operation = 1 表示查询，2表示插入
def operate_database(query, operation):
    """从数据库中获取所有用户，并返回"""
    try:
        # 使用with语句确保连接和游标都会被正确关闭
        with psycopg2.connect(
            host=DATABASE_HOST,
            port=DATABASE_PORT,
            dbname=DATABASE_NAME,
            user=DATABASE_USER,
            password=DATABASE_PASSWORD
        ) as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                if operation == 1:
                    # 获取列名
                    column_names = [desc[0] for desc in cursor.description]
                    # 将查询结果转化为包含列名的字典列表
                    records = [dict(zip(column_names, row)) for row in cursor.fetchall()]
                    return records

    except psycopg2.Error as e:
        print(f"数据库操作失败: {e}")
        return []

# 获取所有用户数据
if __name__ == "__main__":
    query = "select to_char(appointmentdate, 'YYYY-MM-DD HH24:MI:SS') as appointmentdate from appointments;"
    records = operate_database(query, 1)
    print(type(records))
    print(type(records[0]))

    for record in records:
        print(record)
    
    print()
