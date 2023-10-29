from flask import Flask, jsonify, request
from flasgger import Swagger
from flask_cors import CORS
from ConnectDatabase_v2 import operate_database
from datetime import datetime, timedelta

app = Flask(__name__)
swagger = Swagger(app)
CORS(app)

QUERY = 1
INSERT = 2

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
  firstname = str(data.get('firstname')).lower().strip()
  surname = str(data.get('surname')).lower().strip()
  password = str(data.get('password')).lower().strip()
  location = data.get('location')
  
  # get the users result from database
  query = '''SELECT surname, firstName, password, userID FROM users'''

  records = operate_database(query, QUERY)
  # check name and password
  for record in records:
      if str(record['firstname']).lower() != firstname or str(record['surname']).lower() != surname:
         continue
      if password == record['password']:
          return jsonify({"message": "Login successful!", "status": True, "userid":record['userid']}), 200
      else:
          return jsonify({"message": "Wrong password!", "status": False}), 400
  
  return jsonify({"message": "User does not exist!", "status": False}), 400


# Register
@app.route('/register', methods=['POST'])
def register():
  data = request.get_json()
  print(data)
  firstName = str(data.get('firstname')).lower().strip()
  surname = str(data.get('surname')).lower().strip()
  password = str(data.get('password'))
  confirmPassword = str(data.get('confirmpassword'))
  email = str(data.get('email'))
  phoneNumber = str(data.get('phonenumber')).lower().strip()
  sexCode = str(data.get('sexcode')).lower().strip()

  print(password, confirmPassword)

  if password != confirmPassword:
      return jsonify({"message": "Passwords do not match!", "status": False}), 400

  query = f"SELECT firstName, surname from users where firstName = {firstName} and surname = {surname}"
  records = operate_database(query, QUERY)

  if records:
    return jsonify({"message": "User already exists!", "status": False}), 400

  query = f'''INSERT INTO users (firstName, surname, password, email, phoneNumber, sexCode) VALUES 
  ('{firstName}', '{surname}', '{password}', '{email}', '{phoneNumber}', {sexCode});'''
  
  try:
    # 尝试插入新用户
    operate_database(query, INSERT)
  except Exception as e:
    return jsonify({"message": f"Insert error, Wrong input", "status": False}), 400  # 不确定500状态码是什么
  
  return jsonify({"message": "Registration successful!", "status": True}), 200


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

def proccess_result_for_ShowPanel(result, dayType):
  sum = 0
  # convert second to readable time format
  for idx in result:
      sum += int(idx['duration'])
      startTime = idx['starttime']
      # 1. 从字符串中解析出datetime对象
      # startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
      # 2. 使用strftime方法格式化时间
      startTime = startTime.strftime('%I:%M %p')
      startTime = startTime.lower()  # 转换为小写，如am和pm
      idx['starttime'] = startTime

      idx['note'] = "nima si "
      idx['daytype'] = f"{dayType}"  # 表示前一天，当天，后一天
  return result, sum


# ShowAppt
@app.route('/ShowPanel', methods=['POST'])
def ShowPanel():
  data = request.get_json()
  userid = str(data.get('userid'))
  cur_date = str(data.get('date'))  # 当天的日期
  # 将日期字符串转换为日期对象
  date_obj = datetime.strptime(cur_date, "%Y-%m-%d")

  # 计算前一天和后一天
  pre_date = date_obj - timedelta(days=1)
  next_date = date_obj + timedelta(days=1)

  # 将结果格式化为字符串
  pre_date = pre_date.strftime("%Y-%m-%d")
  next_date = next_date.strftime("%Y-%m-%d")


  # make query with id and date
  query1 = get_spec_appointments(userid, cur_date)  # 当天
  query2 = get_spec_appointments(userid, pre_date)  # 前一天
  query3 = get_spec_appointments(userid, next_date)  # 后一天

  result1 = operate_database(query1, QUERY)  # 当天
  result2 = operate_database(query2, QUERY)  # 前一天
  result3 = operate_database(query3, QUERY)  # 后一天

  result1, sum = proccess_result_for_ShowPanel(result1, 1)  # 当天 xuegaone 
  result2, _ = proccess_result_for_ShowPanel(result2, 0)  # 前一天
  result3, _ = proccess_result_for_ShowPanel(result3, 2)  # 后一天
  
  hours = sum // 60
  mins = sum % 60
  stat = f'''On {cur_date},
  I have {len(result1)} appointment(s) in total.
  My expected workload duration is {hours} hour(s) {mins} minute(s).'''
  
  total_result = result1 + result2 + result3
  print(total_result)
  return jsonify({"appointments": total_result, "description": stat}), 200


@app.route('/ShowPatientList', methods=['POST'])
def ShowPatientList():
  data = request.get_json()
  userid = str(data.get('userid').get('current'))
  print(data)

  query=f'''SELECT DISTINCT table2.firstname as firstname, table2.surname as surname, table1.patientID as patientID 
  FROM appointments as table1
  inner join patients as table2 on table2.patientID = table1.patientID
  where table1.userID={userid}'''

  result = operate_database(query, QUERY)
  print(result)
  return jsonify({'patients':result}), 200


def proccess_result_for_ShowPatientRecord(result):
  # convert second to readable time format
  for idx in result:
      startTime = idx['starttime']
      # 1. 从字符串中解析出datetime对象
      # startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
      # 2. 使用strftime方法格式化时间
      startTime = startTime.strftime('%I:%M %p')
      startTime = startTime.lower()  # 转换为小写，如am和pm
      idx['starttime'] = startTime


      idx['note'] = "nima si "
  return result


# ShowPatient
@app.route('/ShowPatientRecord', methods=['POST'])
def ShowPatientRecord():
  data = request.get_json()
  userid = str(data.get('userid').get('current'))
  patientID = str(data.get('patientid'))
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

  history = proccess_result_for_ShowPatientRecord(operate_database(query1, QUERY))
  future = proccess_result_for_ShowPatientRecord(operate_database(query2, QUERY))
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

  records = operate_database(query, QUERY)
  return jsonify({'patientDetail': records}), 200




if __name__ == '__main__':
    app.run(debug=True)

# http://127.0.0.1:5000/
# http://127.0.0.1:5000/apidocs