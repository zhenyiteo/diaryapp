import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Table, Button, Input, message, Modal } from 'antd'; // Import Modal directly from 'antd'
import './Sentiment.css';
import * as XLSX from 'xlsx';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid } from 'recharts';


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
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false); // State to manage visibility of confirmation modal

  const handleSentimentAnalysis = async () => {
    setIsConfirmationModalVisible(true); // Display confirmation modal
  };

  const startSentimentAnalysis = async () => {
    try {
      const response = await axios.post('https://pnlwmxtxkl.execute-api.us-east-1.amazonaws.com/prod/resource');
      const { JobId } = response.data;
      setJobId(JobId);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error starting sentiment analysis:', error);
      setError('Error starting sentiment analysis. Please try again.'); // Set error message
    }
    setIsConfirmationModalVisible(false); // Close confirmation modal after starting analysis
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
      console.log('Response data:', response.data); // Log the response data
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

  // Prepare data for the scatter plot
  const scatterData = moodEntries.map((entry) => ({
    ...entry,
    date: new Date(entry.date).toLocaleDateString(), // Convert date to a string in the desired format
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

  


  return (
    <div style={{ margin: '0 auto', maxWidth: 1000, padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Sentiment Analysis - Amazon Comprehend</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button type="primary" onClick={handleSentimentAnalysis}>Start Sentiment Analysis</Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Job ID:</span>
          <Input readOnly value={jobId} style={{ width: 'auto' }} />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
        <div>
          <Input
            value={userInputJobId}
            onChange={(e) => setUserInputJobId(e.target.value)}
            placeholder="Enter Job ID"
            style={{ width: '250px', marginRight: '10px' }}
            maxLength={50}
          />
          <Button type="primary" onClick={processResults}>Process Results</Button>
        </div>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Confirmation Modal */}
      <Modal
        title="Start Sentiment Analysis?"
        visible={isConfirmationModalVisible}
        onCancel={() => setIsConfirmationModalVisible(false)}
        onOk={startSentimentAnalysis}
        okText="Yes"
        cancelText="No"
      >
        Do you wish to initiate sentiment analysis ? This action will generate a job ID. Please wait for 10 minutes before sending the job ID to Process Results.
      </Modal>


      


      

    

    <div style={{ margin: '50px 0' }}>
      <h2>Mood by Date </h2>
      <ScatterChart width={800} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
  <CartesianGrid />
  <XAxis type="category" dataKey="date" name="Date" />
  <YAxis
  type="number"
  dataKey="moodValue"
  name="Mood"
  domain={['auto', 'auto']} // Let recharts determine the domain automatically
  tickFormatter={(value) => {
    switch (value) {
      case 0: return 'Negative';
      case 1: return 'Mixed';
      case 2: return 'Neutral';
      case 3: return 'Positive';
      default: return ''; // Handle undefined or unexpected values
    }
  }}
/>
  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
  <Legend />
  <Scatter name="Confidence indicates the accuracy level of Mood" data={scatterData} fill="#800080" >
    {
      scatterData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.moodColor} />)
    }
  </Scatter>
</ScatterChart>
    </div>





      <div style={{ margin: '50px 0' }}>
        <h2>Mood Distribution</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={moodCount}
            cx={200}
            cy={200}
            outerRadius={80}
            dataKey="value"
            nameKey="name"
            animationBegin={0} // Start animation from the beginning
            animationDuration={400} // Animation duration in milliseconds
          >
            {moodCount.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={exportToExcel}>Export to Excel</Button>
      </div>

      <Table dataSource={moodEntries} columns={columns} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default SentimentAnalysis;
