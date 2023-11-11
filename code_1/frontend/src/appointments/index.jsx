import React, { useEffect, useRef } from 'react';
import { Table, Space, Button, Modal, DatePicker, Popover, notification, Typography, Select } from 'antd';
import "./index.css"
import { useState } from 'react';
import dayjs from 'dayjs';
import {
  useNavigate
} from 'react-router-dom';
// import moment from "moment"

const allState = ['gray', 'yellow', 'magenta', 'gold', 'lightgreen', 'lightgray', 'lightblue']
const getIndex = ['Unavailable', 'Booked', 'Waiting', 'Urgent', 'With doctor', 'At billing', 'Completed']
// const defaultDate = "2023-11-01"

let dataA = [];
function formatTime(time) {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const period = hours >= 12 ? 'pm' : 'am';
  // 处理小时和分钟的零填充
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes} ${period}`;
}
const time_ = [545, 600, 615, 630, 645, 700, 715, 730, 745, 800, 815, 830, 845, 900, 915, 930, 945, 1000, 1015, 1030, 1045, 1100, 1115, 1130, 1145, 1200,
1215, 1230, 1245, 1300, 1315, 1330, 1345, 1400, 1415, 1430, 1445, 1500, 1515, 1530, 1545, 1600, 1615, 1630, 1645,
1700, 1715, 1730, 1745, 1800]
for (let i=0; i<time_.length; i++) {
  dataA.push({
    key: time_[i].toString().padStart(4, '0'),
    time: formatTime(time_[i]),
    isBreak: false,
    before: '',
    beforeState: '',
    beforeType: '',
    beforeNote: '',
    beforeLocationName: '',
    bHasMedicare: 1,
    bIsPhone: 0,
    bRecordID: 0,
    date: '',
    dateState: '',
    dateType: '',
    dateNote: '',
    dateLocationName: '',
    dHasMedicare: 1,
    dIsPhone: 0,
    dRecordID: 0,
    after: '',
    afterState: '',
    afterType: '',
    afterNote: '',
    afterLocationName: '',
    aHasMedicare: 1,
    aIsPhone: 0,
    aRecordID: 0,
  });
}

function transformTime(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);

  // 将小时和分钟合并为一个数字
  const timeInNumber = hours * 100 + minutes;
  return timeInNumber
}

function App ({ token, onRecord, defaultDate }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [date, setDate] = useState(defaultDate);
  const [appointments, setAppointments] = useState([]);
  const [dataQ, setDataQ] = useState(dataA);
  const [description, setDescription] = useState("");
  const [jModal, setJModal] = useState("");
  const [upDelete, setUpDelete] = useState("");
  const [doctorID, setDoctorID] = useState(0);
  const [allUsersName, setAllUsersName] = useState([]);
  const [isSelect, setIsSelect] = useState('none')
  const [rangeStartTime, setRangeStartTime] = useState('')
  const [rangeEndTime, setRangeEndTime] = useState('')
  const [breakStartTime, setBreakStartTime] = useState('')
  const [breakEndTime, setBreakEndTime] = useState('')
  const prevDataQRef = useRef(dataQ);
  // const [locationName, setLocationName] = useState("");
  const navigate = useNavigate();

  const columns = [
    {
      title: <div className='fillCellTitle'>Time</div>,
      dataIndex: 'time',
      key: 'time',
      width:100,
      align: 'center',
    },
    {
      title: <div className='fillCellTitle'>{getDate(date, -1)}</div>,
      dataIndex: 'before',
      key: 'before',
      align: 'center',
      render: (text, record) => {
        if (record.beforeState !== "") {
          return <div className='fillCell' style={{backgroundColor: allState[getIndex.indexOf(record.beforeState)]}}
          onClick={() =>{ handleCellClick(record);setJModal('0') }}>{text} -{record.beforeNote}</div>;
        } else {
          return <Button onClick={() => {onCreate(record.bRecordID, getDate(date, -1), record.time)}} shape="default" style={{position:"absolute",top:0,bottom:0,left:0,right:0, 
          display:"flex", height: "100%", width:"100%", borderRadius: "0", backgroundColor: record.isBreak ? 'gray' : ''}}></Button>;
        }
      },
    },
    {
      title: <div className='fillCellTitle'>{getDate(date, 0)}</div>,
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      render: (text, record) => {
        if (record.dateState !== "") {
          return <div  className='fillCell' style={{backgroundColor: allState[getIndex.indexOf(record.dateState)]}}
          onClick={() =>{ handleCellClick(record);setJModal('1') }}>{text} -{record.dateNote}</div>;
        } else {
          return <Button onClick={() => {onCreate(record.dRecordID, getDate(date, 0), record.time)}} shape="default" style={{position:"absolute",top:0,bottom:0,left:0,right:0, 
          display:"flex", height: "100%", width:"100%", borderRadius: "0", backgroundColor: record.isBreak ? 'gray' : ''}}></Button>;
        }
      },
    },
    {
      title: <div className='fillCellTitle'>{getDate(date, 1)}</div>,
      key: 'after',
      dataIndex: 'after',
      align: 'center',
      render: (text, record) => {
        if (record.afterState !== "") {
          return <div  className='fillCell' style={{backgroundColor: allState[getIndex.indexOf(record.afterState)]}}
          onClick={() =>{ handleCellClick(record);setJModal('2') }}>{text} -{record.afterNote}</div>;
        } else {
          return <Button onClick={() => {onCreate(record.aRecordID, getDate(date, 1), record.time)}} shape="default" style={{position:"absolute",top:0,bottom:0,left:0,right:0, 
          display:"flex", height: "100%", width:"100%", borderRadius: "0", backgroundColor: record.isBreak ? 'gray' : ''}}></Button>;
        }
      },
    },
  ];

  function getDate(day, e) {
    const startDateString = day;
    // 将字符串转换为日期对象
    const startDate = new Date(startDateString);
    // 增加e天
    startDate.setDate(startDate.getDate() + e);
    // 将结果转换回字符串
    const endDateString = startDate.toISOString().split('T')[0];
    const dateObject = new Date(endDateString);
    const dayOfWeek = dateObject.getDay();
    // 将数字转换为星期几的文字
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[dayOfWeek];
    return `${endDateString} ${dayName}`
  }

  const content1 = (
    <div>
      <p>There are seven types of appointments' state.</p>
    </div>
  );
  const content2 = (
    <div>
      <p>Plan your work reasonably and enjoy a happy life!</p>
    </div>
  );
  
  const handleCellClick = (record) => {
    // 设置选中的记录，打开对话框
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    // 清空选中的记录，关闭对话框
    setSelectedRecord(null);
    setModalVisible(false);
  };

  function onDateChange (e, dateString) {
    if (dateString !== date) {
      setDate(dateString);
    }
  };

  function onEdit (e) {
    navigate('/mainpage/edit');
    console.log("edit route: ", e);
    onRecord(e)
  }

  function onCreate (e, rSD, rST) {
    navigate(`/mainpage/create/${rSD}/${rST}`);
    console.log("edit route: ", e);
    onRecord(e)
  }

  async function fDelete (e) {
    const response = await fetch('http://127.0.0.1:5000/DeleteAppointment', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        "appointmentid": e,
      })
    });
    const data = await response.json();
    if (data.status) {
      notification.open({
        message: 'Success',
        type: 'success',
        description:
          `${data.message}`,
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });

      console.log("sssdelete: ", e)
      setUpDelete(e)
    } else {
      notification.open({
        message: 'Error',
        type: 'error',
        description:
        // error message
          `${data.message}`,
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    }
  }

  useEffect(() => {
    const temp = dataA.map(item => ({ ...item }));
    for (let i=0; i < appointments.length; i++ ) {
      for (let j=0; j < dataA.length; j++ ) {
        if (temp[j].date !== "" ) {
          temp[j].date = "";
        }
        if (temp[j].before !== "" ) {
          temp[j].before = "";
        }
        if (temp[j].after !== "" ) {
          temp[j].after = "";
        }
      }
    }
    let count_ = 0;
    let judge_ = 0;
    for (let i=0; i < appointments.length; i++ ) {
      for (let j=0; j < dataA.length; j++ ) {
        if (temp[j].time === appointments[i].startTime ) {
          if (appointments[i].day === "1") {
            temp[j].date = appointments[i].patientName
            temp[j].dateState = appointments[i].state
            temp[j].dateType = appointments[i].type
            temp[j].dateNote = appointments[i].note
            temp[j].dateLocationName = appointments[i].locationName
            temp[j].dIsPhone = appointments[i].isPhone
            temp[j].dHasMedicare = appointments[i].hasMedicare
            temp[j].dRecordID = appointments[i].recordID
          } else if (appointments[i].day === "0") {
            temp[j].before = appointments[i].patientName
            temp[j].beforeState = appointments[i].state
            temp[j].beforeType = appointments[i].type
            temp[j].beforeNote = appointments[i].note
            temp[j].beforeLocationName = appointments[i].locationName
            temp[j].bIsPhone = appointments[i].isPhone
            temp[j].bHasMedicare = appointments[i].hasMedicare
            temp[j].bRecordID = appointments[i].recordID
          } else {
            temp[j].after = appointments[i].patientName
            temp[j].afterState = appointments[i].state
            temp[j].afterType = appointments[i].type
            temp[j].afterNote = appointments[i].note
            temp[j].afterLocationName = appointments[i].locationName
            temp[j].aIsPhone = appointments[i].isPhone
            temp[j].aHasMedicare = appointments[i].hasMedicare
            temp[j].aRecordID = appointments[i].recordID
          }
          count_ = Math.ceil(appointments[i].duration/15)
          judge_ = i;
        }
        if (count_ !== 0) {
          if (appointments[i].day === "1") {
            temp[j].date = appointments[judge_].patientName
            temp[j].dateState = appointments[judge_].state
            temp[j].dateType = appointments[judge_].type
            temp[j].dateNote = appointments[i].note
            temp[j].dateLocationName = appointments[i].locationName
            temp[j].dIsPhone = appointments[i].isPhone
            temp[j].dHasMedicare = appointments[i].hasMedicare
            temp[j].dRecordID = appointments[i].recordID
          } else if (appointments[i].day === "0") {
            temp[j].before = appointments[judge_].patientName
            temp[j].beforeState = appointments[judge_].state
            temp[j].beforeType = appointments[judge_].type
            temp[j].beforeNote = appointments[i].note
            temp[j].beforeLocationName = appointments[i].locationName
            temp[j].bIsPhone = appointments[i].isPhone
            temp[j].bHasMedicare = appointments[i].hasMedicare
            temp[j].bRecordID = appointments[i].recordID
          } else {
            temp[j].after = appointments[judge_].patientName
            temp[j].afterState = appointments[judge_].state
            temp[j].afterType = appointments[judge_].type
            temp[j].afterNote = appointments[i].note
            temp[j].afterLocationName = appointments[i].locationName
            temp[j].aIsPhone = appointments[i].isPhone
            temp[j].aHasMedicare = appointments[i].hasMedicare
            temp[j].aRecordID = appointments[i].recordID
          }
          count_--;
        }
      }
    }
    setDataQ(temp)
  }, [appointments, date, upDelete]);

  useEffect(() => {
    async function fDate (e) {
      const response = await fetch('http://127.0.0.1:5000/ShowPanel', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "userid": e,
          "date": date,
        })
      });
      const data = await response.json();
      const appointments_ = data.appointments.map(appointment => {
        return {
          patientName: `${appointment.patientfirstname} ${appointment.patientsurname}`,
          startTime: appointment.starttime,
          duration: appointment.duration,
          state: appointment.status,
          day: appointment.daytype,
          type: appointment.appointmenttype,
          note: appointment.note,
          isPhone: appointment.isphone,
          hasMedicare: appointment.hasmedicare,
          surname: appointment.surname,
          firstName: appointment.firstname,
          recordID: appointment.appointmentid,
          locationName: appointment.locationname
        };
      });
      setDescription(data.description);
      setAppointments(appointments_);
      handleModalClose();
      console.log("showPanel: ", date, token, appointments_);
    };
    if (token === '0') {
      fDate(doctorID);
    } else {
      fDate(token)
    }
  }, [date, token, upDelete, doctorID]);


  useEffect(() => {
    if (token === '0') {
      setIsSelect('flex')
    }
    async function fGetAllUsers() {
      const response = await fetch('http://127.0.0.1:5000/GetAllUsers', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();
      const temp = data.allUsers.map(item => {
        return {
          value: item.userid,
          label: `${item.firstname} ${item.surname}`,
        }
      }).filter(item => item.label!== 'administrator ')
      temp.sort(function(a, b) {
        const valueA = a.label.toLowerCase();
        const valueB = b.label.toLowerCase();
        return valueA.localeCompare(valueB);
      });
      console.log(temp)
      setAllUsersName(temp)
    }
    fGetAllUsers()
  }, [token])

  useEffect(() => {
    async function fGetSettings() {
      const response = await fetch('http://127.0.0.1:5000/GetSettings', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "userid": token,
        })
      });
      const data = await response.json();
      const temp = data.settings.map(item => {
        return {
          rangeStartTime: transformTime(item.timerange.split(' ')[0]),
          rangeEndTime: transformTime(item.timerange.split(' ')[1]),
          breakStartTime: transformTime(item.breaktimerange.split(' ')[0]),
          breakEndTime: transformTime(item.breaktimerange.split(' ')[1]),
        }
      })
      console.log("xxx", temp)
      setRangeEndTime(temp[0].rangeEndTime)
      setRangeStartTime(temp[0].rangeStartTime)
      setBreakStartTime(temp[0].breakStartTime)
      setBreakEndTime(temp[0].breakEndTime)
    }
    fGetSettings()
  }, [token])

  useEffect(() => {
    // 判断当前 dataQ 和前一个 dataQ 是否相同，如果相同则不执行
    if (prevDataQRef.current !== dataQ) {
      const temp = dataQ.map(item => {
        const itemTime = transformTime(item.time.split(' ')[0]);
        if (itemTime >= breakStartTime && itemTime <= breakEndTime) {
          return {
            ...item,
            isBreak: true,
          };
        } else {
          return item;
        }
      }).filter(item => {
        const itemTime = transformTime(item.time.split(' ')[0]);
        return itemTime >= rangeStartTime && itemTime <= rangeEndTime;
      });
      console.log("temp", dataA, temp);
      setDataQ(temp);
      
      // 更新 prevDataQRef 的值
      prevDataQRef.current = temp;
    }
  }, [rangeStartTime, rangeEndTime, breakEndTime, breakStartTime, dataQ]); // 添加 dataQ 到依赖数组

  return (
    <div>
      <Space direction="vertical">
        <Space>
          <div style={{fontWeight: 'bold'}}>Choose a date: </div>
          <DatePicker onChange={onDateChange} defaultValue={dayjs(defaultDate)} allowClear={false}/>
          <div style={{display: isSelect, alignItems:'center'}}>
            <div style={{fontWeight: 'bold', marginLeft: 30}}>Choose a doctor: </div>
            <Select style={{width: 195, marginLeft:10}}onChange={(e) => setDoctorID(e)} placeholder="Select doctor" options={allUsersName}/>
          </div>
        </Space>
        <Space>
          <Space direction="vertical">
            <Space>
              <Popover content={content1} title="Details">
                <div style={{fontWeight: 'bold'}}>Status: </div>
              </Popover>
              <div className='appointmentsBox'style={{backgroundColor:'gray'}}>Unavailable</div>
              <div className='appointmentsBox'style={{backgroundColor:'yellow'}}>Booked</div>
              <div className='appointmentsBox'style={{backgroundColor:'magenta'}}>Waiting</div>
              <div className='appointmentsBox'style={{backgroundColor:'gold'}}>Urgent</div>
              <div className='appointmentsBox'style={{backgroundColor:'lightgreen'}}>With doctor</div>
              <div className='appointmentsBox'style={{backgroundColor:'lightgray'}}>At billing</div>
              <div className='appointmentsBox'style={{backgroundColor:'lightblue'}}>Completed</div>
              
            </Space>
          </Space>
        </Space>
        <Space>
          <div style={{fontWeight: 'bold'}}>Workload: </div>
          <Popover placement="topLeft" content={content2} title="Details">
            <Typography.Text level={5} style={{width: "800px"}}>{description}</Typography.Text>
          </Popover>
        </Space>
        <Table columns={columns} dataSource={dataQ} pagination={false} bordered scroll={{y:380}} size="small"
         onHeaderRow={() => ({
          height: 40,
        })}
        rowClassName={(record) => (record.isBreak ? 'disabled-row' : '')}/>
      </Space>
      <Modal
        title={'Details'}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Space>
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>
          </Space>
        ]}
      >
        {selectedRecord && (
          <div>
            {jModal === '0' && (
              <div>
                {
                  selectedRecord.bHasMedicare === 0 && (
                    <div>
                      <p style={{backgroundColor: "orange"}}>Patient name: {selectedRecord.before}</p>
                    </div>
                  )
                }
                {
                  selectedRecord.bHasMedicare === 1 && (
                    <div>
                      <p>Patient name: {selectedRecord.before}</p>
                    </div>
                  )
                }
                {
                  selectedRecord.bIsPhone === 1 && (
                    <div>
                      <p style={{backgroundColor: "orange"}}>Appointment type: {selectedRecord.beforeType}</p>
                    </div>
                  )
                }
                {
                  selectedRecord.bIsPhone === 0 && (
                    <div>
                      <p>Appointment type: {selectedRecord.beforeType}</p>
                    </div>
                  )
                }
                <p>Note: {selectedRecord.beforeNote}</p>
                <p>Location: {selectedRecord.beforeLocationName}</p>
                <Space>
                  <Button onClick={() => onEdit(selectedRecord.bRecordID)}>
                    Edit
                  </Button>
                  <Button onClick={() => fDelete(selectedRecord.bRecordID, '0')}>
                    Delete
                  </Button>
                </Space>
              </div>
            )}
            {jModal === '1' && (
              <div>
                {
                  selectedRecord.dHasMedicare === 0 && (
                    <div>
                      <p style={{backgroundColor: "orange"}}>Patient name: {selectedRecord.date}</p>
                    </div>
                  )
                }
                {
                  selectedRecord.dHasMedicare === 1 && (
                    <div>
                      <p>Patient name: {selectedRecord.date}</p>
                    </div>
                  )
                }
                {
                  selectedRecord.dIsPhone === 1 && (
                    <div>
                      <p style={{backgroundColor: "orange"}}>Appointment type: {selectedRecord.dateType}</p>
                    </div>
                  )
                }
                {
                  selectedRecord.dIsPhone === 0 && (
                    <div>
                      <p>Appointment type: {selectedRecord.dateType}</p>
                    </div>
                  )
                }
                <p>Note: {selectedRecord.dateNote}</p>
                <p>Location: {selectedRecord.dateLocationName}</p>
                <Space>
                  <Button onClick={() => onEdit(selectedRecord.dRecordID)}>
                    Edit
                  </Button>
                  <Button onClick={() => fDelete(selectedRecord.dRecordID, '1')}>
                    Delete
                  </Button>
                </Space>
                
              </div>
            )}
            {jModal === '2' && (
              <div>
                {
                  selectedRecord.aHasMedicare === 0 && (
                    <div>
                      <p style={{backgroundColor: "orange"}}>Patient name: {selectedRecord.after}</p>
                    </div>
                  )
                }
                {
                  selectedRecord.aHasMedicare === 1 && (
                    <div>
                      <p>Patient name: {selectedRecord.after}</p>
                    </div>
                  )
                }
                {
                  selectedRecord.aIsPhone === 1 && (
                    <div>
                      <p style={{backgroundColor: "orange"}}>Appointment type: {selectedRecord.afterType}</p>
                    </div>
                  )
                }
                {
                  selectedRecord.aIsPhone === 0 && (
                    <div>
                      <p>Appointment type: {selectedRecord.afterType}</p>
                    </div>
                  )
                }
                <p>Note: {selectedRecord.afterNote}</p>
                <p>Location: {selectedRecord.afterLocationName}</p>
                <Space>
                  <Button onClick={() => onEdit(selectedRecord.aRecordID)}>
                    Edit
                  </Button>
                  <Button onClick={() => fDelete(selectedRecord.aRecordID, '2')}>
                    Delete
                  </Button>
                </Space>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div> 
  );
};
export default App;