import React from 'react';
import {
  LogoutOutlined,
  DatabaseOutlined,
  SolutionOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  useNavigate
} from 'react-router-dom';
import { Layout, Menu } from 'antd';
import "./index.css";
const { Header, Content } = Layout;
const heightContent = 550

function App ( props, {token} ) {
  const navigate = useNavigate();
  
  function onMenuChange ({key, keyPath}) {
    console.log(key, keyPath);
    if (key !== "logout") {
      navigate(`/mainpage/${key}`);
      console.log('xxx', token);
    } else {
      localStorage.clear();
      navigate(`/`);
    }
  }

  return (
    <div className='mainBackground'>
      <Layout>
        <Header 
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '1200px',
            marginLeft: 10,
            marginRight:10,
            paddingRight:30,
            paddingLeft: 30,
            backgroundColor: 'blue',
          }}
          className='mainHeader'
          >
          <Menu
            mode='horizontal'
            onClick={onMenuChange}
            style={{ width: '1100px', backgroundColor: 'transparent'}}
            className='mainMenu'
          >
            <Menu.Item key='appointments' icon={<DatabaseOutlined />} className='mainFont'>
              Appointments
            </Menu.Item>
            <Menu.Item key='record' icon={<SolutionOutlined />} className='mainFont'>
              Record
            </Menu.Item>
            <Menu.Item key='statistic' icon={<BarChartOutlined />} className='mainFont'>
              Statistic
            </Menu.Item>
            <Menu.Item key='settings' icon={<SettingOutlined />} className='mainFont'>
              Settings
            </Menu.Item>
            <Menu.Item key='logout' style={{marginLeft: 500}}icon={<LogoutOutlined />} className='mainFont'>
              Log out
            </Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Content
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 10,
              padding: 24,
              height: heightContent,
              width: '1200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className='mainContent'
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>

    </div>
    
  );
};
export default App;
