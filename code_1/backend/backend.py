from flask import Flask, jsonify, request
from flasgger import Swagger
from flask_cors import CORS
from ConnectDatabase_v2 import operate_database
import datetime
import csv
import pyodbc
import subprocess
import json
import re

# demo to get data from database, sql should be modified
# sql = '''SELECT * FROM BPSSamples.dbo.APPOINTMENTS
# where APPOINTMENTDATE<CURRENT_TIMESTAMP and INTERNALID=(36)'''
# result = (subprocess.check_output(["python","ConnectDatabase.py", sql]).decode('utf-8'))
# result = json.dumps(result, indent=4)
# print(result)
# Frederick Findacure

app = Flask(__name__)
swagger = Swagger(app)
CORS(app)

# def RemoveSpace(result):
#     for idx in result:
#       for key in idx.keys():
#           try:
#             idx[key] = idx[key].strip()
#           except:
#               continue
          
# # Login
# @app.route('/login', methods=['POST'])
# def login():
#     """
#     This is the login endpoint
#     Call this endpoint to login a existed user
#     ---
#     tags:
#       - Login API
#     parameters:
#       - name: username
#         in: formData
#         type: string
#         required: true
#       - name: password
#         in: formData
#         type: string
#         required: true
#       - name: location
#         in: formData
#         type: string
#         required: true
#     responses:
#       200:
#         description: Login successful
#       401:
#         description: Wrong password
#       404:
#         description: User does not exist
#     """
        
#     data = request.get_json()

#     username = data.get('username')
#     password = data.get('password')
#     location = data.get('location')
    
#     # get the users result from database
#     query = '''SELECT SURNAME, FIRSTNAME, PASSWORD, USERID FROM BPSSamples.dbo.USERS'''

#     result = (ConnectDatabase.myConnect(query))
#     # result = (subprocess.check_output(["python","ConnectDatabase.py", query]).decode('utf-8'))

#     # check name and password
#     for idx in result:
#         name = re.sub(" +", "", f"{idx['FIRSTNAME']} {idx['SURNAME']}")
#         username = re.sub(" +", "", username)
#         if username in name:
#           if password=='password':
#               print('login')
#               return jsonify({"message": "Login successful!", "status": True, "userid":idx['USERID']}), 200
#           else:
#               print('password wrong')
#               return jsonify({"message": "Wrong password!", "status": False}), 400
    
#     return jsonify({"message": "User does not exist!", "status": False}), 400

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
  query = '''SELECT surname, firstName, password, userID FROM BPSSamples.dbo.USERS'''

  result = operate_database(query)
  # result = (subprocess.check_output(["python","ConnectDatabase.py", query]).decode('utf-8'))

  # check name and password
  for idx in result:
      name = re.sub(" +", "", f"{idx['firstName']} {idx['surname']}")
      username = re.sub(" +", "", username)
      if username in name:
        if password=='password':
            print('login')
            return jsonify({"message": "Login successful!", "status": True, "userid":idx['userID']}), 200
        else:
            print('password wrong')
            return jsonify({"message": "Wrong password!", "status": False}), 400
  
  return jsonify({"message": "User does not exist!", "status": False}), 400





# # Register
# @app.route('/register', methods=['POST'])
# def register():
#   """
#   This is the registration endpoint
#   Call this endpoint to register a new user
#   ---
#   tags:
#     - Registration API
#   parameters:
#     - name: username
#       in: formData
#       type: string
#       required: true
#     - name: password
#       in: formData
#       type: string
#       required: true
#     - name: confirm password
#       in: formData
#       type: string
#       required: true
#     - name: location
#       in: formData
#       type: string
#       required: true
#   responses:
#     200:
#       description: Registration successful
#     400:
#       description: Passwords do not match
#   """

#   data = request.get_json()

#   username = data.get('username')
#   password = data.get('password')
#   confirmPassword = data.get('confirm password')  
#   location = data.get('location')


#   if password != confirmPassword:
#       return jsonify({"message": "Passwords do not match!", "status": False}), 400

#   # Check if the username already exists
#   with open('users_data.csv', 'r', newline='') as file:
#       reader = csv.reader(file)
#       for row in reader:
#           if row and row[0] == username:
#               return jsonify({"message": "Username already exists!", "status": False}), 400

#   # If the username doesn't exist, save the new user
#   with open('users_data.csv', 'a', newline='') as file:
#       writer = csv.writer(file)
#       writer.writerow([username, password, location])

