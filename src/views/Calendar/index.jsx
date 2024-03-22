import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './index.module.css'; 
import dayjs from 'dayjs';
import { Alert } from 'antd';
import { useNavigate } from 'react-router-dom';

function useSingleAndDoubleClick(actionSimpleClick, actionDoubleClick, delay = 250) {
  let clickTimer = null;

  return (date) => {
    if (clickTimer === null) {
      clickTimer = setTimeout(() => {
        actionSimpleClick(date);
        clickTimer = null;
      }, delay);
    } else {
      clearTimeout(clickTimer);
      clickTimer = null;
      actionDoubleClick(date);
    }
  };
}

const Cal = () => {
  const currentDate = dayjs();
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const [alertMessage, setAlertMessage] = useState(`Today: ${currentDate.format('YYYY-MM-DD')}`);

  const handleSingleClick = (newValue) => {
    setValue(newValue);
    setAlertMessage(`Selected date: ${dayjs(newValue).format('YYYY-MM-DD')}`);
  };

  const handleDoubleClick = (newValue) => {
    navigate(`/calendar/details`, { state: { date: dayjs(newValue).format('YYYY-MM-DD') } });
  };

  const handleDateClick = useSingleAndDoubleClick(handleSingleClick, handleDoubleClick);

  return (
    <div style={{ height: 'auto', display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <h2>Choose a Date</h2>
      <Alert message={alertMessage} />
      <div style={{ flex: 1, overflow: 'auto', width: '600px', margin: 'auto' }}>
        <Calendar
          value={value}
          onClickDay={handleDateClick}
          calendarType="US"
          className={styles.customCalendar} 
        />
      </div>
    </div>
  );
};

export default Cal;