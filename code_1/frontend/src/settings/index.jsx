import React, { useState, useRef, useEffect, useForm } from 'react';
import { Button, Form, Input, Select, Checkbox, Space, TimePicker } from 'antd';
import './index.css'
import dayjs from 'dayjs';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useActionData } from 'react-router-dom';

const format = "HH:mm"
const defaultStartTime = '6:00'
const defaultEndTime = '18:00'
const dBreakStartTime = '12:00'
const dBreakEndTime = '12:00'

function App({ token }) {
  // const [isCheckBox, setIsCheckBox] = useState('none');
  // const [allUsersName, setAllUsersName] = useState([])
  const tokenRef = useRef(token);
  const [rangeStartTime, setRangeStartTime] = useState(defaultStartTime);
  const [rangeEndTime, setRangeEndTime] = useState(defaultEndTime);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  function onRangeChange(timeString) {
    setRangeStartTime(timeString[0])
    setRangeEndTime(timeString[1])
  }

  function clearRangeTime() {
    setRangeStartTime(defaultStartTime)
    setRangeEndTime(defaultEndTime)
  }

  // useEffect(() => {
  //   if (tokenRef.current === '0') {
  //     setIsCheckBox('flex')
  //   }
  //   async function fGetAllUsers() {
  //     const response = await fetch('http://127.0.0.1:5000/GetAllUsers', {
  //       method: 'POST',
  //       headers: {
  //         'Content-type': 'application/json',
  //       },
  //     });
  //     const data = await response.json();
  //     const temp = data.allUsers.map(item => {
  //       return {
  //         value: item.userid,
  //         label: `${item.firstname} ${item.surname}`,
  //       }
  //     })
  //     temp.sort(function(a, b) {
  //       const valueA = a.label.toLowerCase();
  //       const valueB = b.label.toLowerCase();
  //       return valueA.localeCompare(valueB);
  //     });
  //     console.log(temp)
  //     setAllUsersName(temp)
  //   }
  //   fGetAllUsers() 
  // }, [])

  return (
    <Form
      name="basic"
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label={
          <div style={{display: "flex"}}>
            <div>Time range</div>
            <QuestionCircleOutlined style={{marginLeft: 2}}/>
          </div>
        }
        name="timeRange"
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Space>
          <TimePicker.RangePicker defaultValue={[dayjs(defaultStartTime, format), dayjs(defaultEndTime, format)]} format={format} 
            picker="time"
            minuteStep={15}
            disabledTime={() => ({disabledHours:() => [0,1,2,3,4,5,20,21,22,23]})}
            onChange={(e, timeString) => onRangeChange(timeString)}
            value={[dayjs(rangeStartTime, format), dayjs(rangeEndTime, format)]}
          />
          <Button style={{marginLeft: 10, backgroundColor: "#C3F3EE", fontWeight:'bold', width: 150}} onClick={clearRangeTime}>Default setting</Button>
        </Space>
        
      </Form.Item>

      <Form.Item
        label={
          <div style={{display: "flex"}}>
            <div>Break time</div>
            <QuestionCircleOutlined style={{marginLeft: 2}}/>
          </div>
        }
        name="breakTime"
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Space>
          <TimePicker.RangePicker defaultValue={[dayjs(defaultStartTime, format), dayjs(defaultEndTime, format)]} format={format} 
            picker="time"
            minuteStep={15}
            disabledTime={() => ({disabledHours:() => [0,1,2,3,4,5,20,21,22,23]})}
            // onChange={onRange}
          />
          <Button style={{marginLeft: 10, backgroundColor: "#C3F3EE", fontWeight:'bold', width: 150}} >Default setting</Button>
        </Space>
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
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default App;