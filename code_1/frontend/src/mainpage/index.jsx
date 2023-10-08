import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  EditOutlined,
  DeleteOutlined,
  SnippetsOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import {
  useNavigate
} from 'react-router-dom';
import { Layout, Menu, Button, theme, Space, Calendar } from 'antd';
const { Header, Sider, Content } = Layout;
const onPanelChange = (value, mode) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};

function App ( props ) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  function onMenuChange ({key, keyPath}) {
    console.log(key, keyPath);
    if (key !== "logout") {
      navigate(`/mainpage/${key}`);
    } else {
      navigate(`/`);
    }
  }

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
                  width: 64,
                  height: 64,
                }}
              />
            </Space>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <div style={wrapperStyle}>
              <Calendar fullscreen={false} onPanelChange={onPanelChange} />
            </div>
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default App;