import React from 'react';
import { Table, Space, Button, Modal } from 'antd';
import "./index.css"
import { useState } from 'react';

const widthButton = "100px"

const columns = [
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    width:100,
    align: 'center',
  },
  {
    title: 'The day Before',
    dataIndex: 'before',
    key: 'before',
    align: 'center',
    render: (text, record) => {
      if (record.before === 'Bill' || record.before === 'Clea') {
        return <div style={{ backgroundColor: 'lightgreen' }}>{text}</div>;
      }
      return text;
    },
  },
  {
    title: 'Chosen Date',
    dataIndex: 'date',
    key: 'date',
    align: 'center',
    render: (text, record) => {
      if (record.date === 'Alice' || record.date === 'Clea') {
        return <div style={{ backgroundColor: 'yellow' }}>{text}</div>;
      }
      if (record.date === 'Dell' || record.date === 'Eve') {
        return <div style={{ backgroundColor: 'red' }}>{text}</div>;
      }
      return text;
    },
  },
  {
    title: 'The day after',
    key: 'after',
    dataIndex: 'after',
    align: 'center',
    render: (text, record) => {
      if (record.after === 'June' || record.after === 'Clea') {
        return <div style={{ backgroundColor: 'lightgreen' }}>{text}</div>;
      }
      if (record.after === 'Bill' || record.after === 'Frank') {
        return <div style={{ backgroundColor: 'red' }}>{text}</div>;
      }
      return text;
    },
  },
];
const data = [
  {
    key: '0745',
    time: '07:45 am',
    before: '',
    after: '',
    date: 'Alice',
  },
  {
    key: '0800',
    time: '08:00 am',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '0815',
    time: '08:15 am',
    before: 'Clea',
    after: '',
    date: '',
  },
  {
    key: '0830',
    time: '08:30 am',
    before: 'Bill',
    after: '',
    date: '',
  },
  {
    key: '0845',
    time: '08:45 am',
    before: '',
    after: 'June',
    date: '',
  },
  {
    key: '0900',
    time: '09:00 am',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '0915',
    time: '09:15 am',
    before: 'Clea',
    after: '',
    date: '',
  },
  {
    key: '0930',
    time: '09:30 am',
    before: '',
    after: 'Frank',
    date: 'Eve',
  },
  {
    key: '0945',
    time: '09:45 am',
    before: '',
    after: '',
    date: 'Clea',
  },
  {
    key: '1000',
    time: '10:00 am',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1015',
    time: '10:15 am',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1030',
    time: '10:30 am',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1045',
    time: '10:45 am',
    before: '',
    after: '',
    date: 'Dell',
  },
  {
    key: '1100',
    time: '11:00 am',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1115',
    time: '11:15 am',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1130',
    time: '11:30 am',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1145',
    time: '11:45 am',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1200',
    time: '12:00 pm',
    before: '',
    after: '',
    date: '',
  },{
    key: '1215',
    time: '12:15 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1230',
    time: '12:30 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1245',
    time: '12:45 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1300',
    time: '13:00 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1315',
    time: '13:15 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1330',
    time: '13:30 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1345',
    time: '13:45 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1400',
    time: '14:00 pm',
    before: '',
    after: '',
    date: '',
  },

  {
    key: '1415',
    time: '14:15 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1430',
    time: '14:30 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1445',
    time: '14:45 pm',
    before: '',
    after: '',
    date: '',
  },{
    key: '1500',
    time: '15:00 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1515',
    time: '15:15 pm',
    before: '',
    after: '',
    date: '',
  },

  {
    key: '1530',
    time: '15:30 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1545',
    time: '15:45 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1600',
    time: '16:00 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1615',
    time: '16:15 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1630',
    time: '16:30 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1645',
    time: '16:45 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1700',
    time: '17:00 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1715',
    time: '17:15 pm',
    before: '',
    after: '',
    date: '',
  },

  {
    key: '1730',
    time: '17:30 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1745',
    time: '17:45 pm',
    before: '',
    after: '',
    date: '',
  },
  {
    key: '1800',
    time: '18:00 pm',
    before: '',
    after: '',
    date: '',
  },
];

function App ({ onSuccess }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleCellClick = (record) => {
    // 设置选中的记录，打开对话框
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    // 清空选中的记录，关闭对话框
    setSelectedRecord(null);
    setModalVisible(false);
  };

  return (
    <div>
      <Space direction="vertical">
        <Space>
          <Button style={{backgroundColor:'gray', width:widthButton}}>Unavailable</Button>
          <Button style={{backgroundColor:'pink', width:widthButton}}>On the day</Button>
          <Button style={{backgroundColor:'yellow', width:widthButton}}>Waiting</Button>
          <Button style={{backgroundColor:'magenta', width:widthButton}}>With doctor</Button>
        </Space>
        <Space>
          <Button style={{backgroundColor:'lightgreen', width:widthButton}}>At billing</Button>
          <Button style={{backgroundColor:'lightgray', width:widthButton}}>Completed</Button>
          <Button style={{backgroundColor:'lightred', width:widthButton}}>Did not</Button>
          <Button style={{backgroundColor:'red', width:widthButton}}>Urgent</Button>
          <Button type="primary" style={{backgroundColor:'Black', width:widthButton}}>Elsewhere</Button>
        </Space>
        <Table columns={columns} dataSource={data} pagination={false} bordered scroll={{y:300}} size="small"
        onRow={(record) => ({
          onClick: () => handleCellClick(record),
        })} />
      </Space>
      <Modal
        title={'Edit this appointment'}
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>
        ]}
      >
        {selectedRecord && (
          <div>
            <p>{selectedRecord.before}{selectedRecord.date}{selectedRecord.after}</p>
          </div>
        )}
      </Modal>
    </div> 
  );
};
export default App;