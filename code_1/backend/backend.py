from flask import Flask, jsonify, request
from flasgger import Swagger
from flask_cors import CORS
import datetime
import csv
import pyodbc
import subprocess
import json
import re

# demo to get data from database, sql should be modified
# sql = '''SELECT * FROM BPSSamples.dbo.APPOINTMENTS
# where APPOINTMENTDATE<CURRENT_TIMESTAMP and INTERNALID=(36)'''
# result = json.loads(subprocess.check_output(["python","ConnectDatabase.py", sql]).decode('utf-8'))
# result = json.dumps(result, indent=4)
# print(result)

app = Flask(__name__)
swagger = Swagger(app)
CORS(app)

# Login
@app.route('/login', methods=['POST'])
def login():
    """
    This is the login endpoint
    Call this endpoint to login a existed user
    ---
    tags:
      - Login API
    parameters:
      - name: username
        in: formData
        type: string
        required: true
      - name: password
        in: formData
        type: string
        required: true
      - name: location
        in: formData
        type: string
        required: true
    responses:
      200:
        description: Login successful
      401:
        description: Wrong password
      404:
        description: User does not exist
    """
        
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')
    location = data.get('location')

    # get the users result from database
    query = '''SELECT SURNAME, FIRSTNAME, PASSWORD, USERID FROM BPSSamples.dbo.USERS'''
    result = json.loads(subprocess.check_output(["python","ConnectDatabase.py", query]).decode('utf-8'))

    # check name and password
    for idx in result:
        name = re.sub(" +", " ", f"{idx['FIRSTNAME']} {idx['SURNAME']}")
        if username in name:
          if password==idx['PASSWORD']:
              return jsonify({"message": "Login successful!", "status": True, "userid":idx['USERID']}), 200
          else:
              return jsonify({"message": "Wrong password!", "status": False}), 400
    else:
        return jsonify({"message": "User does not exist!", "status": False}), 400

# Register
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
        return jsonify({"message": "Passwords do not match!", "status": False}), 400

    # Check if the username already exists
    with open('users_data.csv', 'r', newline='') as file:
        reader = csv.reader(file)
        for row in reader:
            if row and row[0] == username:
                return jsonify({"message": "Username already exists!", "status": False}), 400

    # If the username doesn't exist, save the new user
    with open('users_data.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([username, password, location])

    return jsonify({"message": "Registration successful!", "status": True}), 200

# ShowAppt
@app.route('/ShowPanel', methods=['POST'])
def ShowPanel():
    data = request.get_json()
    userid = str(data.get('userid'))
    date = str(data.get('date'))

    # make query with id and date
    query = f'''SELECT APPOINTMENTDATE, APPOINTMENTLENGTH, APPOINTMENTTIME, APPOINTMENTTYPE, INTERNALID FROM BPSSamples.dbo.APPOINTMENTS
    where USERID={userid} and APPOINTMENTDATE=\'{date}\''''


    result = json.loads(subprocess.check_output(["python","ConnectDatabase.py", query]).decode('utf-8'))
    time = datetime.timedelta(seconds=result['APPOINTMENTTIME'])
    return jsonify(result)

# ShowPatient
@app.route('/ShowPatient', methods=['POST'])
def ShowPatient():
    data = request.get_json()
    name = str(data.get('patient')).ljust(30)

    query = f'''SELECT BPSSamples.dbo.APPOINTMENTS.*
    FROM BPSSamples.dbo.PATIENTS
    JOIN BPSSamples.dbo.APPOINTMENTS ON BPSSamples.dbo.PATIENTS.INTERNALID = BPSSamples.dbo.APPOINTMENTS.INTERNALID
    WHERE BPSSamples.dbo.PATIENTS.PREFERREDNAME = \'{name}\''''

    result = json.loads(subprocess.check_output(["python","ConnectDatabase.py", query]).decode('utf-8'))
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)

# http://127.0.0.1:5000/
# http://127.0.0.1:5000/apidocs