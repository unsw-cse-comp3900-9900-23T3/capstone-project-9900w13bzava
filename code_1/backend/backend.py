from flask import Flask, jsonify, request
from flasgger import Swagger
from flask_cors import CORS
from ConnectDatabase_v2 import operate_database
from datetime import datetime, timedelta

app = Flask(__name__)
swagger = Swagger(app)
CORS(app)

SEARCH = 1
ADD_DELETE_UPDATE = 2

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

  records = operate_database(query, SEARCH)
  # check name and password
  for record in records:
      if str(record['firstname']).lower() != firstname or str(record['surname']).lower() != surname:
         continue
      if password == record['password']:
          return jsonify({"message": "Login Successful!", "status": True, "userid":record['userid']}), 200
      else:
          return jsonify({"message": "Wrong Password!", "status": False}), 400
  
  return jsonify({"message": "User Does Not Exist!", "status": False}), 400


# Register
@app.route('/register', methods=['POST'])
def register():
  data = request.get_json()
  firstName = str(data.get('firstname')).lower().strip()
  surname = str(data.get('surname')).lower().strip()
  password = str(data.get('password'))
  confirmPassword = str(data.get('confirmpassword'))
  email = str(data.get('email'))
  phoneNumber = str(data.get('phonenumber')).lower().strip()
  sexCode = str(data.get('sexcode')).lower().strip()

  if password != confirmPassword:
      return jsonify({"message": "Passwords Do Not Match!", "status": False}), 400

  query = f"SELECT firstName, surname from users where firstName = {firstName} and surname = {surname}"
  records = operate_database(query, SEARCH)

  if records:
    return jsonify({"message": "User Already Exists!", "status": False}), 400

  query = f'''INSERT INTO users (firstName, surname, password, email, phoneNumber, sexCode) VALUES 
  ('{firstName}', '{surname}', '{password}', '{email}', '{phoneNumber}', {sexCode});'''
  
  try:
    # 尝试插入新用户
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Insert Error, Wrong Input", "status": False}), 400  # 不确定500状态码是什么
  
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
  where table1.userID={userid} and DATE(table1.startTime)=\'{date}\'
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
  query3 = get_spec_appointments(userid, next_date)  # 后一天雪糕呢

  result1 = operate_database(query1, SEARCH)  # 当天
  result2 = operate_database(query2, SEARCH)  # 前一天雪糕呢
  result3 = operate_database(query3, SEARCH)  # 后一天

  result1, sum = proccess_result_for_ShowPanel(result1, 1)  # 当天 xuegaone 
  result2, _ = proccess_result_for_ShowPanel(result2, 0)  # 前一天
  result3, _ = proccess_result_for_ShowPanel(result3, 2)  # 后一天雪糕呢
  
  hours = sum // 60
  mins = sum % 60
  stat = f'''On {cur_date},
  I have {len(result1)} appointment(s) in total.
  My expected workload duration is {hours} hour(s) {mins} minute(s).'''
  
  total_result = result1 + result2 + result3
  return jsonify({"appointments": total_result, "description": stat}), 200


@app.route('/ShowPatientList', methods=['POST'])
def ShowPatientList():
  data = request.get_json()
  userid = str(data.get('userid').get('current'))

  query=f'''SELECT DISTINCT table2.firstname as firstname, table2.surname as surname, table1.patientID as patientID 
  FROM appointments as table1
  inner join patients as table2 on table2.patientID = table1.patientID
  where table1.userID={userid}'''

  result = operate_database(query, SEARCH)
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
  table5.appointmentStatusName as status, table2.firstName as userFirstName, table2.surname as userSurname, 
  table3.firstName as patientFirstName, table3.surname as patientSurname, table3.patientID as patientID,
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

  history = proccess_result_for_ShowPatientRecord(operate_database(query1, SEARCH))
  future = proccess_result_for_ShowPatientRecord(operate_database(query2, SEARCH))
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

  records = operate_database(query, SEARCH)
  return jsonify({'patientDetail': records}), 200


# GetAllAppointmentTypes
# 返回所有appointmentTypes类型
@app.route('/GetAllAppointmentTypes', methods=['POST'])
def getAllAppointmentTypes():
  query = '''SELECT * FROM appointmentTypes;'''
  records = operate_database(query, SEARCH)
  return jsonify({'appointmenttypes': records}), 200


# CreatePatient
# 往patients表中增加数据
@app.route('/CreatePatient', methods=['POST'])
def createPatient():
  data = request.get_json()
  firstname = str(data.get('firstname')).strip()
  surname = str(data.get('surname')).strip()
  medicareno = str(data.get('medicareno')).strip()
  email  = str(data.get('email')).strip()
  phonenumber = str(data.get('phonenumber')).strip()
  sexcode = data.get('sexcode')

  query = f'''
  SELECT patientid FROM patients
  WHERE LOWER(firstname) = LOWER('{firstname}') AND LOWER(surname) = LOWER('{surname}');
  '''
  records = operate_database(query, SEARCH)

  # 判断病人是否已经存在。
  if records:
    # 说明账户已经存在，报错
    return jsonify({"message": "Patient Already Exist!", "status": False}), 400

  # 将病人插入到数据库中
  query = f'''
  INSERT INTO patients (firstName, surname, medicareNo, email, phoneNumber, sexCode) VALUES
  ('{firstname}', '{surname}', '{medicareno}', '{email}', '{phonenumber}', {sexcode}),
  '''
  try:
    # 尝试插入新用户
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Insert Error, Wrong Input", "status": False}), 400 
  # 插入成功
  return jsonify({"message": f"New Patient {firstname} {surname} Added!", "status": True}), 200


