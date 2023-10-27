import psycopg2

# 连接参数
DATABASE_HOST = 'localhost'
DATABASE_PORT = '5432'  # 默认为5432，除非你有不同的配置
DATABASE_NAME = '9900_database'
DATABASE_USER = 'postgres'
DATABASE_PASSWORD = 'password'

# 传入的query是查询语句
def fetch_all_users(query):
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
                records = cursor.fetchall()
                return records

    except psycopg2.Error as e:
        print(f"数据库操作失败: {e}")
        return []

# 获取所有用户数据
if __name__ == "__main__":
    query = "SELECT * FROM users;"
    all_users = fetch_all_users(query)
    for user in all_users:
        print(user)