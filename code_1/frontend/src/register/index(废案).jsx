import React from 'react';
import "./index.css";
import { Button, Checkbox, Form, Input, Space } from 'antd';
import {
  useNavigate
} from 'react-router-dom';

function App ({ onSuccess }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
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

  function fRegister () {
    console.log('begin');
    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        "username": "zhenwei",
        "password": "4321",
        "confirm password": "4321",
        "location": "unsw",
      })
    })
    .then(response => response.json())
    .then(data =>{
      console.log(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
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
          <Input />
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
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="ConfirmPassword"
          name="confirm password"
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
          ]}
        >
          <Input.Password />
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
          <Input />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

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