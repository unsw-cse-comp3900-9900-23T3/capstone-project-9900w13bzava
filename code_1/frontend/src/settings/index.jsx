import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Space, TimePicker, notification, Popover } from 'antd';
import './index.css'
import dayjs from 'dayjs';
import { QuestionCircleOutlined } from '@ant-design/icons';

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
  const [breakStartTime, setBreakStartTime] = useState(dBreakStartTime);
  const [breakEndTime, setBreakEndTime] = useState(dBreakEndTime);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form] = Form.useForm();

  const content1 = (
    <div>
      <p>Choose a start time and a end time for the time range shown in the page of appointments</p>
    </div>
  );

  const content2 = (
    <div>
      <p>Choose a start time and a end time. </p>
      <p>This time range is for the nap in the noon. </p>
      <p>During this time range, any appointments can not be created, edited or deleted.</p>
    </div>
  );

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
  function onBreakChange(timeString) {
    setBreakStartTime(timeString[0])
    setBreakEndTime(timeString[1])
    console.log(breakStartTime, breakEndTime)
  }

  // default setting
  function clearRangeTime() {
    setRangeStartTime(defaultStartTime)
    setRangeEndTime(defaultEndTime)
  }
  function clearBreakTime() {
    setBreakStartTime(dBreakStartTime)
    setBreakEndTime(dBreakEndTime)
  }

  async function fEditSettings() {
    const response = await fetch('http://127.0.0.1:5000/EditSettings', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        "userid": tokenRef.current,
        "timerange": `${rangeStartTime} ${rangeEndTime}`,
        "breaktimerange": `${breakStartTime} ${breakEndTime}`
      })
    });
    const data = await response.json();
    if (data.status) {
      notification.open({
        message: 'Success',
        type: 'success',
        description: `${data.message}`,
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    } else {
      notification.open({
        message: 'Error',
        type: 'error',
        description:
          `${data.message}`,
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    }
  }

  useEffect(() => {
    async function fGetSettings() {
      const response = await fetch('http://127.0.0.1:5000/GetSettings', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "userid": tokenRef.current,
        })
      });
      const data = await response.json();
      const temp = data.settings.map(item => {
        return {
          rangeStartTime: item.timerange.split(' ')[0],
          rangeEndTime: item.timerange.split(' ')[1],
          breakStartTime: item.breaktimerange.split(' ')[0],
          breakEndTime: item.breaktimerange.split(' ')[1],
        }
      })
      setRangeEndTime(temp[0].rangeEndTime)
      setRangeStartTime(temp[0].rangeStartTime)
      setBreakStartTime(temp[0].breakStartTime)
      setBreakEndTime(temp[0].breakEndTime)
    }
    if (tokenRef.current === '0') {
      setIsAdmin(true)
    }
    fGetSettings()
  }, [])

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
            <Popover content={content1} title="Explanation">
              <QuestionCircleOutlined style={{marginLeft: 2}}/>
            </Popover>
          
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
          <Button style={{marginLeft: 10, backgroundColor: "#C3F3EE", fontWeight:'bold', width: 130}} onClick={clearRangeTime}>Default setting</Button>
        </Space>
        
      </Form.Item>
      
      
      {
        isAdmin && (
          <Form.Item
            label={
              <div style={{display: "flex"}}>
                <div>Break time</div>
                <Popover content={content2} title="Explanation">
                  <QuestionCircleOutlined style={{marginLeft: 2}}/>
                </Popover>
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
              <TimePicker.RangePicker defaultValue={[dayjs(dBreakStartTime, format), dayjs(dBreakEndTime, format)]} format={format} 
                picker="time"
                minuteStep={15}
                disabledTime={() => ({disabledHours:() => [0,1,2,3,4,5,20,21,22,23]})}
                onChange={(e, timeString) => onBreakChange(timeString)}
                value={[dayjs(breakStartTime, format), dayjs(breakEndTime, format)]}
                // onChange={onRange}
              />
              <Button style={{marginLeft: 10, backgroundColor: "#C3F3EE", fontWeight:'bold', width: 130}} onClick={clearBreakTime}>Default setting</Button>
            </Space>
          </Form.Item>
        )
      }

      <br></br>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button style={{marginLeft: 10, backgroundColor: "#C3F3EE", fontWeight:'bold', width: 200}} 
        onClick={fEditSettings}>OK</Button>
      </div>
      
    </Form>
  );
}

export default App;