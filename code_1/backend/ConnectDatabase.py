import pyodbc
from sys import argv
import json

def myConnect(query):
    # Connection parameters
    server = '127.0.0.1\\BPSINSTANCE, 57853' # Yalin Li
    # server = '127.0.0.1\\BPSINSTANCE, 60089' # Zhou Sha
    database = 'BPSSamples'  # Replace with your actual database name
    username = 'bpsrawdata'
    password = 'password'

    # Establish the connection
    connection_string = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'
    connection = pyodbc.connect(connection_string)

    # Create a cursor to interact with the database
    cursor = connection.cursor()

    # Query to retrieve data from the Users table
    # query = '''

    # SELECT Firstname,Surname, Sex  FROM BPSSamples.dbo.BPS_Patients
    # ORDER BY surname, firstname
    # '''
    json_data = json.dumps([])
    try:
        # Execute the query
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        json_data = json.dumps(data, indent=4, sort_keys=True, default=str)
        # Fetch and print the results
        # rows = cursor.fetchall()
        # for row in rows:
        #     print(row)

    except Exception as e:
        print(f"An error occurred: {e}")

    # Close the cursor and connection
    cursor.close()
    connection.close()
    return json_data