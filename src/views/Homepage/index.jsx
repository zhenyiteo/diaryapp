import React from 'react';
import { Timeline, Card } from 'antd';


const Homepage = () => {
  // Dummy data for diary history
  const diaryHistory = [
    { date: '2022-01-01', content: 'content 1' },
    { date: '2022-01-05', content: 'content 2' },
    { date: '2022-01-05', content: 'content 3' },
    { date: '2022-01-05', content: 'ok' },
    { date: '2022-01-05', content: '4' },
    // Add more entries as needed
  ];

  return (
    <div>
      <h2>{`Diary Timeline`}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', overflowY: 'auto', flex: 1, padding: '20px' }}>
          <Timeline mode="left">
            {diaryHistory.map((entry, index) => (
              <Timeline.Item key={index} label={entry.date}>
                <Card title={entry.date} style={{ width: 300 }}>
                  {entry.content}
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>
      {/* Add the Chatbot component */}
      
    </div>
  );
};

export default Homepage;