from flask import Flask, jsonify, request
from flasgger import Swagger
from flask_cors import CORS
from ConnectDatabase_v2 import operate_database, SEARCH, ADD_DELETE_UPDATE
from datetime import datetime, timedelta

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
  firstname = str(data.get('firstname')).strip()
  surname = str(data.get('surname')).strip()
  password = str(data.get('password'))
  locationid = data.get('locationid')

  # get the users result from database
  query = f'''
  SELECT surname, firstName, password, userID FROM users
  WHERE firstname ILIKE '{firstname}' AND surname ILIKE '{surname}' AND locationid = {locationid}
  '''
  records = operate_database(query, SEARCH)
  # check name and password
  if not records:
    return jsonify({"message": "User And Location Does Not Match!", "status": False}), 400

  if password != records[0]['password']:
    return jsonify({"message": "Wrong Password!", "status": False}), 400

  # login successful
  return jsonify({"message": "Login Successful!", "status": True, "userid":records[0]['userid']}), 200
  

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
  sexCode = int(data.get('sexcode'))
  locationid = int(data.get('location'))

  if password != confirmPassword:
      return jsonify({"message": "Passwords Do Not Match!", "status": False}), 400

  query = f"SELECT firstName, surname from users where LOWER(firstName) = '{firstName}' and LOWER(surname) = '{surname}'"
  records = operate_database(query, SEARCH)

  if records:
    return jsonify({"message": "User Already Exists!", "status": False}), 400

  query = f'''INSERT INTO users (firstName, surname, password, email, phoneNumber, sexCode, locationid) VALUES 
  ('{firstName}', '{surname}', '{password}', '{email}', '{phoneNumber}', {sexCode}, {locationid});'''
  
  try:
    # try insert users
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Insert Error, Wrong Input", "status": False}), 400 
  
  # insert defualt user settings
  query = f"SELECT userid from users where LOWER(firstName) = '{firstName}' and LOWER(surname) = '{surname}'"
  userid = operate_database(query, SEARCH)[0]['userid']
  query = f'''
  INSERT INTO settings (userID, timerange, breaktimerange) VALUES
    ({userid}, '6:00 18:00', '12:00 12:00');
  '''
  operate_database(query, ADD_DELETE_UPDATE)

  return jsonify({"message": "Registration successful!", "status": True}), 200


# get user's specific date appointments query
def get_spec_appointments(userid, date):
  return f'''
  SELECT table1.appointmentID, table1.appointmentDate, table1.duration as duration, 
  table1.startTime as startTime, table4.appointmentTypeName as appointmentType, 
  table5.appointmentStatusName as status, table2.firstName as firstName, table2.surname as surname, 
  table3.firstName as patientFirstName, table3.surname as patientSurname, table3.patientID as patientID,
  CASE
    WHEN table1.appointmentTypeID=29 and table3.patientID in (
    SELECT patientID FROM appointments
    WHERE locationID=1 and ('{date}' - starttime) >= interval '365 days'
  ) THEN 1
    ELSE 0
  END AS isPhone,
  CASE
    WHEN table3.medicareNo IS NULL THEN 0
    ELSE 1
  END AS hasMedicare,
	table1.note AS note,
  table6.locationName as locationname
  FROM appointments AS table1
  inner join users AS table2
  ON table1.userID = table2.userID
  inner join patients AS table3
  ON table3.patientID = table1.patientID
  inner join appointmentTypes AS table4
  ON table4.appointmentTypeID = table1.appointmentTypeID
  inner join appointmentStatus AS table5
  ON table5.appointmentStatusID = table1.appointmentStatusID
  inner join locations AS table6
  ON table6.locationID = table1.locationID
  WHERE table1.userID={userid} AND DATE(table1.startTime)='{date}'
  '''

# process result
def proccess_result_for_ShowPanel(result, dayType):
  sum = 0
  # convert second to readable time format
  for idx in result:
      sum += int(idx['duration'])
      startTime = idx['starttime']
      # 1. 从字符串中解析出datetime对象
      # startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
      # 2. 使用strftime方法格式化时间
      startTime = startTime.strftime('%H:%M %p')
      startTime = startTime.lower()  # 转换为小写，如am和pm
      idx['starttime'] = startTime

      idx['daytype'] = f"{dayType}"  # 表示前一天，当天，后一天
  return result, sum


