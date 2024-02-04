import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import { Alert } from 'antd';
import { useNavigate } from 'react-router-dom';

const Cal = () => {
  const currentDate = dayjs(); // Get the current date
  const navigate = useNavigate(); // Hook for programmatic navigation

  const [value, setValue] = useState(currentDate);
  const [selectedValue, setSelectedValue] = useState(currentDate);

  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);

    const dateParam = dayjs(newValue).format('YYYY-MM-DD');
    navigate(`/calendar/details`, { state: { date: newValue } }); // Pass the selected date to CalendarDetails
  };

  // Example: Add green color to specific dates
  const tileContent = ({ date, view }) => {
    if (view === 'month' && date.getDate() === 15) {
      return <div style={{ backgroundColor: 'black', borderRadius: '50%', height: '10px', width: '10px' }} />;
    }
    return null;
  };

  return (
    <div style={{ height: 'auto', display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <Alert message={`Today: ${selectedValue?.format('YYYY-MM-DD')}`} />
      <div style={{ flex: 1, overflow: 'auto', width: '600px', margin: 'auto' }}>
        <Calendar
          value={value.toDate()}
          onChange={onSelect}
          tileContent={tileContent}
          calendarType="US" // Set calendarType if needed
          className="custom-calendar" // Add a custom class for styling
          style={{ width: '100%', fontSize: '20px', padding: '20px' }} // Adjust styles for Calendar
          tileClassName={({ date }) => (date.getDate() === 15 ? 'green-tile' : null)} // Add custom class to specific dates
        />
      </div>
    </div>
  );
};

export default Cal;