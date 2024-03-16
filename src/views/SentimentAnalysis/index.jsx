import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { Table, Button } from 'antd';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './Sentiment.css';

const COLORS = ['#F78888', '#8CCB9B', '#90AFC5', '#C789F2'];

const SentimentAnalysis = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [moodCount, setMoodCount] = useState([]);

  useEffect(() => {
    axios.get('https://bbzp4vxfog.execute-api.us-east-1.amazonaws.com/prod/resource')
      .then(response => {
        const data = JSON.parse(response.data.body);
  
        let transformedEntries = data.map(item => {
          const sentimentScores = JSON.parse(item.sentimentScore);

          return {
            key: item.key,
            date: item.date,
            mood: item.mood,
            entry: item.entry,
            sentimentScore: sentimentScores,
          };
        });

        transformedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

        const moodDataMapping = transformedEntries.reduce((acc, entry) => {
          const date = entry.date;
          if (!acc[date]) {
            acc[date] = { date };
            Object.keys(entry.sentimentScore).forEach(mood => {
              acc[date][mood] = entry.sentimentScore[mood];
            });
          } else {
            Object.keys(entry.sentimentScore).forEach(mood => {
              acc[date][mood] = (acc[date][mood] || 0) + entry.sentimentScore[mood];
            });
          }
          return acc;
        }, {});

        

        setMoodData(Object.values(moodDataMapping));

        const moodCountMapping = transformedEntries.reduce((acc, entry) => {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
          return acc;
        }, {});

        setMoodCount(Object.entries(moodCountMapping).map(([name, value]) => ({name, value})));

        setMoodEntries(transformedEntries.map(entry => ({
          ...entry,
          confidenceScore: Math.max(...Object.values(entry.sentimentScore)).toFixed(2),
          sentimentScore: Object.entries(entry.sentimentScore)
                              .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                              .join('\n')
        })));
      })
      .catch(error => {
        console.error('There was an error fetching the mood entries:', error);
      });
  }, []);

  const exportToExcel = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mood Data');
    if(!ws['!cols']) ws['!cols'] = [];
    ws['!cols'][0] = { width: 20 };
    const exportFileName = `${fileName}.xlsx`;
    XLSX.writeFile(wb, exportFileName);
  };

  const handleExport = () => {
    exportToExcel(moodEntries, 'MoodEntries');
  };

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
      title: 'Confidence Score',
      dataIndex: 'confidenceScore',
      key: 'confidenceScore',
    },
    {
      title: 'Entry',
      dataIndex: 'entry',
      key: 'entry',
    },
    {
      title: 'Sentiment Score',
      dataIndex: 'sentimentScore',
      key: 'sentimentScore',
      render: (text) => (
        <pre>{text}</pre>
      ),
    },
  ];

  return (
    <div style={{ margin: '0 auto', maxWidth: 1000 }}>
      <h1>Sentiment Analysis</h1>
      <div style={{ margin: '50px 0' }}>
        <h2>Mood Over Time</h2>
        <LineChart width={900} height={300} data={moodData} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="positive" name="Positive" stroke="#8CCB9B" />
  <Line type="monotone" dataKey="neutral" name="Neutral" stroke="#90AFC5" />
  <Line type="monotone" dataKey="negative" name="Negative" stroke="#F78888" />
  <Line type="monotone" dataKey="mixed" name="Mixed" stroke="#C789F2" />
</LineChart>
      </div>
      <div style={{ margin: '50px 0' }}>
        <h2>Mood Distribution</h2>
              <PieChart width={400} height={400}>
        <Pie data={moodCount} cx={200} cy={200} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
          {moodCount.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '50px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Detailed Mood Entries</h2>
        <Button type="primary" onClick={handleExport}>
          Export to Excel
        </Button>
      </div>
      <Table dataSource={moodEntries} columns={columns} pagination={false} />
    </div>
  );
};

export default SentimentAnalysis;