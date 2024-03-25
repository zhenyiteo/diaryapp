import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import { Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const StyledAlert = styled(Alert)`
  margin-bottom: 20px;
  border-radius: 5px;
  .ant-alert-icon {
    display: none;
  }
`;

const CalendarContainer = styled.div`
  max-width: 1200px; 
  
  width: 100%; 
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  .react-calendar {
    border-radius: 20px;
    width: 150%;
    border: none;
    font-size: 1.7em; 
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background: #f0f2f5;
    color: #1890ff;
    border-radius: 5px;
  }
  .react-calendar__tile--active {
    background: #1890ff;
    color: white;
    border-radius: 5px;
  }
`;

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
    <Container>
      <h2>Choose a Date</h2>
      <StyledAlert message={alertMessage} type="info" />
      <CalendarContainer>
        <Calendar
          value={value}
          onClickDay={handleDateClick}
          calendarType="US"
        />
      </CalendarContainer>
    </Container>
  );
};

export default Cal;
