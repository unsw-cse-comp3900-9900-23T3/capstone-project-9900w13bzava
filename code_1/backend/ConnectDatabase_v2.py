import psycopg2
import os


# 连接参数
DATABASE_HOST = '35.189.16.131'
DATABASE_NAME = 'comp9900_database'
DATABASE_USER = 'postgres'
DATABASE_PASSWORD = 'password'

SEARCH = 1
ADD_DELETE_UPDATE = 2

"""创建并返回数据库连接对象"""
try:
    conn = psycopg2.connect(
        host=DATABASE_HOST,
        dbname=DATABASE_NAME,
        user=DATABASE_USER,
        password=DATABASE_PASSWORD
    )
    print("Database Connected!!")
except psycopg2.Error as e:
    print(f"Database Connection Failed: {e}")
    conn = None


def operate_database(query, operation):
    """从数据库中获取所有用户，并返回"""
    try:
        with conn.cursor() as cursor:
            cursor.execute(query)
            if operation == 1:  # 搜索
                # 获取列名
                column_names = [desc[0] for desc in cursor.description]
                # 将查询结果转化为包含列名的字典列表
                records = [dict(zip(column_names, row)) for row in cursor.fetchall()]
                return records
            else:
                # 增删改
                conn.commit()  # 提交修改
    except psycopg2.Error as e:
        print(f"Database Query Failed: {e}")
        return []



# # 传入的query是查询语句
# # operation = 1 表示查询，2表示增删改
# def operate_database(query, operation):
#     """从数据库中获取所有用户，并返回"""
#     try:
#         # 使用with语句确保连接和游标都会被正确关闭
#         with psycopg2.connect(
#             host=DATABASE_HOST,
#             port=DATABASE_PORT,
#             dbname=DATABASE_NAME,
#             user=DATABASE_USER,
#             password=DATABASE_PASSWORD
#         ) as conn:
#             with conn.cursor() as cursor:
#                 cursor.execute(query)
#                 if operation == 1:
#                     # 获取列名
#                     column_names = [desc[0] for desc in cursor.description]
#                     # 将查询结果转化为包含列名的字典列表
#                     records = [dict(zip(column_names, row)) for row in cursor.fetchall()]
#                     return records
#     except psycopg2.Error as e:
#         print(f"数据库操作失败: {e}")
#         return []


# # 执行函数会初始化数据库
# def init_database():
#     # 构建SQL文件的相对路径
#     file_dir = os.path.dirname(__file__)  # 获取当前Python脚本的目录
#     sql_file_path = os.path.join(file_dir, '../database/00_total_init.sql')

#     # 用只读模式打开SQL文件
#     with open(sql_file_path, 'r', encoding='utf-8') as file:
#         # 读取文件内容到字符串
#         sql_query = file.read()

#     # 现在，sql_query 
#     operate_database(sql_query, 2)


# 获取所有用户数据
if __name__ == "__main__":
    query = '''select * from users'''  # 获取所有的status
    records = operate_database(query, 1)
    print(records)
    # init_database()
    print()