#   return jsonify({"message": "Registration successful!", "status": True}), 200


# Register
@app.route('/register', methods=['POST'])
def register():
  data = request.get_json()
  firstName = data.get('firstName')
  surname = data.get('surname')
  password = data.get('password')
  confirmPassword = data.get('confirmPassword')  
  email = data.get('email')
  phoneNumber = data.get('phoneNumber')
  sexCode = data.get('sexCode')

  if password != confirmPassword:
      return jsonify({"message": "Passwords do not match!", "status": False}), 400

  query = f"SELECT firstName, surname from users where firstName = {firstName} and surname = {surname}"
  records = operate_database(query)

  if records:
    return jsonify({"message": "User already exists!", "status": False}), 400

  query = f'''INSERT INTO users (firstName, surname, password, email, phoneNumber, sexCode) VALUES 
  ({firstName}, {surname}, {password}, {email}, {phoneNumber}, {sexCode});'''
  
  try:
        # 尝试插入新用户
        operate_database(query)
  except Exception as e:
      return jsonify({"message": f"Database error: {e.pgerror}, Wrong input", "status": False}), 400  # 不确定500状态码是什么
  
  return jsonify({"message": "Registration successful!", "status": True}), 200




# # 根据输入的userid和date来获取query
# def get_query(userid, date):
#     return f'''SELECT table1.RECORDID, table1.APPOINTMENTDATE, table1.APPOINTMENTLENGTH as duration, table1.APPOINTMENTTIME as startTime, table4.DESCRIPTION as appointmentType, table5.DESCRIPTION as status, table2.firstname firstName, table2.SURNAME as surname, table3.PREFERREDNAME as patientName, table3.INTERNALID as patientID,
#       CASE
#         WHEN table1.APPOINTMENTTYPE=30 and table3.INTERNALID in (
# 			SELECT INTERNALID FROM BPSSamples.dbo.APPOINTMENTS
# 			WHERE LOCATIONID=1 and DATEDIFF(DAY, GETDATE(), APPOINTMENTDATE)<= -365
# 		) THEN 1
#         ELSE 0
#       END AS isPhone,
#       CASE
#         WHEN table3.MEDICARENO IS NULL THEN 0
#         ELSE 1
#       END AS hasMedicare
#     FROM BPSSamples.dbo.APPOINTMENTS as table1
#     inner join BPSSamples.dbo.USERS as table2
#     ON table1.USERID = table2.USERID
#     inner join BPSSamples.dbo.PATIENTS as table3
#     ON table3.INTERNALID = table1.INTERNALID
#     inner join BPSSamples.dbo.APPOINTMENTTYPES as table4
#     ON table4.APPOINTMENTCODE = table1.APPOINTMENTCODE
#     inner join BPSSamples.dbo.APPOINTMENTCODES as table5
#     ON table5.APPOINTMENTCODE = table1.APPOINTMENTCODE
#     where table1.USERID={userid} and table1.APPOINTMENTDATE=\'{date}\'
#   '''


# 根据输入的userid和date来获取query
def get_spec_appointments(userid, date):
  return f'''SELECT table1.appointmentID, table1.appointmentDate, table1.duration as duration, 
  table1.startTime as startTime, table4.appointmentTypeName as appointmentType, 
  table5.appointmentStatusName as status, table2.firstName as firstName, table2.surname as surname, 
  table3.firstName as patientName, table3.patientID as patientID,
    CASE
      WHEN table1.appointmentTypeID=29 and table3.patientID in (
    SELECT patientID FROM appointments
    WHERE locationID=1 and (CURRENT_DATE - appointmentDate) >= interval '365 days'
  ) THEN 1
      ELSE 0
    END AS isPhone,
    CASE
      WHEN table3.medicareNo IS NULL THEN 0
      ELSE 1
    END AS hasMedicare
  FROM appointments as table1
  inner join users as table2
  ON table1.userID = table2.userID
  inner join patients as table3
  ON table3.patientID = table1.patientID
  inner join appointmentTypes as table4
  ON table4.appointmentTypeID = table1.appointmentTypeID
  inner join appointmentStatus as table5
  ON table5.appointmentStatusID = table1.appointmentStatusID
  where table1.userID={userid} and DATE(table1.appointmentDate)=\'{date}\'
  '''


