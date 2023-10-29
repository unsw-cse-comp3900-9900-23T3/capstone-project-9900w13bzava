import React, { useEffect, useState, useRef } from 'react';
import { Table, Space, Select, Modal, Button } from 'antd';
import "./index.css"

const hColumns = [
  {
    title: 'History',
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
    title: 'Future',
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
  // const [isRecordLoaded, setIsRecordLoaded] = useState(false);
  const [optionData, setOptionData] = useState([])
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // style
  const selectStyle = {
    minWidth: '100px',
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
    async function fPatientRecord() {
      const response = await fetch('http://127.0.0.1:5000/ShowPatientRecord', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "patientID": value,
          "userid": tokenRef,
        })
      });
      const data = await response.json();
      console.log("tokenRef", tokenRef)
      const tempH = data.history.map((item, index) => ({
        key: index.toString(),
        hTime: `${item.day} ${item.startTime}`,
        hDoctor: `${item.firstName} ${item.surname}`,
        patientName: item.patientName,
        hasMedicare: item.hasMedicare,
        isPhone: item.isPhone,
        duration: item.duration,
        status: item.status,
        appointmentType: item.appointmentType,
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
        fTime: `${item.day} ${item.startTime}`,
        fDoctor: `${item.firstName} ${item.surname}`,
        patientName: item.patientName,
        hasMedicare: item.hasMedicare,
        isPhone: item.isPhone,
        duration: item.duration,
        status: item.status,
        appointmentType: item.appointmentType,
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
    fPatientRecord();
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
        // Only open modal if fTime is not empty
        if (record.fTime !== '' && record.hTime !== '') {
          showModal(record);
        }
      },
    };
  };

  useEffect(() => {
    async function fPatientList() {
      try {
        const response = await fetch('http://127.0.0.1:5000/ShowPatientList', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            "userid": tokenRef,
          })
        });
        const data = await response.json();
        console.log("tokenRef", tokenRef)
        const temp = data.patients.map(item => ({
          label: item.patientName, // Specify label for Select option
          value: item.patientID,
        }));
        setOptionData(temp);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fPatientList();
  }, []);

  useEffect(() => {
    console.log("dataF dataH: ", dataF, dataH)
    console.log("d : ", dataF.hTime, dataH)
  }, [dataF, dataH])
  
  return (
    <div>
      <Space direction="vertical">
        
        <Select
          showSearch
          placeholder="Select a patient"
          optionFilterProp="children"
          onChange={onChange}
          onSearch={onSearch}
          filterOption={filterOption}
          options={optionData}
          style={selectStyle}
        />
        <Space>
          <Table className="hTable" columns={hColumns} dataSource={dataH} pagination={false} bordered scroll={{y:450}} size="small" onRow={rowClickHandler}/>
          <Table className='fTable' columns={fColumns} dataSource={dataF} pagination={false} bordered scroll={{y:450}} size="small" onRow={rowClickHandler}/>
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