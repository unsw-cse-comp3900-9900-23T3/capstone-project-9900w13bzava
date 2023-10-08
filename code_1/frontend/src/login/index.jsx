import React from 'react';
import "./index.css";
import { Button, Checkbox, Form, Input, Space } from 'antd';
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
  // const [email, setEmail] = React.useState('');
  // const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  function goRegister () {
    navigate("/register");
  }

  function goMainpage () {
    navigate("/mainpage");
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
            <Button type="primary" onClick={goMainpage}>
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