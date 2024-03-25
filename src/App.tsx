import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Homepage from './views/Homepage';
import Calendar from './views/Calendar';
import Info from './views/Info';
import CalendarDetails from './views/Calendar/detail';
import Chatbot from './views/Chatbot';
import SentimentAnalysis from './views/SentimentAnalysis';
import { MessageOutlined, HomeOutlined, CalendarOutlined, BarChartOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './App.css';
import { Layout, Menu, Tooltip } from 'antd';
import { ThemeProvider } from './ThemeContext.jsx';
import helmetIco from './helmetico.ico';

const { Header, Sider, Content } = Layout;


const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    const content = document.querySelector('.site-content');
    if (content) {
      content.scrollTop = 0;
    }
  }, [location]); 

  return (
    <Routes>
      <Route path="/home" element={<Homepage />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/info" element={<Info />} />
      <Route path="/calendar/details" element={<CalendarDetails />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
    </Routes>
  );
};

// Main App component
const App = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <ThemeProvider>
      <Router>
        <Helmet>
          <title>Diaryapp</title>
          <link rel="icon" type="image/x-icon" href={helmetIco} />
        </Helmet>
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
                <Menu.Item key="3" icon={<MessageOutlined />}>
                  <Tooltip placement="right" title={collapsed ? "Chatbot" : ""}>
                    <Link to="/chatbot">Chatbot</Link>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item key="4" icon={<BarChartOutlined />}>
                  <Tooltip placement="right" title={collapsed ? "Sentiment Analysis" : ""}>
                    <Link to="/sentiment-analysis">Sentiment Analysis</Link>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item key="5" icon={<InfoCircleOutlined />}>
                  <Tooltip placement="right" title={collapsed ? "Info" : ""}>
                    <Link to="/info">Info</Link>
                  </Tooltip>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Content className="site-content">
                <AppRoutes /> 
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
