import React, { useEffect } from 'react';
import { Table, Space, Button, Modal, DatePicker, Popover, notification } from 'antd';
import "./index.css"
import { useState } from 'react';
import dayjs from 'dayjs';
import {
  useNavigate
} from 'react-router-dom';
// import moment from "moment"

const widthButton = "80px"
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
    before: '',
    beforeState: '',
    beforeType: '',
    beforeNote: '',
    bHasMedicare: 1,
    bIsPhone: 0,
    bRecordID: 0,
    date: '',
    dateState: '',
    dateType: '',
    dateNote: '',
    dHasMedicare: 1,
    dIsPhone: 0,
    dRecordID: 0,
    after: '',
    afterState: '',
    afterType: '',
    afterNote: '',
    aHasMedicare: 1,
    aIsPhone: 0,
    aRecordID: 0,
  });
}



function App ({ token, onRecord, defaultDate }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [date, setDate] = useState(defaultDate);
  const [appointments, setAppointments] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [dataQ, setDataQ] = useState(dataA);
  const [description, setDescription] = useState("");
  const [jModal, setJModal] = useState("");
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width:100,
      align: 'center',
    },
    {
      title: 'The day before',
      dataIndex: 'before',
      key: 'before',
      align: 'center',
      render: (text, record) => {
        if (record.beforeState !== "") {
          return <div style={{position:"absolute",top:0,bottom:0,left:0,right:0,
          backgroundColor: allState[getIndex.indexOf(record.beforeState)],display:"flex",justifyContent:"center",alignItems:"center"}}
          onClick={() =>{ handleCellClick(record);setJModal('0') }}>{text} -{record.beforeNote}</div>;
        } else {
          return <div onClick={onCreate(`${date} ${record.time}`)}></div>;
        }
      },
    },
    {
      title: 'The chosen Date',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      render: (text, record) => {
        if (record.dateState !== "") {
          return <div style={{position:"absolute",top:0,bottom:0,left:0,right:0,
          backgroundColor: allState[getIndex.indexOf(record.dateState)],display:"flex",justifyContent:"center",alignItems:"center"}}
          onClick={() =>{ handleCellClick(record);setJModal('1') }}>{text} -{record.dateNote}</div>;
        } else {
          return <div onClick={onCreate(`${date} ${record.time}`)}></div>;
        }
      },
    },
    {
      title: 'The day after',
      key: 'after',
      dataIndex: 'after',
      align: 'center',
      render: (text, record) => {
        if (record.afterState !== "") {
          return <div style={{position:"absolute",top:0,bottom:0,left:0,right:0,
          backgroundColor: allState[getIndex.indexOf(record.afterState)],display:"flex",justifyContent:"center",alignItems:"center"}}
          onClick={() =>{ handleCellClick(record);setJModal('2') }}>{text} -{record.afterNote}</div>;
        } else {
          return <div onClick={onCreate(`${date} ${record.time}`)}></div>;
        }
      },
    },
  ];

  const content1 = (
    <div>
      <p>There are nine types of appointments' state.</p>
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

  function onCreate (e) {
    navigate('/mainpage/create');
    console.log("create route: ", e);
    onRecord(e)
  }

  async function fDelete (e) {
    const response = await fetch('http://127.0.0.1:5000/Delete', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        "appointmentID": e,
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
            temp[j].dIsPhone = appointments[i].isPhone
            temp[j].dHasMedicare = appointments[i].hasMedicare
            temp[j].dRecordID = appointments[i].recordID
          } else if (appointments[i].day === "0") {
            temp[j].before = appointments[i].patientName
            temp[j].beforeState = appointments[i].state
            temp[j].beforeType = appointments[i].type
            temp[j].beforeNote = appointments[i].note
            temp[j].bIsPhone = appointments[i].isPhone
            temp[j].bHasMedicare = appointments[i].hasMedicare
            temp[j].bRecordID = appointments[i].recordID
          } else {
            temp[j].after = appointments[i].patientName
            temp[j].afterState = appointments[i].state
            temp[j].afterType = appointments[i].type
            temp[j].afterNote = appointments[i].note
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
            temp[j].dIsPhone = appointments[i].isPhone
            temp[j].dHasMedicare = appointments[i].hasMedicare
            temp[j].dRecordID = appointments[i].recordID
          } else if (appointments[i].day === "0") {
            temp[j].before = appointments[judge_].patientName
            temp[j].beforeState = appointments[judge_].state
            temp[j].beforeType = appointments[judge_].type
            temp[j].beforeNote = appointments[i].note
            temp[j].bIsPhone = appointments[i].isPhone
            temp[j].bHasMedicare = appointments[i].hasMedicare
            temp[j].bRecordID = appointments[i].recordID
          } else {
            temp[j].after = appointments[judge_].patientName
            temp[j].afterState = appointments[judge_].state
            temp[j].afterType = appointments[judge_].type
            temp[j].afterNote = appointments[i].note
            temp[j].aIsPhone = appointments[i].isPhone
            temp[j].aHasMedicare = appointments[i].hasMedicare
            temp[j].aRecordID = appointments[i].recordID
          }
          count_--;
        }
      }
    }
    setDataQ(temp)
  }, [appointments, date]);

  useEffect(() => {
    if (isInitialized) {
      async function fDate () {
        const response = await fetch('http://127.0.0.1:5000/ShowPanel', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            "userid": token,
            "date": date,
          })
        });
      const data = await response.json();
      const appointments_ = data.appointments.map(appointment => {
        return {
          patientName: appointment.patientname,
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
        };
      });
      setDescription(data.description);
      setAppointments(appointments_);
      console.log("showPanel: ", date, token, appointments_);
    };
    fDate();
    } else {
      setIsInitialized(true);
    }
  }, [date, token, isInitialized]);

  return (
    <div>
      <Space direction="vertical">
        <DatePicker onChange={onDateChange} defaultValue={dayjs(defaultDate)}/>
        <Space>
          <Space direction="vertical">
          <Popover content={content1} title="Details">
                <div style={{width: "80px", display:"flex", alignItems: "center", justifyContent: "center"}}>State: </div>
              </Popover>
            <Space>
              <Button style={{backgroundColor:'gray', width:widthButton, padding:"0"}}>Unavailable</Button>
              <Button style={{backgroundColor:'yellow', width:widthButton, padding:"0"}}>Booked</Button>
              <Button style={{backgroundColor:'magenta', width:widthButton, padding:"0"}}>Waiting</Button>
              <Button style={{backgroundColor:'gold', width:widthButton, padding:"0"}}>Urgent</Button>
              <Button style={{backgroundColor:'lightgreen', width:widthButton, padding:"0"}}>With doctor</Button>
              <Button style={{backgroundColor:'lightgray', width:widthButton, padding:"0"}}>At billing</Button>
              <Button style={{backgroundColor:'lightblue', width:widthButton, padding:"0"}}>Completed</Button>
              
            </Space>
          </Space>
          
        </Space>
        <Popover placement="topLeft" content={content2} title="Details">
          <div style={{width: "800px"}}>{description}</div>
        </Popover>
        <Table columns={columns} dataSource={dataQ} pagination={false} bordered scroll={{y:400}} size="small"
         />
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
                <Space>
                  <Button onClick={() => onEdit(selectedRecord.bRecordID)}>
                    Edit
                  </Button>
                  <Button onClick={() => onCreate(selectedRecord.aRecordID)}>
                      Create
                  </Button>
                  <Button onClick={() => fDelete(selectedRecord.aRecordID)}>
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
                <Space>
                  <Button onClick={() => onEdit(selectedRecord.dRecordID)}>
                    Edit
                  </Button>
                  <Button onClick={() => onCreate(selectedRecord.aRecordID)}>
                    Create
                  </Button>
                  <Button onClick={() => fDelete(selectedRecord.aRecordID)}>
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
                <Space>
                  <Button onClick={() => onEdit(selectedRecord.aRecordID)}>
                    Edit
                  </Button>
                  <Button onClick={() => onCreate(selectedRecord.aRecordID)}>
                    Create
                  </Button>
                  <Button onClick={() => fDelete(selectedRecord.aRecordID)}>
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