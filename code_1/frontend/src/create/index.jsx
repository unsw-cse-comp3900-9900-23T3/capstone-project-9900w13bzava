import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Space, notification, Modal, Radio } from 'antd';
import {
  useNavigate,
  useParams
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
  // const recordIDRef = useRef(recordID);
  const [appointmentType, setAppointmentType] = useState([]);
  // const [date, setDate] = useState('');
  const [stateID, setStateID] = useState(null);
  // const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState(''); // 这个是typeID
  const [note, setNote] = useState(null);
  const [patientFirstName, setPatientFirstName] = useState('')
  const [patientSurname, setPatientSurname] = useState('')
  const [location, setLocation] = useState(-1)
  // const [loaded, setLoaded] = useState(false)
  const [allLocation, setAllLocation] = useState(null);
  const [cPatientFirstName, setCPatientFirstName] = useState('');
  const [cPatientSurname, setCPatientSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sexCode, setSexCode] = useState(0);
  const [medicareNo, setMedicareNo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [pForm] = Form.useForm();
  const params = useParams();
  const { rStartDate, rStartTime } = params;
  const navigate = useNavigate();

  async function fJudgePatient() {
    if ( patientFirstName !== '' && patientSurname !== '') {
      const response = await fetch('http://127.0.0.1:5000/JudgePatient', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "patientfirstname": patientFirstName,
          "patientsurname": patientSurname,
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
    } else {
      notification.open({
        message: 'Error',
        type: 'error',
        description:
        // error message
          `Please input the first name and the surname of the patient`,
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    }
  }

  async function fCreate() {
    console.log("CreateAppointment: ", duration, type, location, stateID)
    if ( duration !== '' && type!== '' && location !== -1 && stateID !== 0) {
      const response = await fetch('http://127.0.0.1:5000/CreateAppointment', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "duration": duration,
          "locationid": location,
          "appointmenttypeid": type,
          "patientfirstname": patientFirstName,
          "patientsurname": patientSurname,
          "note": note,
          "userid": tokenRef.current,
          "starttime": `${spaceSplit(rStartDate, 1)} ${spaceSplit(rStartTime, 1)}:00`,
          "appointmentstatusid": stateID,
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
        onDefaultDate(spaceSplit(rStartDate, 1));
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

  function spaceSplit(string, signal) {
    const [e, m] = string.split(' ')
    if (signal === 1) {
      return e
    } else {
      return m
    }
  }

  function clearAll() {
    form.setFieldsValue({
      duration: null,
      appointmentType: null,
      note: null,
      location: null,
      stateID: null,
      patientFirstName: null,
      patientSurname: null,
    });
  }

  function onCancel() {
    onDefaultDate(spaceSplit(rStartDate, 1));
    navigate('/mainpage/appointments')
  }

  
  const showModal = () => {
    setCPatientFirstName(patientFirstName);
    setCPatientSurname(patientSurname);
    pForm.setFieldsValue({
      createPatientFirstName: patientFirstName,
      createPatientSurname: patientSurname,
    });
    setIsModalOpen(true);
    clearPatient();
  };
  async function fCreatePatient() {
    var emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var numberPattern = /^[0-9]+/;
    var mNumberPattern = /^[0-9]{8}$/;
    if (!emailPattern.test(email)){
      notification.open({
        message: 'Error',
        type: 'error',
        description:
        // error message
          `The format of the email is incorrect!`,
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    } else if (!numberPattern.test(phoneNumber) || !mNumberPattern.test(medicareNo)) {
      notification.open({
        message: 'Error',
        type: 'error',
        description:
        // error message
          `The format of the phone number or medicare number is incorrect!`,
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    } else if ( email !== '' && cPatientFirstName!== '' && cPatientSurname !== ''
     && sexCode !== 0 && phoneNumber !== '' && medicareNo !== '') {
      const response = await fetch('http://127.0.0.1:5000/CreatePatient', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "firstname": cPatientFirstName,
          "surname": cPatientSurname,
          "email": email,
          "phonenumber": phoneNumber,
          "sexcode": sexCode,
          "medicareno": medicareNo,
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
        setIsModalOpen(false);
        setPatientFirstName(cPatientFirstName);
        setPatientSurname(cPatientSurname);
        form.setFieldsValue({
          patientFirstName: cPatientFirstName,
          patientSurname: cPatientSurname,
        });
        clearPatient()
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
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    clearPatient();
  };
  function clearPatient() {
    setCPatientFirstName('');
    setCPatientSurname('');
    setEmail('');
    setPhoneNumber('');
    setMedicareNo('');
    setSexCode(0);
    pForm.setFieldsValue({
      cPatientFirstName: '',
      cPatientSurname: '',
      email: '',
      gender: 0,
      phoneNumber: '',
      medicareNo: '',
    });
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
  }, [])

  return (
    <div>
      <Modal title="Create New Patient" 
        open={isModalOpen} onCancel={handleCancel}
        footer={[
          <Button onClick={fCreatePatient}>Create new patient</Button>,
          <Button onClick={handleCancel}>Cancel</Button>
        ]}>
          <Form
            form={pForm}
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
                  label="Patient first name"
                  name="createPatientFirstName"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the first name!',
                    },
                  ]}
                >
                  <Input placeholder='Input first name' onChange={(e) => setCPatientFirstName(e.target.value)}/>
                </Form.Item>
                
                <Form.Item
                  label="Patient surname"
                  name="createPatientSurname"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the surname!',
                    },
                  ]}
                >
                  <Input placeholder='Input surname' onChange={(e) => setCPatientSurname(e.target.value)}/>
                </Form.Item>
                
                
                <Form.Item
                  label="Medicare number"
                  name="medicareNo"
                  rules={[
                    {
                      required: false,
                      message: 'Please input the medicare number!',
                    },
                  ]}
                >
                  <Input placeholder='Input medicareNo' onChange={(e) => setMedicareNo(e.target.value)}/>
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the email!',
                    },
                  ]}
                >
                  <Input placeholder='Input email' onChange={(e) => setEmail(e.target.value)}/>
                </Form.Item>

                <Form.Item
                  label="Phone number"
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the phone number!',
                    },
                  ]}
                >
                  <Input placeholder='Input phone number' onChange={(e) => setPhoneNumber(e.target.value)}/>
                </Form.Item>

                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[
                    {
                      required: true,
                      message: 'Please choose your gender!',
                    },
                  ]}
                >
                  <Radio.Group onChange={(e) => setSexCode(e.target.value)}>
                    <Space>
                      <Radio value={1}>Male</Radio>
                      <Radio value={2}>Female</Radio>
                    </Space>
                    
                  </Radio.Group>
                </Form.Item>
              
                
              </div>
            </Space>
          </Form>
        </Modal>
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
              <div>{rStartDate}</div>
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
              <div>{rStartTime}</div>
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
              <Select
                placeholder="Select location"
                style={{
                  width: sWidthComponent,
                }}
                onChange={(e) => setLocation(e)}
                options={allLocation}
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Patient first name"
              name="patientFirstName"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input onChange={(e) => setPatientFirstName(e.target.value)} placeholder='Input first name'/>
            </Form.Item>
            
            <Form.Item
              label="Patient surname"
              name="patientSurname"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input onChange={(e) => setPatientSurname(e.target.value)} placeholder='Input surname'/>
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
              <Select
                placeholder="Select status"
                style={{
                  width: sWidthComponent,
                }}
                onChange={(e) => setStateID(e)}
                options={dataState}
              />
            </Form.Item>

            <Form.Item
              label="Note"
              name="note"
            >
              <TextArea onChange={(e) => setNote(e.target.value)} placeholder={"Input the note"} rows={3}/>
            </Form.Item>
          </div>
        </Space>
        <div style={{display: "flex", justifyContent:"center"}}>
          <Space direction='vertical'>
            <Space style={{display: "flex", justifyContent:"center"}}>
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
            <Space style={{display: "flex", justifyContent:"center"}}>
              <Button onClick={fJudgePatient}>
                Check patient existence
              </Button>
              <Button onClick={showModal}>
                Create new patient
              </Button>
            </Space>
          </Space>
        </div>
        
      </Form>
    </div>
  );
}
export default App;