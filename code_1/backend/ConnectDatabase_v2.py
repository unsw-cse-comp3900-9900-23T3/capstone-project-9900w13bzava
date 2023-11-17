# used to connect to cloud PostgreSQL database
import psycopg2
import os

# Database Connection Parameters
DATABASE_HOST = '34.151.110.251'
DATABASE_NAME = '9900_database'
DATABASE_USER = 'postgres'
DATABASE_PASSWORD = 'password'

SEARCH = 1
ADD_DELETE_UPDATE = 2

# create and return database connection object
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
    try:
        with conn.cursor() as cursor:
            cursor.execute(query)
            if operation == 1:  # search
                # get column name
                column_names = [desc[0] for desc in cursor.description]
                # put in dict
                records = [dict(zip(column_names, row)) for row in cursor.fetchall()]
                return records
            else:
                # add delete edit
                conn.commit()  # commit changes
    except psycopg2.Error as e:
        print(f"Database Query Failed: {e}")
        return []

# init database
def init_database():
    # construct SQL file realtive path
    file_dir = os.path.dirname(__file__)
    sql_file_path = os.path.join(file_dir, '../database/00_total_init.sql')

    # read sql file content
    with open(sql_file_path, 'r', encoding='utf-8') as file:
        sql_query = file.read()

    # excute sql_query 
    operate_database(sql_query, 2)
    print("Database init!")


# for test
if __name__ == "__main__":
    query = '''select * from settings'''  
    records = operate_database(query, 1)
    print(records)
    # init_database()
    print()
