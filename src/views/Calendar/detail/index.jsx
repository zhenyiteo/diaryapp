import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Spin, Alert, Button, Card, Typography, Modal, Form, Input } from 'antd';

const { Title, Paragraph } = Typography;

const CalendarDetails = () => {
  const location = useLocation();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const date = location.state?.date;
    if (date) {
      fetchDiaryEntries(date);
    }
  }, [location.state?.date]);

  const fetchDiaryEntries = async (date) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://puvce27hej.execute-api.us-east-1.amazonaws.com/prod/resource?date=${date}`);
      setEntries(response.data);
    } catch (err) {
      setError('Failed to fetch diary entries. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    form.setFieldsValue({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        console.log('Form values:', values); // Log to check form values
        const updatedEntry = {
          ...values,
          sessionId: selectedEntry.sessionId // Keeping original sessionId
          // Do not include date here since you're not updating it
        };
        console.log('Sending updated entry:', updatedEntry); // Log to check the payload
        updateDiaryEntry(updatedEntry);
        setIsModalVisible(false);
      })
      .catch(info => {
        console.error('Validate Failed:', info); // Log validation errors
      });
  };

  const updateDiaryEntry = async (updatedEntry) => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Attempting to update entry:', updatedEntry); // Log attempt to update
      const response = await axios.post(
        'https://m6ja3vhn7g.execute-api.us-east-1.amazonaws.com/prod/resource', 
        JSON.stringify(updatedEntry), // Make sure to stringify the body
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Update response:', response); // Log the response
      if (response.status === 200) {
        // Handle successful update
      }
    } catch (error) {
      console.error('Error updating entry:', error); // Log any errors
      setError('Failed to update the entry. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEntries = () => entries.map((entry, index) => (
    <Card key={index} className="entryCard">
      <Title level={4}>{entry.title}</Title>
      <Paragraph><strong>Date:</strong> {entry.date}</Paragraph>
      <Paragraph><strong>Mood:</strong> {entry.mood}</Paragraph>
      <Paragraph>{entry.content}</Paragraph>
      <Button type="primary" onClick={() => handleEdit(entry)}>Edit</Button>
    </Card>
  ));

  return (
    <div className="container">
      <Title level={2}>Diary Entries for {location.state?.date}</Title>
      {isLoading ? (
        <Spin tip="Loading diary entries..." />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        renderEntries()
      )}
      <Modal
        title="Edit Diary Entry"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please input the content!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="mood"
            label="Mood"
            rules={[{ required: true, message: 'Please input the mood!' }]}
          >
            <Input />
          </Form.Item>
          {/* Date Form.Item has been removed to prevent editing */}
        </Form>
      </Modal>
    </div>
  );
};

export default CalendarDetails;