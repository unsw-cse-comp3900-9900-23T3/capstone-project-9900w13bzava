import React from 'react';
import {
  LogoutOutlined,
  DatabaseOutlined,
  SolutionOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import {
  useNavigate
} from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
const { Sider, Content } = Layout;
const heightContent = 600

function App ( props ) {
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  function onMenuChange ({key, keyPath}) {
    console.log(key, keyPath);
    if (key !== "logout") {
      navigate(`/mainpage/${key}`);
    } else {
      localStorage.clear();
      navigate(`/`);
    }
  }

  return (
    <div className="background">
      <Layout>
        <Sider trigger={null} width={180}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            onClick={onMenuChange}
            items={[
              {
                key: 'appointments',
                icon: <DatabaseOutlined />,
                label: 'Appointments',
              },
              {
                key: 'record',
                icon: <SolutionOutlined />,
                label: 'Record',
              },
              {
                key: 'statistic',
                icon: <BarChartOutlined />,
                label: 'Statistic',
              },
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Log out',
              },
            ]}
          />
        </Sider>
        <Layout>
          <Content
            style={{
              margin: 10,
              padding: 24,
              height: heightContent,
              background: colorBgContainer,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className='backgroundChild'
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default App;