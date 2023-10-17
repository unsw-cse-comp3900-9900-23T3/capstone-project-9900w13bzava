import React, { useEffect } from 'react';
import { Table, Space, Button, Modal, DatePicker } from 'antd';
import "./index.css"
import { useState } from 'react';
import dayjs from 'dayjs';
// import moment from "moment"

const widthButton = "100px"
const allState = ['gray', 'pink', 'yellow', 'magenta', 'lightgreen', 'lightgray', 'lightblue', 'red', 'gold']

let dataA = [];
function formatTime(time) {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const period = hours >= 12 ? 'pm' : 'am';
  // 处理小时和分钟的零填充
  const formattedHours = String(hours % 12).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes} ${period}`;
}
const time_ = [745, 800, 815, 830, 845, 900, 915, 930, 945, 1000, 1015, 1030, 1045, 1100, 1115, 1130, 1145, 1200,
1215, 1230, 1245, 1300, 1315, 1330, 1345, 1400, 1415, 1430, 1445, 1500, 1515, 1530, 1545, 1600, 1615, 1630, 1645,
1700, 1715, 1730, 1745, 1800]
for (let i=0; i<time_.length; i++) {
  console.log("ttttttttt");
  dataA.push({
    key: time_[i].toString().padStart(4, '0'),
    time: formatTime(time_[i]),
    before: '',
    beforeState: '',
    beforeType: '',
    date: '',
    dateState: '',
    dateType: '',
    after: '',
    afterState: '',
    afterType: '',
  });
}



function App ({ token }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [date, setDate] = useState(getCurrentDate);
  const [appointments, setAppointments] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [dataQ, setDataQ] = useState(dataA);

  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width:100,
      align: 'center',
    },
    {
      title: 'The day Before',
      dataIndex: 'before',
      key: 'before',
      align: 'center',
      onCell: (record) => {
        return {
          onClick: () => handleCellClick(record),
        };
      },
      render: (text, record) => {
        if (record.beforeState !== "") {
          return <div style={{position:"absolute",top:0,bottom:0,left:0,right:0,
          backgroundColor: allState[parseInt(record.beforeState, 10)],display:"flex",justifyContent:"center",alignItems:"center"}}>{text}</div>;
        }
        // style={{ backgroundColor: allState[parseInt(record.dateState, 10)]
        return text;
      },
    },
    {
      title: 'Chosen Date',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      onCell: (record) => {
        return {
          onClick: () => handleCellClick(record),
        };
      },
      render: (text, record) => {
        if (record.dateState !== "") {
          return <div style={{position:"absolute",top:0,bottom:0,left:0,right:0,
          backgroundColor: allState[parseInt(record.dateState, 10)],display:"flex",justifyContent:"center",alignItems:"center"}}>{text}</div>;
        }
        // style={{ backgroundColor: allState[parseInt(record.dateState, 10)]
        return text;
      },
    },
    {
      title: 'The day after',
      key: 'after',
      dataIndex: 'after',
      align: 'center',
      onCell: (record) => {
        return {
          onClick: () => handleCellClick(record),
        };
      },
      render: (text, record) => {
        if (record.afterState !== "") {
          return <div style={{position:"absolute",top:0,bottom:0,left:0,right:0,
          backgroundColor: allState[parseInt(record.afterState, 10)],display:"flex",justifyContent:"center",alignItems:"center"}}>{text}</div>;
        }
        // style={{ backgroundColor: allState[parseInt(record.dateState, 10)]
        return text;
      },
    },
  ];
  
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
  
  function getCurrentDate () {
    const currentDate = new Date(); // 创建一个Date对象，表示当前日期和时间
    const year = currentDate.getFullYear(); // 获取当前年份（四位数）
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 获取当前月份，并确保两位数表示
    const day = String(currentDate.getDate()).padStart(2, '0'); // 获取当前日期，并确保两位数表示
    const completeDate = `${year}-${month}-${day}`; // 格式化日期为"yyyy-mm-dd"
    console.log("e: ", completeDate);
    return completeDate
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
          } else if (appointments[i].day === "0") {
            temp[j].before = appointments[i].patientName
            temp[j].beforeState = appointments[i].state
            temp[j].beforeType = appointments[i].type
          } else {
            temp[j].after = appointments[i].patientName
            temp[j].afterState = appointments[i].state
            temp[j].afterType = appointments[i].type
          }
          count_ = appointments[i].duration
          judge_ = i;
        }
        if (count_ !== 0) {
          if (appointments[i].day === "1") {
            temp[j].date = appointments[judge_].patientName
            temp[j].dateState = appointments[judge_].state
            temp[j].dateType = appointments[judge_].type
          } else if (appointments[i].day === "0") {
            temp[j].before = appointments[judge_].patientName
            temp[j].beforeState = appointments[judge_].state
            temp[j].beforeType = appointments[judge_].type
          } else {
            temp[j].after = appointments[judge_].patientName
            temp[j].afterState = appointments[judge_].state
            temp[j].afterType = appointments[judge_].type
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
          patientName: appointment.patientName,
          startTime: appointment.startTime,
          duration: appointment.duration,
          state: appointment.state,
          day: appointment.day,
          type: appointment.appointmentType
        };
      });
      setAppointments(appointments_)
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
        <DatePicker onChange={onDateChange} defaultValue={dayjs("2016-02-05")}/>
        <Space>
          <Button style={{backgroundColor:'gray', width:widthButton}}>Unavailable</Button>
          <Button style={{backgroundColor:'pink', width:widthButton}}>On the day</Button>
          <Button style={{backgroundColor:'yellow', width:widthButton}}>Waiting</Button>
          <Button style={{backgroundColor:'magenta', width:widthButton}}>With doctor</Button>
        </Space>
        <Space>
          <Button style={{backgroundColor:'lightgreen', width:widthButton}}>At billing</Button>
          <Button style={{backgroundColor:'lightgray', width:widthButton}}>Completed</Button>
          <Button style={{backgroundColor:'lightblue', width:widthButton}}>Did not</Button>
          <Button style={{backgroundColor:'red', width:widthButton}}>Urgent</Button>
          <Button style={{backgroundColor:'gold', width:widthButton}}>Elsewhere</Button>
        </Space>
        <Table columns={columns} dataSource={dataQ} pagination={false} bordered scroll={{y:450}} size="small"
        
         />
      </Space>
      <Modal
        title={'Details'}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>
        ]}
      >
        {selectedRecord && (
          <div>
            <p>PatientName: {selectedRecord.date}</p>
            <p>AppointmentType: {selectedRecord.dateType}</p>
          </div>
        )}
      </Modal>
    </div> 
  );
};
export default App;