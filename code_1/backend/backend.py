from flask import Flask, jsonify, request
from flasgger import Swagger
import csv
import pyodbc

app = Flask(__name__)
swagger = Swagger(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    # search in database
    
    pass

@app.route('/register', methods=['POST'])
def register():
    """
    This is the registration endpoint
    Call this endpoint to register a new user
    ---
    tags:
      - Registration API
    parameters:
      - name: username
        in: formData
        type: string
        required: true
      - name: password
        in: formData
        type: string
        required: true
      - name: confirm password
        in: formData
        type: string
        required: true
      - name: location
        in: formData
        type: string
        required: true
    responses:
      200:
        description: Registration successful
      400:
        description: Passwords do not match
    """

    data = request.get_json()

    username = data.get('username')
    password = data.get('password')
    confirmPassword = data.get('confirm password')  
    location = data.get('location')


    if password != confirmPassword:
        return jsonify({"message": "Passwords do not match!"}), 400

    with open('users_data.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([username, password, location])

    return jsonify({"message": "Registration successful!"}), 200

# # Connection parameters
# server = '192.168.56.1\\BPSINSTANCE' # possibly you need to replace to localhost
# database = 'BPSSamples'  # Replace with your actual database name
# username = 'bpsrawdata'
# password = 'password'
# connection_string = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'


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


if __name__ == '__main__':
    app.run(debug=True)

# http://127.0.0.1:5000/
# http://127.0.0.1:5000/apidocs