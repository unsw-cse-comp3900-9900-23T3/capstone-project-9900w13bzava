import React, { useState, useRef, useEffect } from 'react';
import { Button, DatePicker, Space, Checkbox, notification } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import './index.css'

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const columWidth = 570;
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
  const [isCheckBox, setIsCheckBox] = useState('none');
  const [allUsersName, setAllUsersName] = useState([])
  const tokenRef = useRef(token);
  const [allID, setAllID] = useState([]); 

  async function fGetSpecRangeStatusStatistics() {
    if (allID.length === 0 && tokenRef.current === '0') {
      notification.open({
        message: 'Error',
        type: 'error',
        description:
        // error message
            `Please choose a doctor at least`,
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    } else {
      const response = await fetch('http://127.0.0.1:5000/GetSpecRangeStatusStatistics', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          ...(tokenRef.current !== '0' ? {
            "userid": [{'id': tokenRef.current}],
            "predate": selectedRange1[0],
            "lastdate": selectedRange1[1],
          } : {
            "userid": allID,
            "predate": selectedRange1[0],
            "lastdate": selectedRange1[1],
          }
          )
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
    
    
  }

  async function fGetSpecRangeAppNumStatistics() {
    const response = await fetch('http://127.0.0.1:5000/GetSpecRangeAppNumStatistics', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        ...(tokenRef.current !== '0' ? {
          "userid": [{'id': tokenRef.current}],
          "predate": selectedRange2[0],
          "lastdate": selectedRange2[1],
        } : {
          "userid": allID,
          "predate": selectedRange2[0],
          "lastdate": selectedRange2[1],
        }
        )
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

  function onAllID(e) {
    
    if (e.target.checked) {
      const temp = allID.map(item => ({ ...item }));
      temp.push(
        {'id': e.target.value}
      )
      setAllID(temp)
    } else {
      const temp = allID.filter(item => item.id !== e.target.value);
      setAllID(temp)
    }
    
  }

  useEffect(() => {
    if (tokenRef.current === '0') {
      setIsCheckBox('flex')
    }
    async function fGetAllUsers() {
      const response = await fetch('http://127.0.0.1:5000/GetAllUsers', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();
      const temp = data.allUsers.map(item => {
        return {
          value: item.userid,
          label: `${item.firstname} ${item.surname}`,
        }
      })
      temp.sort(function(a, b) {
        const valueA = a.label.toLowerCase();
        const valueB = b.label.toLowerCase();
        return valueA.localeCompare(valueB);
      });
      console.log(temp)
      setAllUsersName(temp)
    }
    fGetAllUsers() 
  }, [])

  return (
    <div>
      <Space style={{ display: isCheckBox }} size={[8, 16]} wrap>
        <div style={{ marginLeft: 30, fontWeight: 'bold', fontSize: 15 }}>
          Choose doctors:
        </div>
        {allUsersName.map((user, index) => (
          user.label !== 'administrator ' ? (
            <Checkbox
              key={index}
              value={user.value}
              style={{
                display: "flex",
                fontSize: 15,
                whiteSpace: 'nowrap'
              }}
              onChange={(e) => onAllID(e)}
            >
              {user.label}
            </Checkbox>
          ) : null
        ))}
      </Space>
      <br/>
      <Space size='small'>
        <Space direction='vertical'>
          <div style={{display: "flex", marginLeft:30, fontWeight: 'bold', fontSize: 15}}>
            Different status's appointments between {selectedRange1[0]} and {selectedRange1[1]}
          </div>
          <Space style={{display: "flex", marginLeft: 30}}>
            <RangePicker
              style={{display: "flex", width: rangeWidth}}
              defaultValue={defaultRange1}
              onChange={(e, dataString) => {
                setSelectedRange1(dataString);
              }}
            />
            <Button onClick={() => fGetSpecRangeStatusStatistics()} style={{marginLeft: 140, backgroundColor: "#C3F3EE", fontWeight:'bold', width: 100}}>
              OK
            </Button>
          </Space>
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
            <Bar dataKey="amount" fill="#FECD52"/>
          </BarChart>
        </Space>
        <Space direction='vertical'>
          <div style={{display: "flex", marginLeft:30, fontWeight: 'bold', fontSize: 15}}>
            The sum of appointments between {selectedRange2[0]} and {selectedRange2[1]}
          </div>
          <Space style={{display: "flex", marginLeft: 30}}>
            <RangePicker
              style={{display: "flex", width: rangeWidth}}
              defaultValue={defaultRange2}
              onChange={(e, dataString) => {
                setSelectedRange2(dataString);
              }}
            />
            <Button onClick={() => fGetSpecRangeAppNumStatistics()} style={{marginLeft: 140, backgroundColor: "#C3F3EE", fontWeight:'bold', width: 100}}>
              OK
            </Button>
          </Space>
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
            <Bar dataKey="amount" fill="#FECD52" />
          </BarChart>
          
        </Space>
      </Space>
    </div>
  );
}

export default App;