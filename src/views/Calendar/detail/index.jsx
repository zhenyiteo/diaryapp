import React from 'react';
import { Button } from 'antd';

const CalendarDetails = (props) => {
  // Ensure props.location is defined before trying to access state
  const { location } = props;
  const date = location?.state?.date;

  // Fetch or display diary entry for the selected date

  const handleEdit = () => {
    // Navigate to the edit page with the selected date
    // You can replace this with your actual navigation logic
    console.log(`Editing diary entry for ${date}`);
  };

  return (
    <div>
      <h2>{`Diary Entry for ${date}`}</h2>
      {/* Display the diary entry content here */}
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      {/* Edit button */}
      <Button type="primary" onClick={handleEdit}>
        Edit Entry
      </Button>
    </div>
  );
};

export default CalendarDetails;