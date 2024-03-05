import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // For accessing router state
import { Spin, Alert } from 'antd'; // For loading spinner and alerts
import './CalendarDetails.css';

const CalendarDetails = () => {
  const location = useLocation(); // Access location to get state passed from the calendar
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch diary entries based on a given date
  const fetchDiaryEntries = async (date) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://puvce27hej.execute-api.us-east-1.amazonaws.com/prod/resource?date=${date}`);
      setEntries(response.data); // Assuming the API returns an array of entries
    } catch (err) {
      console.error("Error fetching diary entries:", err);
      setError('Failed to fetch diary entries. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect to fetch diary entries when the component mounts or the date changes
  useEffect(() => {
    const date = location.state?.date; // Extract the date passed via router state
    if (date) {
      fetchDiaryEntries(date);
    }
  }, [location.state?.date]);

  return (
    <div className="container">
      <h2 className="header">Diary Entries for {location.state?.date}</h2>
      {isLoading ? (
        <Spin tip="Loading diary entries..." />
      ) : error ? (
        <div className="alert">
          <Alert message={error} type="error" showIcon />
        </div>
      ) : entries.length > 0 ? (
        entries.map((entry, index) => (
          <div key={index} className="entry">
            <h3 className="entryTitle">{entry.title}</h3>
            <p className="entryDate">Date: {entry.date}</p>
            <p className="entryMood">Mood: {entry.mood}</p>
            <p className="entryContent">{entry.content}</p>
          </div>
        ))
      ) : (
        <p>No entries found for this date.</p>
      )}
    </div>
  );
};

export default CalendarDetails;