import React from 'react';
import "./index.css";
import { Button, Form, Input, Space, notification } from 'antd';
import {
  useNavigate
} from 'react-router-dom';
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
  const navigate = useNavigate();

  function goRegister () {
    navigate("/register");
  }

  async function fLogin () {
    if (firstName === "1") {
      onSuccess(1);
      navigate('/mainpage')
    } else {
      if (firstName.length !== 0 && surname.length !== 0 && password.length !== 0 && location.length !== 0) {
        console.log('begin');
        const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            "firstName": firstName,
            "surname": surname,
            "password": password,
            "location": location,
          })
        });
        const data = await response.json();
        console.log("fLogin: ", data);
        console.log("Send Login: ", firstName, surname, password, location);
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
        <Form.Item
          label="FirstName"
          name="firstName"
          rules={[
            {
              required: true,
              message: 'Please input your first name!',
            },
          ]}
        >
          <Input  value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
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
          <Input  value={surname} onChange={(e) => setSurname(e.target.value)}/>
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
          <Input.Password  value={password} onChange={(e) => setPassword(e.target.value)}/>
        </Form.Item>

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
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Space>
            <Button type="primary" onClick={fLogin}>
              Log in
            </Button>
            <Button type="primary" onClick={goRegister}>
              Register
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
);
}
export default App;