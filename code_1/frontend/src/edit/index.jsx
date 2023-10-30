import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, DatePicker, Select, Space, TimePicker, notification } from 'antd';

const { TextArea } = Input
const widthComponent = "200"
const sWidthComponent = 195

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const dataDuration = []
  for (let i=1;i<20;i+=1) {
    dataDuration.push({
      "value": i*5,
      "label": `${i*5} minutes`,
    })
  }

const dataType = [
  {
    value: 'Standard appt.',
    label: 'Standard appt.',
  },
  {
    value: 'Long appt.',
    label: 'Long appt.',
  },
  {
    value: 'Short appt.',
    label: 'Short appt.',
  },
  {
    value: 'New patient',
    label: 'New patient',
  },
  {
    value: 'Excision',
    label: 'Excision',
  },
  {
    value: 'Procedure',
    label: 'Procedure',
  },
  {
    value: 'Immunisation',
    label: 'Immunisation',
  },
  {
    value: 'Insurance medical',
    label: 'Insurance medical',
  },
  {
    value: 'DVA medical',
    label: 'DVA medical',
  },
  {
    value: 'Diving medical',
    label: 'Diving medical',
  },{
    value: 'Meeting',
    label: 'Meeting',
  },
  {
    value: 'Operation',
    label: 'Operation',
  },
  {
    value: 'Assist',
    label: 'Assist',
  },
  {
    value: 'Home visit',
    label: 'Home visit',
  },

  {
    value: 'Hospital visit',
    label: 'Hospital visit',
  },
  {
    value: 'Nursing home (RACF) visit',
    label: 'Nursing home (RACF) visit',
  },
  {
    value: 'Teleconference',
    label: 'Teleconference',
  },
  {
    value: 'Deug rep.',
    label: 'Deug rep.',
  },
  {
    value: 'Antenatal visit',
    label: 'Antenatal visit',
  },
  {
    value: 'Acupuncture',
    label: 'Acupuncture',
  },
  {
    value: 'Health Assessment',
    label: 'Health Assessment',
  },
  {
    value: 'Care Plan',
    label: 'Care Plan',
  },
  {
    value: 'Other',
    label: 'Other',
  },
  {
    value: 'Cervical screening',
    label: 'Cervical screening',
  },
  {
    value: 'Recall',
    label: 'Recall',
  },
  {
    value: 'Internet',
    label: 'Internet',
  },
  {
    value: 'Workers Comp.',
    label: 'Workers Comp.',
  },
  {
    value: 'Telehealth Consult',
    label: 'Telehealth Consult',
  },
  {
    value: 'Telephone Consult',
    label: 'Telephone Consult',
  },
  {
    value: 'Best Health Connect (Telehealth)',
    label: 'Best Health Connect (Telehealth)',
  }
]
dataType.sort(function(a, b) {
  const valueA = a.value.toLowerCase();
  const valueB = b.value.toLowerCase();
  return valueA.localeCompare(valueB);
});

function App ({token, recordID}) {
  const tokenRef = useRef(token);
  const [cRecordID, setCRecordID] = useState(recordID);
  const [dataP, setDataP] = useState([]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [patientID, setPatientID] = useState('');
  const [type, setType] = useState('');
  const [note, setNote] = useState('');
  const [form] = Form.useForm();

  async function fEdit() {
    if (date !== '' && startTime !== '' && duration !== '' && patientID !== '' && type!== '') {
      const response = await fetch('http://127.0.0.1:5000/Edit', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "userid": tokenRef,
          "date": date,
          "startTime": startTime,
          "duration": duration,
          "patientID": patientID,
          "type": type,
          "note": note,
          "recordID": cRecordID,
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
        setCRecordID(0)
        localStorage.removeItem('recordID')
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

  
  function onDefaultID() {
    if (cRecordID !== 0) {
      return cRecordID
    } else {
      return ''
    }
    
  }

  function clearAll() {
    form.setFieldsValue({
      startDate: '',
      startTime: '',
      duration: '',
      patientName: '',
      appointmentType: '',
      note: ''
    });
  }

  const disabledDateTime = () => ({
    disabledHours: () => [0, 1, 2, 3, 4, 5, 18, 19, 20, 21, 22, 23],
  });

  useEffect(() => {
    async function fGetAllPatient() {
      const response = await fetch('http://127.0.0.1:5000/GetAllPatient', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "userid": tokenRef,
        })
      });
      const data = await response.json();
      const temp = data.patientDetail.map(item => ({
        label: `${item.firstName} ${item.surname}`,
        sexCode: item.sexCode,
        value: item.patientID,
      }));
      temp.sort(function(a, b) {
        const valueA = a.label.toLowerCase();
        const valueB = b.label.toLowerCase();
        return valueA.localeCompare(valueB);
      });
      setDataP(temp);
    }
    fGetAllPatient();
  }, [])


  return (
    <Form
      form={form}
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Space>
        <div>
          <Form.Item
            label="Record ID"
            name="recordID"
            rules={[
              {
                required: true,
                message: 'Please input the appointment ID!',
              },
            ]}
          >
            <Input defaultValue={onDefaultID}/>
          </Form.Item>
          <Form.Item
            label="Start date"
            name="startDate"
            rules={[
              {
                required: true,
                message: 'Please choose the start date!',
              },
            ]}
          >
            <DatePicker style={{width: widthComponent, display: "flex"}} onChange={(e, dateString) => setDate(dateString)} />
          </Form.Item>

          <Form.Item
            label="Start time"
            name="startTime"
            rules={[
              {
                required: true,
                message: 'Please choose the start time!',
              },
            ]}
          >
            <TimePicker hideDisabledOptions disabledTime={disabledDateTime} onChange={(e, timeString) => setStartTime(timeString)} style={{width: widthComponent, display: "flex"}} minuteStep={15} format={'HH:mm'}/>
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
            label="Patient name"
            name="patientName"
            rules={[
              {
                required: true,
                message: 'Please input the patient name!',
              },
            ]}
          >
            <Select
              placeholder="Select patient"
              style={{
                width: sWidthComponent,
              }}
              onChange={(e) => setPatientID(e)}
              options={dataP}
            />
          </Form.Item>

          <Form.Item
            label="Type"
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
              options={dataType}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            label="Note"
            name="note"
          >
            <TextArea onChange={(e) => setNote(e.target.value)} placeholder="Enter description" rows={4}/>
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
          <Button onClick={fEdit}>
            Edit
          </Button>
          <Button onClick={clearAll}>
            Clear
          </Button>
        </Space>
        
      </Form.Item>
    </Form>
  );
}
export default App;