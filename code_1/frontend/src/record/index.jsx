import React, { useEffect, useState, useRef } from 'react';
import { Table, Space, Select, Modal, Button, Popover } from 'antd';
import "./index.css"

// record/index.jsx is for the page of showing patients' history and future records.

const hColumns = [
  {
    title: <div className='recordFillCellTitle' style={{backgroundColor: 'lightgray'}}>History</div>,
    dataIndex: 'history',
    key: 'history',
    align: 'center',
    children: [
      {
        title: 'Time',
        dataIndex: 'hTime',
        key: 'hTime',
        align: 'center',
        render: (text, record) => {
          if (record.hasMedicare === 0) {
            return <div style={{position:"absolute",top:0,bottom:0,left:0,right:0,
            backgroundColor: "orange",display:"flex",justifyContent:"center",alignItems:"center"}}>{text}</div>;
          }
          return <div>{text}</div>;
        }
      },
      {
        title: 'Doctor name',
        dataIndex: 'hDoctor',
        key: 'hDoctor',
        align: 'center',
      },
    ]
  }
];
const fColumns = [
  {
    title: <div className='recordFillCellTitle' style={{backgroundColor: 'lightgray'}}>Future</div>,
    dataIndex: 'future',
    key: 'future',
    align: 'center',
    children: [
      {
        title: 'Time',
        dataIndex: 'fTime',
        key: 'fTime',
        align: 'center',
        render: (text, record) => {
          if (record.hasMedicare === 0) {
            return <div style={{position:"absolute",top:0,bottom:0,left:0,right:0,
            backgroundColor: "orange",display:"flex",justifyContent:"center",alignItems:"center"}}>{text}</div>;
          }
          return <div>{text}</div>;
        }
      },
      {
        title: 'Doctor name',
        dataIndex: 'fDoctor',
        key: 'fDoctor',
        align: 'center',
      },
    ]
  }
];
const hData = []
for (let i=0; i<9; i++) {
  hData.push(
    {
      key: `${i}`,
      hTime: '',
      hDoctor: '',
      hasMedicare: 1,
    },
  )
}
const fData = []
for (let i=0; i<9; i++) {
  fData.push(
    {
      key: `${i}`,
      fTime: '',
      fDoctor: '',
      hasMedicare: 1,
    },
  )
}

