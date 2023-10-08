from flask import Flask, jsonify, render_template
import pyodbc

app = Flask(__name__)

# Connection parameters
server = '192.168.56.1\\BPSINSTANCE' # possibly you need to replace to localhost
database = 'BPSSamples'  # Replace with your actual database name
username = 'bpsrawdata'
password = 'password'
connection_string = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'


# def fetch_data_from_db():
#     # Establish the connection
#     connection = pyodbc.connect(connection_string)
#     cursor = connection.cursor()
#
#     # Query to retrieve data from the Users table
#     query = '''
#     SELECT Firstname, Surname, Sex FROM BPSSamples.dbo.BPS_Patients
#     ORDER BY surname, firstname
#     '''
#
#     data = []
#     try:
#         cursor.execute(query)
#         rows = cursor.fetchall()
#         for row in rows:
#             data.append({
#                 "Firstname": row.Firstname,
#                 "Surname": row.Surname,
#                 "Sex": row.Sex
#             })
#
#     except Exception as e:
#         print(f"An error occurred: {e}")
#
#     finally:
#         # Close the cursor and connection
#         cursor.close()
#         connection.close()
#
#     return data
#
#
# @app.route('/patients', methods=['GET'])
# def get_patients():
#     data = fetch_data_from_db()
#     return jsonify(data)

@app.route('/')
def index():
    return render_template('web.html')

if __name__ == '__main__':
    app.run(debug=True)

# http://127.0.0.1:5000/