# ShowAppt
# get user's specific date appointments
@app.route('/ShowPanel', methods=['POST'])
def ShowPanel():
  """
  This is the ShowPane endpoint
  Call this endpoint to show the panel
  ---
  tags:
    - ShowPanel API
  parameters:
    - name: userid
      in: formData
      type: string
      required: true
    - name: cur_date
      in: formData
      type: string
  responses:
    200:
      description: Found the total result
  """
  data = request.get_json()
  userid = str(data.get('userid'))
  cur_date = str(data.get('date')) 
  # get year-month-day
  date_obj = datetime.strptime(cur_date, "%Y-%m-%d")

  # get pre-day and next-day
  pre_date = date_obj - timedelta(days=1)
  next_date = date_obj + timedelta(days=1)

  pre_date = pre_date.strftime("%Y-%m-%d")
  next_date = next_date.strftime("%Y-%m-%d")

  # make query with id and date
  query1 = get_spec_appointments(userid, cur_date)  # current day
  query2 = get_spec_appointments(userid, pre_date)  # pre-day
  query3 = get_spec_appointments(userid, next_date)  # next-day

  result1 = operate_database(query1, SEARCH)  # current day
  result2 = operate_database(query2, SEARCH)  # pre-day
  result3 = operate_database(query3, SEARCH)  # next-day

  result1, sum = proccess_result_for_ShowPanel(result1, 1)  # current day 
  result2, _ = proccess_result_for_ShowPanel(result2, 0)  # pre-day
  result3, _ = proccess_result_for_ShowPanel(result3, 2)  # next-day
  
  hours = sum // 60
  mins = sum % 60
  stat = f'''On {cur_date},
  I have {len(result1)} appointment(s) in total.
  My expected workload duration is {hours} hour(s) {mins} minute(s).'''
  
  total_result = result1 + result2 + result3
  return jsonify({"appointments": total_result, "description": stat}), 200


# return user's patient
@app.route('/ShowPatientList', methods=['POST'])
def ShowPatientList():
  data = request.get_json()
  userid = str(data.get('userid'))
  query=f'''SELECT DISTINCT table2.firstname as firstname, table2.surname as surname, table1.patientID as patientID 
  FROM appointments as table1
  inner join patients as table2 on table2.patientID = table1.patientID
  where table1.userID={userid}'''

  result = operate_database(query, SEARCH)
  return jsonify({'patients':result}), 200


