import pyodbc
from sys import argv
import json

# query will be input
sql = str(argv[1])

# Connection parameters
server = 'localhost\\BPSINSTANCE,60089' # possibly you need to replace to localhost
database = 'BPSSamples'  # Replace with your actual database name
username = 'bpsrawdata'
password = 'password'

# Establish the connection
connection_string = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'
connection = pyodbc.connect(connection_string)

# Create a cursor to interact with the database
cursor = connection.cursor()

# Query to retrieve data from the Users table
query = sql
# SELECT Firstname,Surname, Sex  FROM BPSSamples.dbo.BPS_Patients
# ORDER BY surname, firstname
# '''

try:
    # Execute the query
    cursor.execute(query)
    columns = [column[0] for column in cursor.description]
    data = [dict(zip(columns, row)) for row in cursor.fetchall()]
    json_data = json.dumps(data, indent=4, sort_keys=True, default=str)
    print(json_data)
    # Fetch and print the results
    # rows = cursor.fetchall()
    # for row in rows:
        # f.write(f'{row}')
        # print(row)

except Exception as e:
    print(f"An error occurred: {e}")

# Close the cursor and connection
cursor.close()
connection.close()