import React from 'react';
import { Button, Form, Input, DatePicker, Select, Space, TimePicker } from 'antd';

const { TextArea } = Input

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

function App () {
  const onDateChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
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
            label="Start date"
            name="startDate"
            rules={[
              {
                required: true,
                message: 'Please choose the start date!',
              },
            ]}
          >
            <DatePicker onChange={onDateChange} />
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
            <TimePicker minuteStep={15} format={'HH:mm'}/>
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
            <Input />
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
            <Input />
          </Form.Item>

          <Form.Item
            label="Appoint type"
            name="appointType"
            rules={[
              {
                required: true,
                message: 'Please choose the appoint type!',
              },
            ]}
          >
            <Select
              style={{
                width: 200,
              }}
              onChange={handleChange}
              options={[
                {
                  value: '1',
                  label: '1',
                },
                {
                  value: '2',
                  label: '2',
                },
                {
                  value: '3',
                  label: '3',
                },
                {
                  value: '4',
                  label: '4',
                },
                {
                  value: '5',
                  label: '5',
                },
                {
                  value: '6',
                  label: '6',
                },
                {
                  value: '7',
                  label: '7',
                },
                {
                  value: '8',
                  label: '8',
                },

              ]}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            label="Note"
            name="note"
          >
            <TextArea rows={4}/>
          </Form.Item>
          <Form.Item
            label="Tip"
            name="tip"
          >
            Last appointment time on 10/12/2022
          </Form.Item>
        </div>
      </Space>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button>
          Create
        </Button>
      </Form.Item>
    </Form>
  );
}
export default App;