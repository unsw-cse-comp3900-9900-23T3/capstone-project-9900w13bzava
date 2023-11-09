import React, { useEffect } from 'react';
import "./index.css";
import { Button, Form, Input, Space, notification, Typography, Select } from 'antd';
import {
  useNavigate
} from 'react-router-dom';
const sWidthComponent = 195
const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

function App ({ onSuccess }) {
  const [firstName, setFirstName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [allUsersName, setAllUsersName] = React.useState(null);
  const [allLocation, setAllLocation] = React.useState(null);
  const navigate = useNavigate();

  function goRegister () {
    navigate("/register");
  }

  async function fLogin () {
    if (firstName.length !== 0 && password.length !== 0 && location.length !== 0) {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "firstname": firstName,
          "surname": surname,
          "password": password,
          "locationid": location,
        })
      });
      const data = await response.json();
      console.log("fLogin: ", data);
      console.log("Send Login: ", firstName, surname, password, location);
      if (data.status) {
        navigate("/mainpage/appointments");
        notification.open({
          message: 'Success',
          type: 'success',
          description:
          // error message
              `${data.message} Hello ${firstName} ${surname}`,
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
        onSuccess(data.userid)
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

  function splitName(e) {
    const [selectedFirstName, selectedSurname] = e.split(' ');
    setFirstName(selectedFirstName);
    setSurname(selectedSurname);
  }

  useEffect(() => {
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
          value: `${item.firstname} ${item.surname}`,
          label: `${item.firstname} ${item.surname}`,
        }
      })
      temp.sort(function(a, b) {
        const valueA = a.label.toLowerCase();
        const valueB = b.label.toLowerCase();
        return valueA.localeCompare(valueB);
      });
      console.log(temp)
      setAllUsersName(temp)
    }
    fGetAllUsers()
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
      const temp = data.allLocation.slice(1).map(item => {
        return {
          value: item.locationid,
          label: item.locationname,
        }
      })
      setAllLocation(temp)
    }
    fGetAllLocation()
  }, [])

  return (
    <div className="loginBackground">
      <div className='changeColor'>
        <div style={{backgroundColor: "white", borderRadius: '30px'}}>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{maxWidth: 600, paddingBottom: 20}}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="logo"
            >
              <img
                width={400}
                src={require('../components/img/BestPracticeLogo.jpg')}
                style={{borderRadius: '30% 40% 0% 0%'}}
                alt="logo"
              />
            </Form.Item>
            
            <Form.Item
              label="Username"
              name="userName"
              rules={[
                {
                  required: false,
                },
              ]}
              style={{fontWeight:"bold"}}
            >
              <Select
                placeholder="Select user's name"
                style={{
                  width: sWidthComponent,
                  fontWeight:"normal"
                }}
                onChange={(e) => splitName(e)}
                options={allUsersName}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: false,
                  message: 'Please input your password!',
                },
              ]}
              style={{fontWeight:"bold"}}
            >
              <Input.Password style={{width:195}} placeholder="Input password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </Form.Item>

            <Form.Item
              label="Location"
              name="location"
              rules={[
                {
                  required: false,
                },
              ]}
              style={{fontWeight:"bold"}}
            >
              <Select
                placeholder="Select location"
                style={{
                  width: sWidthComponent,
                  fontWeight:"normal"
                }}
                onChange={(e) => setLocation(e)}
                options={allLocation}
              />
            </Form.Item>

            
              <Space direction='vertical' style={{display:"flex", justifyContent: "center", alignItems: "center"}}>
                <Button onClick={fLogin} style={{backgroundColor: "#C3F3EE", fontWeight:'bold', width: 200}}>
                  Log in
                </Button>
                <Space style={{display: "flex"}}>
                  <Typography>
                    Do not have a account? 
                  </Typography>
                  <Typography className="hover-text" onClick={goRegister}>
                    Register now!
                  </Typography>
                </Space>
              </Space>
          </Form>
        </div>
        
      </div>
      
    </div>
);
}
export default App;