function App ({ token }) {
  const tokenRef = useRef(token);
  const [dataH, setDataH] = useState(hData)
  const [dataF, setDataF] = useState(fData)
  const [optionData, setOptionData] = useState([])
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [doctorID, setDoctorID] = useState(0);
  const [allUsersName, setAllUsersName] = useState([])
  const [patientID, setPatientID] = useState(null)

  const content1 = (
    <div>
      <p>Highlight on the patient's name or time indicates that the patient does not have medical insurance.</p>
      <p>Highlight on the appointment type signifies that the patient has not had any in-person visits within the past year.</p>
    </div>
  );

  const onChange = (value) => {
    setPatientID(value)
    async function fPatientRecord(e) {
      const response = await fetch('http://127.0.0.1:5000/ShowPatientRecord', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "patientid": value,
          "userid": e,
        })
      });
      const data = await response.json();
      console.log("showpatientreocrd: ", data)
      const tempH = data.history.map((item, index) => ({
        key: index.toString(),
        hTime: item.starttime,
        hDoctor: `${item.userfirstname} ${item.usersurname}`,
        patientName: `${item.patientfirstname} ${item.patientsurname}`,
        hasMedicare: item.hasmedicare,
        isPhone: item.isphone,
        duration: item.duration,
        status: item.status,
        appointmentType: item.appointmenttype,
        note: item.note,
      }));
      while (tempH.length < 10) {
        tempH.push({
          key: tempH.length.toString(),
          hTime: '',
          hDoctor: '',
          patientName: '',
          hasMedicare: 1,
          duration: '',
          status: '',
          appointmentType: '',
          note: '',
        })
      }
      const tempF = data.future.map((item, index) => ({
        key: index.toString(),
        fTime: item.starttime,
        fDoctor: `${item.userfirstname} ${item.usersurname}`,
        patientName: `${item.patientfirstname} ${item.patientsurname}`,
        hasMedicare: item.hasmedicare,
        isPhone: item.isphone,
        duration: item.duration,
        status: item.status,
        appointmentType: item.appointmenttype,
        note: item.note,
      }));
      while (tempF.length < 10) {
        tempF.push({
          key: tempF.length.toString(),
          fTime: '',
          fDoctor: '',
          patientName: '',
          hasMedicare: 1,
          duration: '',
          status: '',
          appointmentType: '',
          note: '',
        })
      }
      setDataH(tempH);
      setDataF(tempF);
    }
    if (tokenRef.current === '0') {
      fPatientRecord(doctorID);
    } else {
      fPatientRecord(tokenRef.current)
    }
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  
  const showModal = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const rowClickHandler = (record) => {
    return {
      onClick: () => {
        if (record.fTime !== '' && record.hTime !== '') {
          showModal(record);
        }
      },
    };
  };

  useEffect(() => {
    async function fPatientList(e) {
      try {
        const response = await fetch('http://127.0.0.1:5000/ShowPatientList', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            "userid": e,
          })
        });
        const data = await response.json();
        const temp = data.patients.map(item => ({
          label: `${item.firstname} ${item.surname}`,
          value: item.patientid,
        }));
        setOptionData(temp);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    
    if (tokenRef.current === '0') {
      setIsSelect(true)
      fPatientList(doctorID);
    } else {
      fPatientList(tokenRef.current)
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
  }, [doctorID]);
  
  return (
    <div>
      <Space direction="vertical">
        <Space style={{marginLeft: 10}}>
          {isSelect && (
            <Space>
              <div style={{fontWeight: 'bold'}}>Choose a doctor: </div>
              <Select style={{width: 195}} onChange={(e) => {setDoctorID(e);setPatientID(null)}} placeholder="Select doctor" options={allUsersName}/>
            </Space>
          )}
          <div style={{fontWeight: 'bold', marginLeft: 30}}>
            Choose a patient:
          </div>
          
          <Select
            showSearch
            placeholder="Select a patient"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={filterOption}
            options={optionData}
            value={patientID}
            style={{width: 195}} 
          />
          <Popover placement="bottomLeft" content={content1} title="Details">
            <div style={{marginLeft: 90, display: 'flex'}}>
              <div style={{fontWeight: 'bold'}} nowrap>Highlight:</div>
              <div style={{backgroundColor: "orange", marginLeft:10}}>happen at the patient name, time or appointment type</div>
            </div>
          </Popover>
           
        </Space>
        
        <Space>
          <Table className="hTable" columns={hColumns} dataSource={dataH} pagination={false} 
          bordered scroll={{y:380}} size="small" onRow={rowClickHandler}
          onHeaderRow={() => ({
            height: 40,
          })}/>
          <Table className='fTable' columns={fColumns} dataSource={dataF} pagination={false} 
          bordered scroll={{y:380}} size="small" onRow={rowClickHandler} 
          onHeaderRow={() => ({
            height: 40,
          })}/>
        </Space>

        {selectedRow && (
          <Modal
            title="Details"
            open={isModalVisible}
            onOk={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Close
              </Button>
            ]}
          >
            {
              selectedRow.hasMedicare === 0 && (
                <div>
                  <p style={{backgroundColor: "orange"}}>Patient name: {selectedRow.patientName}</p>
                </div>
              )
            }
            {
              selectedRow.hasMedicare === 1 && (
                <div>
                  <p>Patient name: {selectedRow.patientName}</p>
                </div>
              )
            }
            { 'hTime' in selectedRow && (
              <div>
                <p>Time: {selectedRow.hTime}</p>
                <p>Doctor name: {selectedRow.hDoctor}</p>
              </div>
            )}
            { 'fTime' in selectedRow && (
              <div>
                <p>Time: {selectedRow.fTime}</p>
                <p>Doctor name: {selectedRow.fDoctor}</p>
              </div>
            )}
            <p>Duration: {selectedRow.duration} minutes</p>
            <p>Status: {selectedRow.status}</p>
            {
              selectedRow.isPhone === 1 && (
                <div>
                  <p style={{backgroundColor: "orange"}}>Appointment type: {selectedRow.appointmentType}</p>
                </div>
              )
            }
            {
              selectedRow.isPhone === 0 && (
                <div>
                  <p>Appointment type: {selectedRow.appointmentType}</p>
                </div>
              )
            }
            <p>Note: {selectedRow.note}</p>
            
          </Modal>
        )}
        
      </Space>
    </div> 
  );
};
export default App;