# def proccess_result(result, dayType):
#     sum = 0
#     # convert second to readable time format
#     for idx in result:
#         sum += int(idx['duration'])
#         sec = int(idx['startTime']) 
#         time = datetime.timedelta(seconds=sec)
#         if int(str(time).split(':')[0]) >= 12:
#            idx['startTime'] = f'{str(time)[:-3]} pm'
#         else:
#            idx['startTime'] = f'{str(time)[:-3]} am'
#         idx['patientName'] = str(idx['patientName']).strip()
#         idx['note'] = "nima si "
#         idx['dayType'] = f"{dayType}"
#         idx['duration'] = str(int(idx['duration'])//60)

#         for key in idx.keys():
#             try:
#               idx[key] = idx[key].strip()
#             except:
#                 continue
#     return result, sum



def proccess_result_for_ShowPanel(result, dayType):
  sum = 0
  # convert second to readable time format
  for idx in result:
      sum += int(idx['duration'])
      startTime = idx['startTime']
      # 1. 从字符串中解析出datetime对象
      startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
      # 2. 使用strftime方法格式化时间
      startTime = startTime.strftime('%I:%M %p')
      startTime = startTime.lower()  # 转换为小写，如am和pm

      idx['note'] = "nima si "
      idx['dayType'] = f"{dayType}"  # 表示前一天，当天，后一天
  return result, sum



# # ShowAppt
# @app.route('/ShowPanel', methods=['POST'])
# def ShowPanel():
#     data = request.get_json()
#     userid = str(data.get('userid'))
#     cur_date = str(data.get('date'))  # 当天的日期
#     # 将日期字符串转换为日期对象
#     date_obj = datetime.datetime.strptime(cur_date, "%Y-%m-%d")

#     # 计算前一天和后一天
#     pre_date = date_obj - datetime.timedelta(days=1)
#     next_date = date_obj + datetime.timedelta(days=1)

#     # 将结果格式化为字符串
#     pre_date = pre_date.strftime("%Y-%m-%d")
#     next_date = next_date.strftime("%Y-%m-%d")

#     # 0	Unavailable         
#     # 1	Booked              
#     # 2	Waiting             
#     # 3	With doctor         
#     # 4	At billing          
#     # 5	Completed           
#     # 9	Unavailable         
#     # 10	DNA                 
#     # 11	Reserved            
#     # 12	Invoiced            
#     # 13	Paid                
#     # 99	Unavailable         
#     # make query with id and date
#     date = f"{cur_date} 00:00:00.000"
#     query1 = get_query(userid, date)  # 当天
#     date = f"{pre_date} 00:00:00.000"
#     query2 = get_query(userid, date)  # 前一天
#     date = f"{next_date} 00:00:00.000"
#     query3 = get_query(userid, date)  # 后一天

#     result1 = (ConnectDatabase.myConnect(query1))
#     result2 = (ConnectDatabase.myConnect(query2))
#     result3 = (ConnectDatabase.myConnect(query3))

#     result1, sum = proccess_result(result1, 1)  # 当天
#     result2, _ = proccess_result(result2, 0)  # 前一天
#     result3, _ = proccess_result(result3, 2)  # 后一天
    
#     stat = f'''On {cur_date},
#     I have {len(result1)} appointment(s) in total.
#     My expected workload duration is {sum/3600:.1f} hour(s).'''

#     return jsonify({"appointments": result1 + result2 + result3, "description": stat})


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


  # make query with id and date
  query1 = get_spec_appointments(userid, cur_date)  # 当天
  query2 = get_spec_appointments(userid, pre_date)  # 前一天
  query3 = get_spec_appointments(userid, next_date)  # 后一天

  result1 = operate_database(query1)  # 当天
  result2 = operate_database(query2)  # 前一天
  result3 = operate_database(query3)  # 后一天

  result1, sum = proccess_result_for_ShowPanel(result1, 1)  # 当天
  result2, _ = proccess_result_for_ShowPanel(result2, 0)  # 前一天
  result3, _ = proccess_result_for_ShowPanel(result3, 2)  # 后一天
  
  stat = f'''On {cur_date},
  I have {len(result1)} appointment(s) in total.
  My expected workload duration is {sum/3600:.1f} hour(s).'''

  return jsonify({"appointments": result1 + result2 + result3, "description": stat}), 200