# ShowPatientRecord
# return patient record
@app.route('/ShowPatientRecord', methods=['POST'])
def ShowPatientRecord():
  data = request.get_json()
  userid = str(data.get('userid'))
  patientID = str(data.get('patientid'))
  base_query = '''
  SELECT table1.appointmentID, table1.duration as duration, 
  to_char(table1.startTime, 'YYYY-MM-DD HH24:MI') as startTime, table4.appointmentTypeName as appointmentType, 
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
    END AS hasMedicare,
  table1.note AS note
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
  query1 = base_query + f'''where table1.patientID = {patientID} and table1.userID = {userid} and table1.startTime < CURRENT_TIMESTAMP'''
  query2 = base_query + f'''where table1.patientID = {patientID} and table1.userID = {userid} and table1.startTime >= CURRENT_TIMESTAMP'''

  history = operate_database(query1, SEARCH)
  future = operate_database(query2, SEARCH)

  return jsonify({'history':history, 'future':future}), 200



# getAllPatient
# return all patient
@app.route('/GetAllPatient', methods=['POST'])
def getAllPatient():
  data = request.get_json()
  userid = str(data.get('userid').get('current').get('token'))

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
# return all appointmentTypes
@app.route('/GetAllAppointmentTypes', methods=['POST'])
def getAllAppointmentTypes():
  data = request.get_json()
  query = '''SELECT * FROM appointmentTypes;'''
  records = operate_database(query, SEARCH)
  return jsonify({'appointmenttypes': records}), 200


# CreatePatient
# insert new patient to patients table
@app.route('/CreatePatient', methods=['POST'])
def createPatient():
  data = request.get_json()
  firstname = str(data.get('firstname')).strip()
  surname = str(data.get('surname')).strip()
  medicareno = str(data.get('medicareno')).strip()
  email  = str(data.get('email')).strip()
  phonenumber = str(data.get('phonenumber')).strip()
  sexcode = str(data.get('sexcode'))


  query = f'''
  SELECT patientid FROM patients
  WHERE LOWER(firstname) = LOWER('{firstname}') AND LOWER(surname) = LOWER('{surname}');
  '''
  records = operate_database(query, SEARCH)

  # check if patient exist
  if records:
    return jsonify({"message": "Patient Already Exist!", "status": False}), 400

  # insert to patients table
  query = f'''
  INSERT INTO patients (firstName, surname, medicareNo, email, phoneNumber, sexCode) VALUES
  ('{firstname}', '{surname}', '{medicareno}', '{email}', '{phonenumber}', {sexcode});
  '''
  try:
    # try insert
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Insert Error, Wrong Input", "status": False}), 400 
  # insert success
  return jsonify({"message": f"New Patient {firstname} {surname} Added!", "status": True}), 200


# CreateAppointment
# insert data to appointments table
@app.route('/CreateAppointment', methods=['POST'])
def createAppointment():
  data = request.get_json()
  appointmentdate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
  duration  = int(data.get('duration'))
  starttime = str(data.get('starttime'))
  userid = str(data.get('userid'))
  patientfirstname = str(data.get('patientfirstname')).strip()
  patientsurname = str(data.get('patientsurname')).strip()
  appointmenttypeid = int(data.get('appointmenttypeid'))
  locationid = int(data.get('locationid'))
  appointmentstatusid = int(data.get('appointmentstatusid'))
  note = str(data.get('note'))

  # check if patient exist
  query = f'''
  SELECT patientid FROM patients
  WHERE LOWER(firstname) = LOWER('{patientfirstname}') AND LOWER(surname) = LOWER('{patientsurname}');
  '''
  records = operate_database(query, SEARCH)
  if not records:
    # if patient not exist
    return jsonify({"message": "Patient Does Not Exist, Please Create One!", "status": False}), 400

  patientid = int(records[0]['patientid'])
  
  # insert to appointments
  query = f'''
  INSERT INTO appointments (appointmentDate, duration, startTime, userID, patientID, appointmentTypeID, locationID, appointmentStatusID, note) VALUES
  ('{appointmentdate}', {duration}, '{starttime}', {userid}, {patientid}, {appointmenttypeid}, {locationid}, {appointmentstatusid}, '{note}');
  '''

  try:
    # try to insert appointments
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Insert Error, Wrong Input", "status": False}), 400 
  # insert success
  return jsonify({"message": f"New Appointment Created!", "status": True}), 200


# EditAppointment
# edit appointment table
@app.route('/EditAppointment', methods=['POST'])
def editAppointment():
  data = request.get_json()
  appointmentid = int(data.get('appointmentid')) 
  duration  = int(data.get('duration'))
  appointmenttypeid = int(data.get('appointmenttypeid'))
  locationid = int(data.get('locationid'))
  appointmentstatusid = int(data.get('appointmentstatusid'))
  note = str(data.get('note'))

  query = f'''
  UPDATE appointments
  SET
    duration = {duration},
    appointmentTypeID = {appointmenttypeid},
    locationID = {locationid},
    appointmentStatusID = {appointmentstatusid},
    note = '{note}'
  WHERE
    appointmentID = {appointmentid};
  '''

  try:
    # try edit appointments
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Insert Error, Wrong Input", "status": False}), 400 
  # success
  return jsonify({"message": f"Appointment Updated!", "status": True}), 200


# DeleteAppointment
# delete data from appointment
@app.route('/DeleteAppointment', methods=['POST'])
def deleteAppointment():
  data = request.get_json()
  appointmentid = int(data.get('appointmentid')) 

  query = f'''
  DELETE FROM appointments
  WHERE appointmentID = {appointmentid};
  '''

  try:
    # try delete appointments
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Delete Error, No Such Apointment", "status": False}), 400 
  # delete success
  return jsonify({"message": f"Appointment Deleted!", "status": True}), 200


# DeletePatient
# delete data from patient table
@app.route('/DeletePatient', methods=['POST'])
def deletePatient():
  data = request.get_json()
  patientfirstname = str(data.get('patientfirstname'))
  patientsurname = str(data.get('patientsurname'))

  # check patient existence
  query = f'''
  SELECT patientid FROM patients
  WHERE LOWER(firstname) = LOWER('{patientfirstname}') AND LOWER(surname) = LOWER('{patientsurname}');
  '''
  records = operate_database(query, SEARCH)
  if not records:
    # patient not exist
    return jsonify({"message": "Patient Does Not Exist!", "status": False}), 400

  patientid = int(records[0]['patientid'])  # get patient id

  # delete data from patient query
  query = f'''
  DELETE FROM patients
  WHERE patientid = {patientid};
  '''

  try:
    # try delete
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Delete Error, No Such Patient", "status": False}), 400 
  # delete success
  return jsonify({"message": f"Patient Deleted!", "status": True}), 200


# DeleteUser
# delete data from users
@app.route('/DeleteUser', methods=['POST'])
def deleteUser():
  data = request.get_json()
  userid  = int(data.get('userid '))

  # delete users
  query = f'''
  DELETE FROM users
  WHERE userid = {userid};
  '''

  try:
    # try 
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Delete Error, No Such User", "status": False}), 400 
  # success
  return jsonify({"message": f"User Deleted!", "status": True}), 200


# GetAppointment
# get appointment
@app.route('/GetAppointment', methods=['POST'])
def getAppointment():
  data = request.get_json()
  appointmentid = int(data.get('appointmentid'))  # 用来确认appointments

  query = f'''
  SELECT table1.appointmentID, to_char(table1.appointmentdate, 'YYYY-MM-DD HH24:MI:SS') as appointmentdate, table1.duration as duration, 
  to_char(table1.startTime, 'YYYY-MM-DD HH24:MI:SS') as startTime, table4.appointmentTypeName as appointmentType, 
  table5.appointmentStatusName as status, table2.firstName as userFirstName, table2.surname as userSurname, 
  table3.firstName as patientFirstName, table3.surname as patientSurname,
  table1.locationid as locationid, table1.note as note, table1.appointmentTypeID as appointmenttypeid
  FROM appointments as table1
  inner join users as table2
  ON table1.userID = table2.userID
  inner join patients as table3
  ON table3.patientID = table1.patientID
  inner join appointmentTypes as table4
  ON table4.appointmentTypeID = table1.appointmentTypeID
  inner join appointmentStatus as table5
  ON table5.appointmentStatusID = table1.appointmentStatusID 
  where table1.appointmentid = {appointmentid}
  '''
  try:
    # try
    records = operate_database(query, SEARCH)
  except Exception as _:
    return jsonify({"message": f"Search Error, No Such Appointment", "status": False}), 400 
  # success
  return jsonify({"appointment": records, "status": True}), 200


# GetAllUsers
# get all users
@app.route('/GetAllUsers', methods=['POST'])
def getAllUsers():
  query = '''
  SELECT * FROM users;
  '''
  records = operate_database(query, SEARCH)
  return jsonify({"allUsers": records, "status": True}), 200


# GetAllLocation 
# get all location
@app.route('/GetAllLocation', methods=['POST'])
def getAllLocation():
  query = '''
  SELECT * FROM locations;
  '''
  records = operate_database(query, SEARCH)
  return jsonify({"allLocation": records, "status": True}), 200


# GetSpecRangeStatusStatistics
# return [predate, lastdate] time range, current userid's all appointments different status num. 
@app.route('/GetSpecRangeStatusStatistics', methods=['POST'])
def getSpecRangeStatusStatistics():
  data = request.get_json()

  predate = str(data.get('predate'))  
  lastdate = str(data.get('lastdate')) 
  userids = data.get('userid')  # userid

  query = '''select appointmentstatusname from appointmentstatus'''  # get all status
  records = operate_database(query, SEARCH)
  
  return_records = []
  # got through all status
  for record in records:
    value = 0
    appointmentstatusname = ''
    # get sum
    for userid in userids:
      appointmentstatusname = record['appointmentstatusname']
      query = f'''
      SELECT COUNT(*) AS val
      FROM appointments as table1
      INNER JOIN appointmentStatus as table5
      ON table5.appointmentStatusID = table1.appointmentStatusID 
      WHERE table5.appointmentStatusName = '{appointmentstatusname}' AND userid = {userid['id']} 
      AND DATE(starttime) >= '{predate}' AND DATE(starttime) <= '{lastdate}'
      '''
      value += operate_database(query, SEARCH)[0]['val']
    if(appointmentstatusname):
      return_records.append({"status": appointmentstatusname, "value": value})

  return jsonify({"statusStatistics": return_records, "status": True}), 200


# GetSpecRangeAppNumStatistics
# during time range, current userid, num of appointments for each day
@app.route('/GetSpecRangeAppNumStatistics', methods=['POST'])
def getSpecRangeAppNumStatistics():
  data = request.get_json()
  predate = str(data.get('predate')) 
  lastdate = str(data.get('lastdate'))
  userids = data.get('userid')  # userid

  predate = datetime.strptime(predate, "%Y-%m-%d")
  lastdate = datetime.strptime(lastdate, "%Y-%m-%d")

  # used to store date of each days
  date_strings = []

  # get dates
  current_date = predate
  while current_date <= lastdate:
      date_strings.append(current_date.strftime("%Y-%m-%d"))
      current_date += timedelta(days=1)

  records = []  # used to store result
  # go through each date
  for date in date_strings:
    value = 0
    for userid in userids:
      query = f'''
      SELECT COUNT(*) as val
      FROM appointments
      WHERE userid = {userid['id']} AND DATE(starttime) = '{date}' 
      '''
      value += operate_database(query, SEARCH)[0]['val']
    records.append({"date": date, "value": value})

  return jsonify({"appNumStatistics": records, "status": True}), 200


# JudgePatient
# check if patient exist
@app.route('/JudgePatient', methods=['POST'])
def judgePatient():
  data = request.get_json()
  patientfirstname = str(data.get('patientfirstname'))
  patientsurname = str(data.get('patientsurname'))

  # check patient
  query = f'''
  SELECT patientid FROM patients
  WHERE LOWER(firstname) = LOWER('{patientfirstname}') AND LOWER(surname) = LOWER('{patientsurname}');
  '''
  records = operate_database(query, SEARCH)

  if records:
    return jsonify({"message": "Patient Exist!", "status": True}), 200  # 存在
  else:
    return jsonify({"message": "Patient Does Not Exist!", "status": False }), 200  # 不存在


# EditSettings
@app.route('/EditSettings', methods=['POST'])
def editSettings ():
  data = request.get_json()
  userid = int(data.get('userid'))
  timerange = str(data.get('timerange'))
  breaktimerange = str(data.get('breaktimerange'))

  query = f'''
  UPDATE settings
  SET
    timerange = '{timerange}',
    breaktimerange = '{breaktimerange}'
  WHERE
    userID = {userid};
  '''
  try:
    # try
    operate_database(query, ADD_DELETE_UPDATE)
  except Exception as _:
    return jsonify({"message": f"Edit Error, Please check userid", "status": False}), 400 
  # OK
  return jsonify({"message": f"Setting Changed!", "status": True}), 200


# GetSettings
# get settings of userid
@app.route('/GetSettings', methods=['POST'])
def getSettings ():
  data = request.get_json()
  userid = int(data.get('userid'))
  query = f'''
  SELECT * FROM settings WHERE userid = {userid}
  '''

  records = operate_database(query, SEARCH)
  return jsonify({"settings": records, "status": True}), 200


if __name__ == '__main__':
    app.run(debug=True)

# http://127.0.0.1:5000/
# http://127.0.0.1:5000/apidocs