import React from 'react';
import "./index.css";
import { Button, Form, Input, Space, notification, Radio } from 'antd';
import {
  useNavigate
} from 'react-router-dom';

function App ({ onSuccess }) {
  const [firstName, setFirstName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [conPassword, setConPassword] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [sexCode, setSexCode] = React.useState(0);
  const navigate = useNavigate();
  

  function goLogin () {
    navigate("/");
  }

  const onFinish = (values) => {
    console.log('Success:', values);
    fRegister()
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  async function fRegister () {
    if (firstName.length !== 0 && password.length !== 0 && location.length !== 0 && surname.length !== 0 && email.length !== 0
      && phoneNumber.length !== 0 && conPassword.length !== 0 && sexCode !== 0 ) {
      console.log('begin');
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "firstname": firstName,
          "password": password,
          "confirm password": conPassword,
          "location": location,
          "phonenumber": phoneNumber,
          "email": email,
          "sexcode": sexCode,
        })
      });
      const data = await response.json();
      console.log("backend: ", data);
      if (data.status) {
        navigate("/mainpage");
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
        navigate("/");
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

  return (
    <div className="background">
      <Form
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
              label="First name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: 'Please input your first name!',
                },
              ]}
            >
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
            </Form.Item>

            <Form.Item
              label="Surname"
              name="surname"
              rules={[
                {
                  required: true,
                  message: 'Please input your surname!',
                },
              ]}
            >
              <Input value={surname} onChange={(e) => setSurname(e.target.value)}/>
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password value={password} onChange={(e) => setPassword(e.target.value)}/>
            </Form.Item>

            <Form.Item
              label="Confirm again"
              name="confirm password"
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
              ]}
            >
              <Input.Password value={conPassword} onChange={(e) => setConPassword(e.target.value)}/>
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Location"
              name="location"
              rules={[
                {
                  required: true,
                  message: 'Please input your location!',
                },
              ]}
            >
              <Input value={location} onChange={(e) => setLocation(e.target.value)}/>
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <Input value={email} onChange={(e) => setEmail(e.target.value)}/>
            </Form.Item>

            <Form.Item
              label="Telephone"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone number!',
                },
              ]}
            >
              <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
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
              <Radio.Group onChange={(e) => setSexCode(e.target.value)} value={sexCode}>
                <Space>
                  <Radio value={1}>Male</Radio>
                  <Radio value={2}>Female</Radio>
                </Space>
                
              </Radio.Group>
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
            <Button type="primary" onClick={fRegister}>
              Confirm
            </Button>
            <Button type="primary" onClick={goLogin}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
};
export default App;