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

# 根据输入的userid和date来获取query
def get_query(userid, date):
    return f'''SELECT table1.RECORDID, table1.APPOINTMENTDATE, table1.APPOINTMENTLENGTH as duration, table1.APPOINTMENTTIME as startTime, table4.DESCRIPTION as appointmentType, table5.DESCRIPTION as status, table2.firstname firstName, table2.SURNAME as surname, table3.PREFERREDNAME as patientName, table3.INTERNALID as patientID,
      CASE
        WHEN table1.APPOINTMENTTYPE=30 and table3.INTERNALID in (
			SELECT INTERNALID FROM BPSSamples.dbo.APPOINTMENTS
			WHERE LOCATIONID=1 and DATEDIFF(DAY, GETDATE(), APPOINTMENTDATE)<= -365
		) THEN 1
        ELSE 0
      END AS isPhone,
      CASE
        WHEN table3.MEDICARENO IS NULL THEN 0
        ELSE 1
      END AS hasMedicare
    FROM BPSSamples.dbo.APPOINTMENTS as table1
    inner join BPSSamples.dbo.USERS as table2
    ON table1.USERID = table2.USERID
    inner join BPSSamples.dbo.PATIENTS as table3
    ON table3.INTERNALID = table1.INTERNALID
    inner join BPSSamples.dbo.APPOINTMENTTYPES as table4
    ON table4.APPOINTMENTCODE = table1.APPOINTMENTCODE
    inner join BPSSamples.dbo.APPOINTMENTCODES as table5
    ON table5.APPOINTMENTCODE = table1.APPOINTMENTCODE
    where table1.USERID={userid} and table1.APPOINTMENTDATE=\'{date}\'
  '''


