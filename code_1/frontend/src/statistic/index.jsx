import React, { useState, useRef } from 'react';
import { Button, DatePicker, Space } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const columWidth = 400;
const columHeight = 400;
const defaultPreDate = "2023-11-01";
const defaultLastDate = "2023-11-13";
const rangeWidth = 250;

function App({ token }) {
  const defaultRange1 =[
    dayjs(defaultPreDate),
    dayjs(defaultLastDate),
  ];
  const defaultRange2 = [
    dayjs(defaultPreDate),
    dayjs(defaultLastDate),
  ];
  const [selectedRange1, setSelectedRange1] = useState([defaultPreDate, defaultLastDate]);
  const [selectedRange2, setSelectedRange2] = useState([defaultPreDate, defaultLastDate]);
  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const tokenRef = useRef(token);


  async function fGetSpecRangeStatusStatistics() {
    console.log("select:", selectedRange1, selectedRange1[0])
    const response = await fetch('http://127.0.0.1:5000/GetSpecRangeStatusStatistics', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        "userid": tokenRef.current,
        "predate": selectedRange1[0],
        "lastdate": selectedRange1[1],
      })
    });
    const data = await response.json();
    const temp = data.statusStatistics.map(item => {
      return {
        status: item.status,
        value: item.value,
      }
    })
    setChartData1(temp)
    
  }

  async function fGetSpecRangeAppNumStatistics() {
    console.log("select:", selectedRange2, selectedRange2[0])
    const response = await fetch('http://127.0.0.1:5000/GetSpecRangeAppNumStatistics', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        "userid": tokenRef.current,
        "predate": selectedRange2[0],
        "lastdate": selectedRange2[1],
      })
    });
    const data = await response.json();
    const temp = data.appNumStatistics.map(item => {
      return {
        date: item.date,
        value: item.value,
      }
    })
    setChartData2(temp)
  }

  return (
    <Space>
      <div>
        <Space style={{display: "flex", marginLeft: 30}}>
          <RangePicker
            style={{display: "flex", width: rangeWidth}}
            defaultValue={defaultRange1}
            onChange={(e, dataString) => {
              setSelectedRange1(dataString);
            }}
          />
          <Button onClick={() => fGetSpecRangeStatusStatistics()}>
            Status
          </Button>
        </Space>
        
        <BarChart
          width={columWidth}
          height={columHeight}
          data={chartData1}
          margin={{ top: 20, right: 30, left: -30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" tickCount={chartData1.length > 10 ? 10 : chartData1.length} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>
      <div>
        <Space style={{display: "flex", marginLeft: 30}}>
          <RangePicker
            style={{display: "flex", width: rangeWidth}}
            defaultValue={defaultRange2}
            onChange={(e, dataString) => {
              setSelectedRange2(dataString);
            }}
          />
          <Button onClick={() => fGetSpecRangeAppNumStatistics()}>
            Sum
          </Button>
        </Space>
        <BarChart
          width={columWidth}
          height={columHeight}
          data={chartData2}
          margin={{ top: 20, right: 30, left: -30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
        
      </div>
    </Space>
  );
}

export default App;