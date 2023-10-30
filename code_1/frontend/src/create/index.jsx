import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Space, notification, Radio } from 'antd';
import {
  useNavigate
} from 'react-router-dom';

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
  for (let i=1;i<16;i+=1) {
    dataDuration.push({
      "value": i,
      "label": `${i} minutes`,
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
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(null);
  const [type, setType] = useState(null);
  const [note, setNote] = useState('');
  const [patientFirstName, setPatientFirstName] = useState('')
  const [patientSurname, setPatientSurname] = useState('')
  const [location, setLocation] = useState(2)
  const [form] = Form.useForm();
  const navigate = useNavigate();


  async function fCreate() {
    if (patientSurname !== '' && duration !== 0 && patientFirstName !== '' && type!== null && location !== 2) {
      const response = await fetch('http://127.0.0.1:5000/CreateAppointment', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "userid": tokenRef.current,
          "starttime": `${date} ${startTime}:00`,
          "duration": duration,
          "patientfirstname": patientFirstName,
          "patientsurname": patientSurname,
          "location": location,
          "type": type,
          "note": note,
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
      patientFirstName: '',
      patientSurname: '',
      appointmentType: null,
      note: '',
      location: null,
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
      });
      const data = await response.json();
      const temp = data.appointmenttypes.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setAppointmentType(temp);
    }
    fGetAllAppointmentTypes();
  }, [])

  useEffect(() => {
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
      console.log("getappointment: ", recordIDRef)
      const data = await response.json();
      if (data.status) {
        const temp = data.appointment.map(item => ({
          duration: item.duration,
          startTime: item.starttime, 
          appointmentType: item.appointmenttype, 
          state: item.status, 
          patientFirstName: item.patientfirstname, 
          patientSurname: item.patientsurname, 
          location: item.locationid === 0 ? 'Online' : 'Offline', 
          note: item.note
        }));
        const [datePart, timePart] = temp[0].startTime.split(' '); // 分割日期和时间
        setDate(datePart); // 设置日期
        
        // 将时间部分（"09:45:00"）分割为小时和分钟
        const [hours, minutes] = timePart.split(':').slice(0, 2); // 仅取小时和分钟
        setStartTime(`${hours}:${minutes}`); // 格式化时间为 "09:45"
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
    <Form
      form={form}
      name="basic"
      // labelCol={{
      //   span: 8,
      // }}
      // wrapperCol={{
      //   span: 16,
      // }}
      style={{
        maxWidth: 600,
      }}
      // initialValues={{
      //   remember: true,
      // }}
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
                message: 'Please choose the start date!',
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
              <Select
                placeholder="Select duration"
                style={{
                  width: sWidthComponent,
                }}
                onChange={(e) => setDuration(e)}
                options={dataDuration}
              />
            
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
            <Select
              placeholder="Select appointment type"
              style={{
                width: sWidthComponent,
              }}
              onChange={(e) => setType(e)}
              options={appointmentType}
            />
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
            <Radio.Group onChange={(e) => setLocation(e.target.value)} value={location}>
              <Space>
                <Radio value={0}>Online</Radio>
                <Radio value={1}>Offline</Radio>
              </Space>
              
            </Radio.Group>
          </Form.Item>
        </div>
        <div>
          <Form.Item
            label="Patient first name"
            name="patientFirstName"
            rules={[
              {
                required: true,
                message: 'Please input the first name of the patient!',
              },
            ]}
          >
            <Input placeholder="Input the first name" value={patientFirstName} onChange={(e) => setPatientFirstName(e.target.value)}/>
          </Form.Item>
          
          <Form.Item
            label="Patient surname"
            name="patientSurname"
            rules={[
              {
                required: true,
                message: 'Please input the surname of the patient!',
              },
            ]}
          >
            <Input placeholder="Input the surname" value={patientSurname} onChange={(e) => setPatientSurname(e.target.value)}/>
          </Form.Item>

          <Form.Item
            label="Note"
            name="note"
          >
            <TextArea onChange={(e) => setNote(e.target.value)} placeholder="Enter description" rows={5}/>
          </Form.Item>
        </div>
      </Space>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Space>
          <Button onClick={fCreate}>
            Create
          </Button>
          <Button onClick={clearAll}>
            Clear
          </Button>
          <Button onClick={onCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
export default App;