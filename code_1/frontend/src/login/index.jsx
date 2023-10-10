import React from 'react';
import "./index.css";
import { Button, Form, Input, Space } from 'antd';
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
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [location, setLocation] = React.useState('');
  const navigate = useNavigate();

  function goRegister () {
    navigate("/register");
  }

  async function fLogin () {
    if (username.length !== 0 && password.length !== 0 && location.length !== 0) {
      console.log('begin');
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "username": username,
          "password": password,
          "location": location,
        })
      });
      const data = await response.json();
      console.log("backend: ", data.message);
      if (data.message === 'Login successful!') {
        navigate("/mainpage");
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
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input  value={username} onChange={(e) => setUsername(e.target.value)}/>
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