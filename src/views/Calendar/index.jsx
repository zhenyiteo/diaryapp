import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Alert, Calendar } from 'antd';
import { useNavigate } from 'react-router-dom';

const Cal = () => {
  const currentDate = dayjs(); // Get the current date
  const navigate = useNavigate(); // Hook for programmatic navigation

  const [value, setValue] = useState(currentDate);
  const [selectedValue, setSelectedValue] = useState(currentDate);

  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);

    // Redirect to the details page with the selected date
    //last time code
    //const handleItemClick = (item) => {
    // navigate('/shipper/shipperJobHistoryDetail?JobID=' + item.JobID)
  

    const dateParam = newValue.format('YYYY-MM-DD');
    navigate(`/calendar/details/${dateParam}`);
  };


  const onPanelChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ height: ' auto', display: 'flex', flexDirection: 'column' }}>
      <Alert message={`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`} />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange } fullscreen={false} />
      </div>
    </div>
  );
};

export default Cal;