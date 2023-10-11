import React from 'react';
import { Table, Space } from 'antd';
import "./index.css"

const hColumns = [
  {
    title: 'History',
    dataIndex: 'history',
    key: 'history',
    align: 'center',
    children: [
      {
        title: 'Time',
        dataIndex: 'hTime',
        key: 'hTime',
      },
      {
        title: 'Doctor name',
        dataIndex: 'hDoctor',
        key: 'hDoctor',
      },
    ]
  }
];
const fColumns = [
  {
    title: 'Future',
    dataIndex: 'future',
    key: 'future',
    align: 'center',
    children: [
      {
        title: 'Time',
        dataIndex: 'hTime',
        key: 'hTime',
      },
      {
        title: 'Doctor name',
        dataIndex: 'hDoctor',
        key: 'hDoctor',
      },
    ]
  }
];
const hData = [
  {
    key: '1',
    hTime: '07:45 am On 30/12/2022',
    hDoctor: 'Dr.Li',
  },
  {
    key: '2',
    hTime: '',
    hDoctor: '',
  },
  {
    key: '3',
    hTime: '',
    hDoctor: '',
  },
  {
    key: '4',
    hTime: '',
    hDoctor: '',
  },
  {
    key: '5',
    hTime: '',
    hDoctor: '',
  },
];
const fData = [
  {
    key: '1',
    hTime: '14:45 pm On 31/1/2024',
    hDoctor: 'Dr.Bob',
    height: '50px'
  },
  {
    key: '2',
    hTime: '',
    hDoctor: '',
  },
  {
    key: '3',
    hTime: '',
    hDoctor: '',
  },
  {
    key: '4',
    hTime: '',
    hDoctor: '',
  },
  {
    key: '5',
    hTime: '',
    hDoctor: '',
  },
];

function App ({ onSuccess }) {

  return (
    <div>
      <Space>
        <p>Patient name: Alan</p>
        <Table className="hTable" columns={hColumns} dataSource={hData} pagination={false} bordered scroll={{y:500}} size="small"/>
        <Table className='fTable' columns={fColumns} dataSource={fData} pagination={false} bordered scroll={{y:500}} size="small"/>
      </Space>
    </div> 
  );
};
export default App;