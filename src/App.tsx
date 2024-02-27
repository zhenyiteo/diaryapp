import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './views/Homepage';
import Calendar from './views/Calendar';
import Settings from './views/Settings';
import CalendarDetails from './views/Calendar/detail';
import Chatbot from './views/Chatbot';
import { MessageOutlined } from '@ant-design/icons';


import { Layout, Menu } from 'antd';
import { HomeOutlined, CalendarOutlined, SettingOutlined } from '@ant-design/icons';
import { ThemeProvider } from './ThemeContext.jsx';

const { Header, Sider, Content } = Layout;

const App = () => (
  <ThemeProvider>
  <Router>
    <Layout style={{ minHeight: '50vh' }}>
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
        <Sider width={200} theme="light">
          {/* Navigation Menu */}
          <Menu mode="vertical" theme="light" style={{ borderRight: 0 }}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<CalendarOutlined />}>
              <Link to="/calendar">Calendar</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<SettingOutlined />}>
              <Link to="/settings">Settings</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<MessageOutlined />}>
              <Link to="/chatbot">Chatbot</Link>
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
              <Route path="/Chatbot" element={<Chatbot />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </Router>
  </ThemeProvider>
);

export default App;