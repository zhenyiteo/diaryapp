// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './views/Homepage';
import Calendar from './views/Calendar';
import Settings from './views/Settings';
import { Layout, Menu } from 'antd';

const { Sider, Content } = Layout;

const App = () => (
  <Router>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={100} theme="light">
        <Menu mode="vertical" theme="light">
          <Menu.Item key="1">
            <Link to="/home">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/calendar">Calendar</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/settings">Settings</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content style={{ padding: '24px' }}>
          <Routes>
            <Route path="/home" element={<Homepage />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  </Router>
);

export default App;