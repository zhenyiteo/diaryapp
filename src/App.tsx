import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './views/Homepage';
import Calendar from './views/Calendar';
import Settings from './views/Settings';
import CalendarDetails from './views/Calendar/detail';
import Chatbot from './views/Chatbot';
import { MessageOutlined, HomeOutlined, CalendarOutlined, SettingOutlined } from '@ant-design/icons';

import { Layout, Menu, Tooltip } from 'antd';
import { ThemeProvider } from './ThemeContext.jsx';

const { Header, Sider, Content } = Layout;

const App = () => {
  // State to control the collapsed status of the Sider
  const [collapsed, setCollapsed] = useState(true);

  return (
    <ThemeProvider>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ textAlign: 'center', padding: '10px 0', background: 'rgba(255, 255, 255, 0.5)' }}>
            {/* Logo */}
            <Link to="/home">
              <img
                src="https://i.postimg.cc/KYVGJvb5/diaryapp-high-resolution-logo-transparent.png"
                alt="diaryapplogo"
                style={{ maxWidth: '50%', maxHeight: '25px' }}
              />
            </Link>
          </Header>

          <Layout>
            <Sider width={200} theme="light" collapsible collapsed={collapsed} onCollapse={setCollapsed}
                   onMouseEnter={() => setCollapsed(false)} onMouseLeave={() => setCollapsed(true)}>
              {/* Navigation Menu */}
              <Menu mode="inline" theme="light" style={{ borderRight: 0 }}>
                <Menu.Item key="1" icon={<HomeOutlined />}>
                  <Tooltip placement="right" title={collapsed ? "Home" : ""}>
                    <Link to="/home">Home</Link>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item key="2" icon={<CalendarOutlined />}>
                  <Tooltip placement="right" title={collapsed ? "Calendar" : ""}>
                    <Link to="/calendar">Calendar</Link>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item key="3" icon={<SettingOutlined />}>
                  <Tooltip placement="right" title={collapsed ? "Settings" : ""}>
                    <Link to="/settings">Settings</Link>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item key="4" icon={<MessageOutlined />}>
                  <Tooltip placement="right" title={collapsed ? "Chatbot" : ""}>
                    <Link to="/chatbot">Chatbot</Link>
                  </Tooltip>
                </Menu.Item>
              </Menu>
            </Sider>

            <Layout>
              <Content style={{ padding: '24px' }}>
                <Routes>
                  <Route path="/home" element={<Homepage />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/calendar/details" element={<CalendarDetails />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;