# @app.route('/ShowPatientList', methods=['POST'])
# def ShowPatientList():
#     data = request.get_json()
#     userid = str(data.get('userid').get('current'))
#     query=f'''SELECT DISTINCT BPSSamples.dbo.PATIENTS.PREFERREDNAME as patientName, BPSSamples.dbo.PATIENTS.INTERNALID as patientID FROM BPSSamples.dbo.APPOINTMENTS
#     join BPSSamples.dbo.PATIENTS on BPSSamples.dbo.PATIENTS.INTERNALID=BPSSamples.dbo.APPOINTMENTS.INTERNALID
#     where BPSSamples.dbo.APPOINTMENTS.USERID={userid}'''

#     result = (ConnectDatabase.myConnect(query))
#     # print(result)
#     return jsonify({'patients':result}), 200

@app.route('/ShowPatientList', methods=['POST'])
def ShowPatientList():
  data = request.get_json()
  userid = str(data.get('userid').get('current'))
  query=f'''SELECT DISTINCT table2.surname as patientName, table1.patientID as patientID 
  FROM appointments as table1
  inner join patients as table2 on table2.patientID = table1.patientID
  where table1.userID={userid}'''

  result = operate_database(query)
  return jsonify({'patients':result}), 200



# def proccess_result1(result):
#     # convert second to readable time format
#     for idx in result:
#         sec = int(idx['startTime']) 
#         time = datetime.timedelta(seconds=sec)
#         if int(str(time).split(':')[0]) >= 12:
#            idx['startTime'] = f'{str(time)[:-3]} pm'
#         else:
#            idx['startTime'] = f'{str(time)[:-3]} am'
#         idx['patientName'] = str(idx['patientName']).strip()
#         idx['note'] = "nima si "
#         idx['duration'] = str(int(idx['duration'])//60)
#         idx['day'] = idx['day'].split()[0]
#     return result

def proccess_result_for_ShowPatientRecord(result):
  # convert second to readable time format
  for idx in result:
      startTime = idx['startTime']
      # 1. 从字符串中解析出datetime对象
      startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
      # 2. 使用strftime方法格式化时间
      startTime = startTime.strftime('%I:%M %p')
      startTime = startTime.lower()  # 转换为小写，如am和pm

      idx['note'] = "nima si "
  return result


# # ShowPatient
# @app.route('/ShowPatientRecord', methods=['POST'])
# def ShowPatientRecord():
#     data = request.get_json()
#     userid = str(data.get('userid').get('current'))
#     internalid = str(data.get('patientID'))
#     print(userid, internalid)

#     query1 = f'''SELECT table1.RECORDID, table1.APPOINTMENTDATE as day, table1.APPOINTMENTLENGTH as duration, table1.APPOINTMENTTIME as startTime, table4.DESCRIPTION as appointmentType, table5.DESCRIPTION as status, table2.firstname as firstName, table2.SURNAME as surname, table3.PREFERREDNAME as patientName, table3.INTERNALID as patientID,
#           CASE
#             WHEN table1.APPOINTMENTTYPE=30 and table3.INTERNALID in (
#           SELECT INTERNALID FROM BPSSamples.dbo.APPOINTMENTS
#           WHERE LOCATIONID=1 and DATEDIFF(DAY, GETDATE(), APPOINTMENTDATE)<= -365
#         ) THEN 1
#             ELSE 0
#           END AS isPhone,
#           CASE
#             WHEN table3.MEDICARENO IS NULL THEN 0
#             ELSE 1
#           END AS hasMedicare
#     FROM BPSSamples.dbo.APPOINTMENTS as table1
#     inner join BPSSamples.dbo.USERS as table2
#     ON table1.USERID = table2.USERID
#     inner join BPSSamples.dbo.PATIENTS as table3
#     ON table3.INTERNALID = table1.INTERNALID
#     inner join BPSSamples.dbo.APPOINTMENTTYPES as table4
#     ON table4.APPOINTMENTCODE = table1.APPOINTMENTCODE
#     inner join BPSSamples.dbo.APPOINTMENTCODES as table5
#     ON table5.APPOINTMENTCODE = table1.APPOINTMENTCODE
#     where table1.INTERNALID = {internalid} and table1.userid = {userid} and APPOINTMENTDATE<CURRENT_TIMESTAMP'''

