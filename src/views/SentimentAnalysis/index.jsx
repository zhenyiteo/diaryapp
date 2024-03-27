import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Table, Button, Input, message, Modal } from 'antd'; 
import './Sentiment.css';
import * as XLSX from 'xlsx';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid } from 'recharts';
import { notification } from 'antd';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;


const COLORS = ['#F78888', '#8CCB9B', '#90AFC5', '#C789F2'];

const moodColorMapping = {
  positive: '#8CCB9B',
  neutral: '#90AFC5',
  mixed: '#C789F2',
  negative: '#F78888',
};

const SentimentAnalysis = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [moodCount, setMoodCount] = useState([]);
  const [jobId, setJobId] = useState('');
  const [userInputJobId, setUserInputJobId] = useState('');
  const [error, setError] = useState('');
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false); 
  const [dateRange, setDateRange] = useState([]);

  const handleSentimentAnalysis = async () => {
    setIsConfirmationModalVisible(true); 
  };

  const startSentimentAnalysis = async () => {
    try {
      const response = await axios.post('https://pnlwmxtxkl.execute-api.us-east-1.amazonaws.com/prod/resource');
      const { JobId } = response.data;
      setJobId(JobId);
      setError(null); 

      notification.success({
        message: 'Sentiment Analysis Started',   
        description: `Your sentiment analysis has started successfully. Please wait for 10 minutes before pasting to it process result.Your Job ID is ${JobId}.`,
        duration: 10, 
      });


    } catch (error) {
      console.error('Error starting sentiment analysis:', error);
      setError('Error starting sentiment analysis. Please try again.'); // Set error message

      notification.error({
        message: 'Error Starting Sentiment Analysis',
        description: 'There was an error starting sentiment analysis. Please try again later.',
        duration: 5,
      });
      
    }
    setIsConfirmationModalVisible(false); 
  };

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
            moodColor: moodColorMapping[item.mood]
          };
        });

        transformedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

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

  const processResults = async () => {
    if (!userInputJobId || userInputJobId.length < 20) {
      message.error('Wrong format Job ID');
      return;
    }

    const apiUrl = 'https://mtclfro3q4.execute-api.us-east-1.amazonaws.com/production/resource';

    try {
      const payload = { body: JSON.stringify({ JobId: userInputJobId }) };
      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response data:', response.data); 
      message.success('Results processed successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error processing results:', error);
      message.error('Failed to process results. Please try again.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jobId)
      .then(() => {
        message.success('Job ID copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const exportToExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const fileName = 'mood_data';
    const exportedData = moodEntries.map(({ key, date, mood, entry, confidenceScore, sentimentScore }) => ({
      Key: key,
      Date: date,
      Mood: mood,
      Entry: entry,
      'Confidence Score': confidenceScore,
      'Sentiment Score': sentimentScore
    }));
    const ws = XLSX.utils.json_to_sheet(exportedData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName + fileExtension;
    link.click();
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

  const moodToNumeric = {
    negative: 0,
    mixed: 1,
    neutral: 2,
    positive: 3,
  };

  const convertDateToNumber = (dateStr) => {
    return new Date(dateStr).getTime();
  };

  
  const filteredScatterData = moodEntries.filter(entry => {
    if (dateRange.length !== 2) {
      return true; 
    }
    const [start, end] = dateRange;
    const entryDate = new Date(entry.date);
    const inclusiveEndDate = new Date(end);
    inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1); 
    return entryDate >= start && entryDate < inclusiveEndDate;
  }).map(entry => ({
    ...entry,
    date: new Date(entry.date).toLocaleDateString(),
    moodValue: moodToNumeric[entry.mood.toLowerCase()],
    moodColor: moodColorMapping[entry.mood.toLowerCase()]
  }));


  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>Date: {data.date}</p>
          <p>Mood: {data.mood.charAt(0).toUpperCase() + data.mood.slice(1)}</p>
          <p>Confidence: {data.confidenceScore}</p>
        </div>
      );
    }
  
    return null;
  };

  useEffect(() => {
    if (dateRange.length === 2) {
      const [start, end] = dateRange;
      const inclusiveEndDate = new Date(end);
      inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
  
      const filteredEntries = moodEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate < inclusiveEndDate; 
      });
  
      const moodCountMapping = filteredEntries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {});
  
      setMoodCount(Object.entries(moodCountMapping).map(([name, value]) => ({name, value})));
    }
  }, [dateRange, moodEntries]);

  


  return (
    <div style={{ margin: '0 auto', maxWidth: 1000, padding: '20px' }}>
  <h1 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Sentiment Analysis</h1>

  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
    
    <div style={{ padding: '20px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px', maxWidth: '45%', textAlign: 'center', alignSelf: 'center' }}>
      <Button type="primary"  onClick={handleSentimentAnalysis}>Start Sentiment Analysis</Button>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Job ID:</span>
        <Input readOnly value={jobId} style={{ width: '250px' }} />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>

    <div style={{ fontSize: '16px', color: '#555', textAlign: 'center', maxWidth: '60%', alignSelf: 'center' }}>
      Please wait for about 10 minutes after starting the sentiment analysis before attempting to process results.
    </div>

    <div style={{ padding: '20px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px', maxWidth: '45%', textAlign: 'center', alignSelf: 'center' }}>
      <Input
        value={userInputJobId}
        onChange={(e) => setUserInputJobId(e.target.value)}
        placeholder="Enter Job ID"
        style={{ width: 'calc(100% - 120px)', marginBottom: '10px' }}
        maxLength={50}
      />
      <Button type="primary"  onClick={processResults}>Process Results</Button>
    </div>
    
  </div>

  {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

  <Modal
    title="Are you ready to start the Sentiment Analysis?"
    visible={isConfirmationModalVisible}
    onCancel={() => setIsConfirmationModalVisible(false)}
    onOk={startSentimentAnalysis}
    okText="Start"
    cancelText="Cancel"
  >
    Initiating sentiment analysis will generate a new job ID. Are you sure you want to proceed?
  </Modal>



  
      
  <div style={{ margin: '100px 0', fontSize: '16px', color: '#555' }}>
  <h2>Sentiment Analysis Result </h2>
  <span style={{ marginRight: '8px' }}>Select Date Range:</span>
  <RangePicker onChange={(dates) => setDateRange(dates)} />
</div>
      


      

    

      {filteredScatterData.length > 0 ? (
  <div style={{ margin: '50px 0', textAlign: 'center' }}>
    <h2>Mood by Date </h2>
    
    <ScatterChart width={900} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid />
      <XAxis type="category" dataKey="date" name="Date" />
      <YAxis
        type="number"
        dataKey="moodValue"
        name="Mood"
        domain={['auto', 'auto']}
        tickFormatter={(value) => {
          switch (value) {
            case 0:
              return 'Negative';
            case 1:
              return 'Mixed';
            case 2:
              return 'Neutral';
            case 3:
              return 'Positive';
            default:
              return '';
          }
        }}
      />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
      <Legend />
      <Scatter name="mood over time scatter chart" data={filteredScatterData} fill="#800080">
        {filteredScatterData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.moodColor} />
        ))}
      </Scatter>
    </ScatterChart>
  </div>
) : (
  <div style={{ margin: '50px 0', textAlign: 'center' }}>
    <h2>Mood by Date </h2>
    <p>No data available for the selected range </p>
  </div>
)}




{moodCount.length > 0 ? (
  <div style={{ margin: '50px 0', textAlign: 'center' }}>
    <h2>Mood Distribution</h2>
    <PieChart width={950} height={450}>
      <Pie
        data={moodCount}
        cx={470}
        cy={200}
        outerRadius={120}
        dataKey="value"
        nameKey="name"
        animationBegin={0}
        animationDuration={400}
      >
        {moodCount.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </div>
) : (
  <div style={{ margin: '50px 0', textAlign: 'center' }}>
    <h2>Mood Distribution</h2>
    <p>No data available for the selected range</p>
  </div>
)}

      <div style={{ marginBottom: '20px' , textAlign: 'center'}}>
      <h2>Full Data</h2>
  
  <Button type="primary" onClick={exportToExcel} style={{ marginLeft: '20px' }}>Export to Excel</Button>
</div>

      <Table dataSource={moodEntries} columns={columns} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default SentimentAnalysis;