# CreateAppointment
# 往appointments表中增加数据
@app.route('/CreateAppointment', methods=['POST'])
def createAppointment():
  data = request.get_json()
  appointmentdate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # 获得当前的时间
  duration  = int(data.get('duration'))
  starttime = str(data.get('starttime'))
  userid = str(data.get('userid'))
  # 根据病人的firstname和surname来获取patientid
  patientfirstname = str(data.get('patientfirstname')).strip().lower()
  patientsurname = str(data.get('patientsurname')).strip().lower()
  appointmenttypeid = int(data.get('appointmenttypeid'))
  locationid = int(data.get('locationid'))
  appointmenttatusid = 2 # 默认应该是booked，其id为2

  # 查询病人是否存在
  query = f'''
  SELECT patientid FROM patients
  WHERE LOWER(firstname) = LOWER('{patientfirstname}') AND LOWER(surname) = LOWER('{patientsurname}');
  '''
  records = operate_database(query, SEARCH)
  # 判断病人是否已经存在。
  if not records:
    # 说明账户不存在，报错
    return jsonify({"message": "Patient Does Not Exist, Please Create One!", "status": False}), 400

  patientid = int(records[0]['patientid'])  # 获取病人ID
  
  # 插入到 appointments中
  query = f'''
  INSERT INTO appointments (appointmentDate, duration, startTime, userID, patientID, appointmentTypeID, locationID, appointmentStatusID) VALUES
  ('{appointmentdate}', {duration}, '{starttime}', {userid}, {patientid}, {appointmenttypeid}, {locationid}, {appointmenttatusid});
  '''

  try:
    # 尝试插入新appointments
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Insert Error, Wrong Input", "status": False}), 400 
  # 插入成功
  return jsonify({"message": f"New Appointment Created!", "status": True}), 200


# EditAppointment
# 往appointment表中修改数据
@app.route('/EditAppointment', methods=['POST'])
def editAppointment():
  data = request.get_json()
  appointmentid = int(data.get('appointmentid'))  # 用来确认appointments
  # 可变的数据
  duration  = int(data.get('duration'))
  appointmenttypeid = int(data.get('appointmenttypeid'))
  locationid = int(data.get('locationid'))
  appointmenttatusid = int(data.get('appointmenttatusid'))

  query = f'''
  UPDATE appointments
  SET
    duration = {duration},
    appointmentTypeID = {appointmenttypeid},
    locationID = {locationid},
    appointmentStatusID = {appointmenttatusid}
  WHERE
    appointmentID = {appointmentid};
  '''

  try:
    # 尝试修改appointments
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Insert Error, Wrong Input", "status": False}), 400 
  # 修改成功
  return jsonify({"message": f"Appointment Updated!", "status": True}), 200


# DeleteAppointment
# 往appointment表中删除数据
@app.route('/DeleteAppointment', methods=['POST'])
def deleteAppointment():
  data = request.get_json()
  appointmentid = int(data.get('appointmentid'))  # 用来确认appointments

  query = f'''
  DELETE FROM appointments
  WHERE appointmentID = {appointmentid};
  '''

  try:
    # 尝试删除appointments
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Delete Error, No Such Apointment", "status": False}), 400 
  # 删除成功
  return jsonify({"message": f"Appointment Deleted!", "status": True}), 200


# DeletePatient
# 往patient表中删除数据
@app.route('/DeletePatient', methods=['POST'])
def deletePatient():
  data = request.get_json()
  # patientid  = int(data.get('patientid '))
  patientfirstname = str(data.get('patientfirstname'))
  patientsurname = str(data.get('patientsurname'))

  # 查询病人是否存在
  query = f'''
  SELECT patientid FROM patients
  WHERE LOWER(firstname) = LOWER('{patientfirstname}') AND LOWER(surname) = LOWER('{patientsurname}');
  '''
  records = operate_database(query, SEARCH)
  # 判断病人是否已经存在。
  if not records:
    # 说明账户不存在，报错
    return jsonify({"message": "Patient Does Not Exist!", "status": False}), 400

  patientid = int(records[0]['patientid'])  # 获取病人ID

  # 删除改病人
  query = f'''
  DELETE FROM patients
  WHERE patientid = {patientid};
  '''

  try:
    # 尝试删除
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Delete Error, No Such Patient", "status": False}), 400 
  # 删除成功
  return jsonify({"message": f"Patient Deleted!", "status": True}), 200


# DeleteUser
# 往user表中删除数据
@app.route('/DeleteUser', methods=['POST'])
def deleteUser():
  data = request.get_json()
  userid  = int(data.get('userid '))

  # 删除改病人
  query = f'''
  DELETE FROM users
  WHERE userid = {userid};
  '''

  try:
    # 尝试删除
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Delete Error, No Such User", "status": False}), 400 
  # 删除成功
  return jsonify({"message": f"User Deleted!", "status": True}), 200


if __name__ == '__main__':
    app.run(debug=True)

# http://127.0.0.1:5000/
# http://127.0.0.1:5000/apidocs