#     query2 = f'''SELECT table1.RECORDID, table1.APPOINTMENTDATE, table1.APPOINTMENTLENGTH as duration, table1.APPOINTMENTTIME as startTime, table4.DESCRIPTION as appointmentType, table5.DESCRIPTION as status, table2.firstname firstName, table2.SURNAME as surname, table3.PREFERREDNAME as patientName, table3.INTERNALID as patientID,
#           CASE
#             WHEN table1.APPOINTMENTTYPE=30 and table3.INTERNALID in (
#           SELECT INTERNALID FROM BPSSamples.dbo.APPOINTMENTS
#           WHERE LOCATIONID=1 and DATEDIFF(DAY, GETDATE(), APPOINTMENTDATE)<= -365
#         ) THEN 1
#             ELSE 0
#           END AS isPhone,
#           CASE
#             WHEN table3.MEDICARENO IS NULL THEN 0
#             ELSE 1
#           END AS hasMedicare
#     FROM BPSSamples.dbo.APPOINTMENTS as table1
#     inner join BPSSamples.dbo.USERS as table2
#     ON table1.USERID = table2.USERID
#     inner join BPSSamples.dbo.PATIENTS as table3
#     ON table3.INTERNALID = table1.INTERNALID
#     inner join BPSSamples.dbo.APPOINTMENTTYPES as table4
#     ON table4.APPOINTMENTCODE = table1.APPOINTMENTCODE
#     inner join BPSSamples.dbo.APPOINTMENTCODES as table5
#     ON table5.APPOINTMENTCODE = table1.APPOINTMENTCODE
#     where table1.INTERNALID = {internalid} and table1.userid = {userid} and APPOINTMENTDATE>=CURRENT_TIMESTAMP'''

#     history = proccess_result1(ConnectDatabase.myConnect(query1))
#     future = proccess_result1(ConnectDatabase.myConnect(query2))
#     # print(result)
#     return jsonify({'history':history, 'future':future})

# ShowPatient
@app.route('/ShowPatientRecord', methods=['POST'])
def ShowPatientRecord():
  data = request.get_json()
  userid = str(data.get('userid').get('current'))
  patientID = str(data.get('patientID'))
  # print(userid, patientID)
  base_query = '''
  SELECT table1.appointmentID, DATE(table1.appointmentDate) as day, table1.duration as duration, 
  table1.startTime as startTime, table4.appointmentTypeName as appointmentType, 
  table5.appointmentStatusName as status, table2.firstName as firstName, table2.surname as surname, 
  table3.firstName as patientName, table3.patientID as patientID,
        CASE
          WHEN table1.appointmentTypeID=29 and table3.patientID in (
        SELECT patientID FROM appointments
        WHERE locationID=1 and (CURRENT_DATE - appointmentDate) >= interval '365 days'
      ) THEN 1
          ELSE 0
        END AS isPhone,
        CASE
          WHEN table3.medicareNo IS NULL THEN 0
          ELSE 1
        END AS hasMedicare
      FROM appointments as table1
      inner join users as table2
      ON table1.userID = table2.userID
      inner join patients as table3
      ON table3.patientID = table1.patientID
      inner join appointmentTypes as table4
      ON table4.appointmentTypeID = table1.appointmentTypeID
      inner join appointmentStatus as table5
      ON table5.appointmentStatusID = table1.appointmentStatusID 
  '''
  query1 = base_query + f'''where table1.patientID = {patientID} and table1.userID = {userid} and table1.appointmentDate < CURRENT_TIMESTAMP'''
  query2 = base_query + f'''where table1.patientID = {patientID} and table1.userID = {userid} and table1.appointmentDate >= CURRENT_TIMESTAMP'''

  history = proccess_result_for_ShowPatientRecord(operate_database(query1))
  future = proccess_result_for_ShowPatientRecord(operate_database(query2))
  # print(result)
  return jsonify({'history':history, 'future':future}), 200



# getAllPatient
@app.route('/GetAllPatient', methods=['POST'])
def getAllPatient():
  data = request.get_json()
  userid = str(data.get('userid').get('current').get('token'))

  # 查询userid的所有病人
  query = f'''
  SELECT DISTINCT table2.firstName as firstName, table2.surname as surname, 
  table2.patientID as patientID, table2.sexCode
  FROM appointments as table1
  inner join patients as table2
  ON table2.patientID = table1.patientID
  where table1.userID = {userid}
  '''

  records = operate_database(query)
  return jsonify({'patientDetail': records}), 200




if __name__ == '__main__':
    app.run(debug=True)

# http://127.0.0.1:5000/
# http://127.0.0.1:5000/apidocs