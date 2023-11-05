import React, { useState, useRef } from 'react';
import { Button, DatePicker, Space } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const columWidth = 500;
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
      if (item.value !== 0) {
        return {
          status: item.status,
          amount: item.value,
        }
      };
      return null;
    }).filter(item => item !== null)
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
      if (item.value !== 0) {
        return {
          date: item.date,
          amount: item.value,
        }
      };
      return null;
    }).filter(item => item !== null)
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
        <div style={{display: "flex", marginLeft:30}}>
          Different status's appointments between {selectedRange1[0]} and {selectedRange1[1]}
        </div>

        
        <BarChart
          width={columWidth}
          height={columHeight}
          data={chartData1}
          margin={{ top: 20, right: 40, left: -30, bottom: 50}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" angle={45} textAnchor="start"
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8"/>
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
        <div style={{display: "flex", marginLeft:30}}>
          The sum of appointments between {selectedRange2[0]} and {selectedRange2[1]}
        </div>
        
        <BarChart
          width={columWidth}
          height={columHeight}
          data={chartData2}
          margin={{ top: 20, right: 40, left: -30, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={45} textAnchor="start"/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
        
      </div>
    </Space>
  );
}

export default App;