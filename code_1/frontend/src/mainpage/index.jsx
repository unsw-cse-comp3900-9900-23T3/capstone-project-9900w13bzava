import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  EditOutlined,
  DeleteOutlined,
  SnippetsOutlined,
  LogoutOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import {
  useNavigate
} from 'react-router-dom';
import { Layout, Menu, Button, theme, Space, DatePicker } from 'antd';
const { Header, Sider, Content } = Layout;
const heightContent = 500

function App ( props ) {
  
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  function onMenuChange ({key, keyPath}) {
    console.log(key, keyPath);
    if (key !== "logout") {
      navigate(`/mainpage/${key}`);
    } else {
      navigate(`/`);
    }
  }

  const onDateChange = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <div className="background">
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            onClick={onMenuChange}
            items={[
              {
                key: 'show',
                icon: <DatabaseOutlined />,
                label: 'Show',
              },
              {
                key: 'create',
                icon: <SnippetsOutlined />,
                label: 'Create',
              },
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Edit',
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: 'Delete',
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
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Space>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 50,
                  height: 50,
                }}
              />
              <DatePicker onChange={onDateChange} />
            </Space>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              height: heightContent,
              background: colorBgContainer,
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