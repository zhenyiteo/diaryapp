import {
    AntCloudOutlined,
    ArrowLeftOutlined,
    MailOutlined,
    SettingOutlined,
    UserOutlined
  } from '@ant-design/icons';
  import { Avatar, Menu } from 'antd';
  import { useEffect } from 'react';
  import { Outlet, useNavigate } from 'react-router-dom';
  import styles from './layout.module.css';
  
  export default function Layout() {
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!window.location.hash || window.location.hash === '#/') {
        navigate('/pendingContract');
      }
    }, []);
  
    const handleLogout = () => {
  
      navigate("/");
    };
  
    return (
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AntCloudOutlined style={{ fontSize: 60, color: '#4444ff' }} />
            <span style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 10 }}>
              Admin
            </span>
          </div>
          <Menu
            onClick={(e) => {
              console.log(e);
              navigate(e.key);
            }}
            style={{ width: 256 }}
            defaultSelectedKeys={['/pendingContract']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={[
              {
                key: '/admin/pendingContract',
                icon: <MailOutlined />,
                label: 'Pending Contracts ',
              },
              {
                key: '/admin/contractHistory',
                icon: <MailOutlined />,
                label: 'Contract History',
              },
            ]}
          />
  
          <div style={{ flex: 1 }}></div>
          <SettingOutlined />
          <div style={{ marginTop: 10, cursor:"pointer" }} onClick={handleLogout}>
            <ArrowLeftOutlined style={{ marginRight: 10 }} />
            Logout
          </div>
          <div style={{ display: 'flex', marginTop: 10 }}>
            <Avatar shape="square" size="large" icon={<UserOutlined />} />
            <div style={{ marginLeft: 10 }}>
              <div>Admin</div>
              <div style={{ color: '#aaa' }}>admin@gmail.com</div>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.outletContent}>
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    );
  }