def proccess_result(result, dayType):
    sum = 0
    # convert second to readable time format
    for idx in result:
        sum += int(idx['duration'])
        sec = int(idx['startTime']) 
        time = datetime.timedelta(seconds=sec)
        if int(str(time).split(':')[0]) >= 12:
           idx['startTime'] = f'{str(time)[:-3]} pm'
        else:
           idx['startTime'] = f'{str(time)[:-3]} am'
        idx['patientName'] = str(idx['patientName']).strip()
        idx['note'] = "nima si "
        idx['dayType'] = f"{dayType}"
        idx['duration'] = str(int(idx['duration'])//60)

    return result, sum

# ShowAppt
@app.route('/ShowPanel', methods=['POST'])
def ShowPanel():
    data = request.get_json()
    userid = str(data.get('userid'))
    cur_date = str(data.get('date'))  # 当天的日期
    # 将日期字符串转换为日期对象
    date_obj = datetime.datetime.strptime(cur_date, "%Y-%m-%d")

    # 计算前一天和后一天
    pre_date = date_obj - datetime.timedelta(days=1)
    next_date = date_obj + datetime.timedelta(days=1)

    # 将结果格式化为字符串
    pre_date = pre_date.strftime("%Y-%m-%d")
    next_date = next_date.strftime("%Y-%m-%d")

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
    date = f"{cur_date} 00:00:00.000"
    query1 = get_query(userid, date)  # 当天
    date = f"{pre_date} 00:00:00.000"
    query2 = get_query(userid, date)  # 前一天
    date = f"{next_date} 00:00:00.000"
    query3 = get_query(userid, date)  # 后一天

    result1 = json.loads(ConnectDatabase.myConnect(query1))
    result2 = json.loads(ConnectDatabase.myConnect(query2))
    result3 = json.loads(ConnectDatabase.myConnect(query3))

    result1, sum = proccess_result(result1, 1)  # 当天
    result2, _ = proccess_result(result2, 0)  # 前一天
    result3, _ = proccess_result(result3, 2)  # 后一天
    
    stat = f'''On {cur_date},
    I have {len(result1)} appointment(s) in total.
    My expected workload duration is {sum/3600:.1f} hour(s).'''

    return jsonify({"appointments": result1 + result2 + result3, "description": stat})


@app.route('/ShowPatientList', methods=['POST'])
def ShowPatientList():
    data = request.get_json()
    userid = str(data.get('userid'))

    query=f'''SELECT DISTINCT BPSSamples.dbo.PATIENTS.PREFERREDNAME as patientName, BPSSamples.dbo.PATIENTS.INTERNALID as patientID FROM BPSSamples.dbo.APPOINTMENTS
    join BPSSamples.dbo.PATIENTS on BPSSamples.dbo.PATIENTS.INTERNALID=BPSSamples.dbo.APPOINTMENTS.INTERNALID
    where BPSSamples.dbo.APPOINTMENTS.USERID={userid}'''

    result = json.loads(ConnectDatabase.myConnect(query))
    return jsonify({'patients':result})
    
# ShowPatient
@app.route('/ShowPatientRecord', methods=['POST'])
def ShowPatientRecord():
    data = request.get_json()
    userid = data.get('userid')
    internalid = data.get('patientID')

    query1 = f'''SELECT table1.RECORDID, table1.APPOINTMENTDATE, table1.APPOINTMENTLENGTH as duration, table1.APPOINTMENTTIME as startTime, table4.DESCRIPTION as appointmentType, table5.DESCRIPTION as status, table2.firstname as firstName, table2.SURNAME as surname, table3.PREFERREDNAME as patientName, table3.INTERNALID as patientID,
          CASE
            WHEN table1.APPOINTMENTTYPE=30 and table3.INTERNALID in (
          SELECT INTERNALID FROM BPSSamples.dbo.APPOINTMENTS
          WHERE LOCATIONID=1 and DATEDIFF(DAY, GETDATE(), APPOINTMENTDATE)<= -365
        ) THEN 1
            ELSE 0
          END AS isPhone,
          CASE
            WHEN table3.MEDICARENO IS NULL THEN 0
            ELSE 1
          END AS hasMedicare
    FROM BPSSamples.dbo.APPOINTMENTS as table1
    inner join BPSSamples.dbo.USERS as table2
    ON table1.USERID = table2.USERID
    inner join BPSSamples.dbo.PATIENTS as table3
    ON table3.INTERNALID = table1.INTERNALID
    inner join BPSSamples.dbo.APPOINTMENTTYPES as table4
    ON table4.APPOINTMENTCODE = table1.APPOINTMENTCODE
    inner join BPSSamples.dbo.APPOINTMENTCODES as table5
    ON table5.APPOINTMENTCODE = table1.APPOINTMENTCODE
    where INTERNALID = {internalid} and userid = {userid} and APPOINTMENTDATE<CURRENT_TIMESTAMP'''

    query2 = f'''SELECT table1.RECORDID, table1.APPOINTMENTDATE, table1.APPOINTMENTLENGTH as duration, table1.APPOINTMENTTIME as startTime, table4.DESCRIPTION as appointmentType, table5.DESCRIPTION as status, table2.firstname firstName, table2.SURNAME as surname, table3.PREFERREDNAME as patientName, table3.INTERNALID as patientID,
          CASE
            WHEN table1.APPOINTMENTTYPE=30 and table3.INTERNALID in (
          SELECT INTERNALID FROM BPSSamples.dbo.APPOINTMENTS
          WHERE LOCATIONID=1 and DATEDIFF(DAY, GETDATE(), APPOINTMENTDATE)<= -365
        ) THEN 1
            ELSE 0
          END AS isPhone,
          CASE
            WHEN table3.MEDICARENO IS NULL THEN 0
            ELSE 1
          END AS hasMedicare
    FROM BPSSamples.dbo.APPOINTMENTS as table1
    inner join BPSSamples.dbo.USERS as table2
    ON table1.USERID = table2.USERID
    inner join BPSSamples.dbo.PATIENTS as table3
    ON table3.INTERNALID = table1.INTERNALID
    inner join BPSSamples.dbo.APPOINTMENTTYPES as table4
    ON table4.APPOINTMENTCODE = table1.APPOINTMENTCODE
    inner join BPSSamples.dbo.APPOINTMENTCODES as table5
    ON table5.APPOINTMENTCODE = table1.APPOINTMENTCODE
    where INTERNALID = {internalid} and userid = {userid} and APPOINTMENTDATE>=CURRENT_TIMESTAMP'''

    history = json.loads(ConnectDatabase.myConnect(query1))
    future = json.loads(ConnectDatabase.myConnect(query2))
    return jsonify({'history':history, 'future':future})


if __name__ == '__main__':
    app.run(debug=True)

# http://127.0.0.1:5000/
# http://127.0.0.1:5000/apidocs