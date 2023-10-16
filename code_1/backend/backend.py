from flask import Flask, jsonify, request
from flasgger import Swagger
from flask_cors import CORS
import ConnectDatabase
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

    result = json.loads(ConnectDatabase.myConnect(query))
    # result = json.loads(subprocess.check_output(["python","ConnectDatabase.py", query]).decode('utf-8'))

    # check name and password
    for idx in result:
        name = re.sub(" +", "", f"{idx['FIRSTNAME']} {idx['SURNAME']}")
        username = re.sub(" +", "", username)
        if username in name:
          if password=='password':
              print('login')
              return jsonify({"message": "Login successful!", "status": True, "userid":idx['USERID']}), 200
          else:
              print('password wrong')
              return jsonify({"message": "Wrong password!", "status": False}), 400
    
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
    date = f"{str(data.get('date'))} 00:00:00.000"
    # 0	Unavailable         
    # 1	Booked              
    # 2	Waiting             
    # 3	With doctor         
    # 4	At billing          
    # 5	Completed           
    # 9	Unavailable         
    # 10	DNA                 
    # 11	Reserved            
    # 12	Invoiced            
    # 13	Paid                
    # 99	Unavailable         
    # make query with id and date
    query = f'''SELECT table1.RECORDID, table1.APPOINTMENTDATE, table1.APPOINTMENTLENGTH, table1.APPOINTMENTTIME, table4.DESCRIPTION, table5.DESCRIPTION as Status, table2.firstname, table2.SURNAME, table3.PREFERREDNAME, table3.INTERNALID,
      CASE
        WHEN table1.APPOINTMENTTYPE=30 THEN 1
        ELSE 0
      END AS IsPhone,
      CASE
        WHEN table3.MEDICARENO IS NULL THEN 0
        ELSE 1
      END AS HasMedicare
    FROM BPSSamples.dbo.APPOINTMENTS as table1
    inner join BPSSamples.dbo.USERS as table2
    ON table1.USERID = table2.USERID
    inner join BPSSamples.dbo.PATIENTS as table3
    ON table3.INTERNALID = table1.INTERNALID
    inner join BPSSamples.dbo.APPOINTMENTTYPES as table4
    ON table4.APPOINTMENTCODE = table1.APPOINTMENTCODE
    inner join BPSSamples.dbo.APPOINTMENTCODES as table5
    ON table5.APPOINTMENTCODE = table1.APPOINTMENTCODE
    where table1.USERID={userid} and table1.APPOINTMENTDATE=\'{date}\''''


    result = json.loads(ConnectDatabase.myConnect(query))
    sum = 0
    # convert second to readable time format
    for idx in result:
        sum += int(idx['APPOINTMENTLENGTH'])
        sec = int(idx['APPOINTMENTTIME'])
        time = datetime.timedelta(seconds=sec)
        idx['APPOINTMENTTIME'] = str(time)
    
    stat = f'''On {date},
    I have {len(result)} appointment(s) in total.
    My expected workload duration is {sum/3600:.1f} hour(s).'''

    print(result)
    return jsonify(result ,stat)

@app.route('/ShowPatientList', methods=['POST'])
def ShowPatientList():
    data = request.get_json()
    userid = str(data.get('userid'))

    query=f'''SELECT DISTINCT BPSSamples.dbo.PATIENTS.PREFERREDNAME, BPSSamples.dbo.PATIENTS.INTERNALID FROM BPSSamples.dbo.APPOINTMENTS
    join BPSSamples.dbo.PATIENTS on BPSSamples.dbo.PATIENTS.INTERNALID=BPSSamples.dbo.APPOINTMENTS.INTERNALID
    where BPSSamples.dbo.APPOINTMENTS.USERID={userid}'''

    result = json.loads(ConnectDatabase.myConnect(query))
    return jsonify(result)
    
# ShowPatient
@app.route('/ShowPatientRecord', methods=['POST'])
def ShowPatientRecord():
    data = request.get_json()
    userid = data.get('userid')
    internalid = data.get('internalid')

    query1 = f'''select *
    from BPSSamples.dbo.APPOINTMENTS
    where INTERNALID = {internalid} and userid = {userid} and APPOINTMENTDATE<CURRENT_TIMESTAMP'''

    query2 = f'''select *
    from BPSSamples.dbo.APPOINTMENTS
    where INTERNALID = {internalid} and userid = {userid} and APPOINTMENTDATE>=CURRENT_TIMESTAMP'''

    history = json.loads(ConnectDatabase.myConnect(query1))
    future = json.loads(ConnectDatabase.myConnect(query2))
    return jsonify(history, future)


if __name__ == '__main__':
    app.run(debug=True)

# http://127.0.0.1:5000/
# http://127.0.0.1:5000/apidocs