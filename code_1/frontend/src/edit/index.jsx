import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Space, notification } from 'antd';
import {
  useNavigate
} from 'react-router-dom';

const getIndex = ['Unavailable', 'Booked', 'Waiting', 'Urgent', 'With doctor', 'At billing', 'Completed']
const dataState = []
for (let i=0; i<getIndex.length; i++) {
  dataState.push({
    value: i+1,
    label: getIndex[i],
  })
}

const { TextArea } = Input
// const widthComponent = "200"
const sWidthComponent = 195

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const dataDuration = []
  for (let i=1;i<4;i+=1) {
    dataDuration.push({
      "value": i*15,
      "label": `${i*15} minutes`,
    })
  }

const dataType = []

dataType.sort(function(a, b) {
  const valueA = a.value.toLowerCase();
  const valueB = b.value.toLowerCase();
  return valueA.localeCompare(valueB);
});

function App ({token, recordID, onDefaultDate}) {
  const tokenRef = useRef(token);
  const recordIDRef = useRef(recordID);
  const [appointmentType, setAppointmentType] = useState([]);
  const [date, setDate] = useState('');
  const [stateID, setStateID] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState(''); // 这个是typeID
  const [note, setNote] = useState(null);
  const [patientFirstName, setPatientFirstName] = useState('')
  const [patientSurname, setPatientSurname] = useState('')
  const [location, setLocation] = useState(-1)
  const [loaded, setLoaded] = useState(false)
  const [allLocation, setAllLocation] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();


  async function fEdit() {
    console.log("EditAppointment: ", duration, type, location, stateID, recordIDRef.current)
    if ( duration !== '' && type!== '' && location !== -1 && stateID !== 0) {
      const response = await fetch('http://127.0.0.1:5000/EditAppointment', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "duration": duration,
          "locationid": location,
          "appointmenttypeid": type,
          "appointmentstatusid": stateID,
          "note": note,
          "appointmentid": recordIDRef.current,
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
        onDefaultDate(date);
        navigate('/mainpage/appointments')
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
    } else {
      notification.open({
        message: 'Error',
        type: 'error',
        description:
        // error message
          `Please input all information`,
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    }
  }

  // const disabledDateTime = () => ({
  //   disabledHours: () => [0, 1, 2, 3, 4, 5, 18, 19, 20, 21, 22, 23],
  // });

  function clearAll() {
    form.setFieldsValue({
      duration: null,
      appointmentType: null,
      note: null,
      location: null,
      stateID: null,
    });
  }

  function onCancel() {
    console.log("create defaultdate: ", date)
    onDefaultDate(date);
    navigate('/mainpage/appointments')
  }

  useEffect(() => {
    async function fGetAllAppointmentTypes() {
      const response = await fetch('http://127.0.0.1:5000/GetAllAppointmentTypes', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "userid": tokenRef.current
        })
      });
      const data = await response.json();
      const temp = data.appointmenttypes.map(item => ({
        label: item.appointmenttypename,
        value: item.appointmenttypeid,
      }));
      console.log("temp", temp)
      temp.sort(function(a, b) {
        const valueA = a.label.toLowerCase();
        const valueB = b.label.toLowerCase();
        return valueA.localeCompare(valueB);
      });

      setAppointmentType(temp);
    }
    fGetAllAppointmentTypes();
  }, [])

  useEffect(() => {
    async function fGetAllLocation() {
      const response = await fetch('http://127.0.0.1:5000/GetAllLocation', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();
      const temp = [
        { value: 0, label: 'Online' },
        ...data.allLocation.slice(1).map(item => ({
          value: item.locationid,
          label: item.locationname,
        })),
      ];    
      setAllLocation(temp)
    }
    fGetAllLocation()

    async function fGetAppointment() {
      const response = await fetch('http://127.0.0.1:5000/GetAppointment', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "appointmentid": recordIDRef.current,
        })
      });
      const data = await response.json();
      if (data.status) {
        const temp = data.appointment.map(item => ({
          duration: item.duration,
          startTime: item.starttime, 
          appointmentType: item.appointmenttype, 
          appointmentTypeID: item.appointmenttypeid,
          state: item.status, 
          patientFirstName: item.patientfirstname, 
          patientSurname: item.patientsurname, 
          location: item.locationid, 
          note: item.note
        }));
        const [datePart, timePart] = temp[0].startTime.split(' '); // 分割日期和时间
        setDate(datePart); // 设置日期
        const [hours, minutes] = timePart.split(':').slice(0, 2); // 仅取小时和分钟
        setStartTime(`${hours}:${minutes}`); // 格式化时间为 "09:45"
        setPatientFirstName(temp[0].patientFirstName)
        setPatientSurname(temp[0].patientSurname)
        setNote(temp[0].note)
        setLoaded(true)
        setDuration(temp[0].duration)
        setType(temp[0].appointmentTypeID)
        setLocation(temp[0].location)
        setStateID(getIndex.indexOf(temp[0].state)+1)
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
    fGetAppointment();
  }, [])


  return (
    <div>

      <Form
        form={form}
        name="basic"
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Space size="large">
          <div>
            <Form.Item
              label="Start date"
              name="startDate"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <div>{date}</div>
            </Form.Item>

            <Form.Item
              label="Start time"
              name="startTime"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <div>{startTime}</div>
            </Form.Item>
            
            <Form.Item
              label="Duration"
              name="duration"
              rules={[
                {
                  required: true,
                  message: 'Please input the duration!',
                },
              ]}
            >
              {loaded === true && (
                <Select
                  placeholder="Select duration"
                  style={{
                    width: sWidthComponent,
                  }}
                  onChange={(e) => setDuration(e)}
                  options={dataDuration}
                  defaultValue={duration}
                />
              )}
            </Form.Item>

            <Form.Item
              label="Appointment type"
              name="appointmentType"
              rules={[
                {
                  required: true,
                  message: 'Please choose the appointment type!',
                },
              ]}
            >
              {loaded === true && (
                <Select
                  defaultValue={type}
                  placeholder="Select appointment type"
                  style={{
                    width: sWidthComponent,
                  }}
                  onChange={(e) => setType(e)}
                  options={appointmentType}
                />
              )}
              
            </Form.Item>

            <Form.Item
              label="Location"
              name="location"
              rules={[
                {
                  required: true,
                  message: 'Please choose the location!',
                },
              ]}
            >
              {loaded === true && (
                <Select
                  defaultValue={location}
                  placeholder="Select location"
                  style={{
                    width: sWidthComponent,
                  }}
                  onChange={(e) => setLocation(e)}
                  options={allLocation}
                />
              )}
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Patient first name"
              name="patientFirstName"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <div>{patientFirstName}</div>
            </Form.Item>
            
            <Form.Item
              label="Patient surname"
              name="patientSurname"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <div>{patientSurname}</div>
            </Form.Item>
            
            <Form.Item
              label="Status"
              name="state"
              rules={[
                {
                  required: true,
                  message: 'Please choose the status!',
                },
              ]}
            >
              {loaded === true && (
                <Select
                  defaultValue={stateID}
                  placeholder="Select status"
                  style={{
                    width: sWidthComponent,
                  }}
                  onChange={(e) => setStateID(e)}
                  options={dataState}
                />
              )}
            </Form.Item>

          
          
          
            <Form.Item
              label="Note"
              name="note"
            >
              {loaded && (
                <TextArea defaultValue={note} onChange={(e) => setNote(e.target.value)} placeholder={"Input the note"} rows={5}/>
              )} 
            </Form.Item>
          </div>
        </Space>
          <Space style={{display: "flex", justifyContent:"center"}}>
            <Button onClick={fEdit}>
              Edit
            </Button>
            <Button onClick={clearAll}>
              Clear
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Space>
      </Form>
    </div>
  );
}
export default App;