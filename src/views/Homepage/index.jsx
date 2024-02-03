import React from 'react';
import { Timeline, Card } from 'antd';

const Homepage = () => {
  // Dummy data for diary history
  const diaryHistory = [
    { date: '2022-01-01', content: 'As the day unfolded, Carmen met up with her closest friends for a picnic in the park' },
    { date: '2022-01-05', content: 'carmennnnnnnnnnnnnnnnnnn' },
    { date: '2022-01-05', content: 'not carmen' },
    { date: '2022-01-05', content: 'ok' },
    { date: '2022-01-05', content: 'ok carmen' },
    // Add more entries as needed
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'flex-start',overflowY: 'auto', flex: 1, padding: '20px' }}>
        <Timeline mode="left" >
          {diaryHistory.map((entry, index) => (
            <Timeline.Item key={index} label={entry.date} >
              <Card title={entry.date} style={{ width: 300 }}>
                {entry.content}
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
};

export default Homepage;