import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { Table } from 'antd';
import './Sentiment.css'; 

// Sample data for the line chart
const moodData = [
  { date: '2024-03-01', happiness: 3, sadness: 1, anger: 1 },
  { date: '2024-03-02', happiness: 4, sadness: 2, anger: 0 },
  { date: '2024-03-03', happiness: 2, sadness: 3, anger: 1 },
  // ... more data
];

// Sample data for the pie chart
const moodDistribution = [
  { name: 'Happiness', value: 10 },
  { name: 'Sadness', value: 7 },
  { name: 'Anger', value: 3 },
];

// Colors for pie chart
const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

// Columns configuration for the table
const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Mood',
    dataIndex: 'mood',
    key: 'mood',
  },
  {
    title: 'Entry',
    dataIndex: 'entry',
    key: 'entry',
  },
];

// Sample data for the table
const moodEntries = [
  { key: '1', date: '2024-03-01', mood: 'Happy', entry: 'Had a great day!' },
  { key: '2', date: '2024-03-02', mood: 'Sad', entry: 'It was a tough day.' },
  // ... more entries
];

const SentimentAnalysis = () => {
  return (
    <div style={{ margin: '0 auto', maxWidth: 1000 }}>
      <h1>Sentiment Analysis</h1>
        <h3>Discover the sentiments within your diary entries through sentiment analysis, powered by AWS Comprehend.</h3>
      {/* Mood Over Time Line Chart */}
      <div >
      <div style={{ margin: '50px 0' }}>
        <h2>Mood Over Time</h2>
        <LineChart
          width={900}
          height={300}
          data={moodData}
          margin={{ top: 5, right: 30, bottom: 5, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="happiness" stroke="#8884d8" />
          <Line type="monotone" dataKey="sadness" stroke="#82ca9d" />
          <Line type="monotone" dataKey="anger" stroke="#ffc658" />
        </LineChart>
      </div>

      {/* Mood Distribution Pie Chart */}
      <div style={{ margin: '50px 0' }}>
        <h2>Mood Distribution</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={moodDistribution}
            cx={200}
            cy={200}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {moodDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
        
      </div>

      {/* Mood Entries Table */}
      <div style={{ marginTop: '50px' }}>
        <h2>Detailed Mood Entries</h2>
        <Table dataSource={moodEntries} columns={columns} pagination={false} />
      </div>
    </div>
    </div>
  );
};

export default SentimentAnalysis;