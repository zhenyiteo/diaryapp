import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Spin, Alert, Button, Card, Typography, Modal, Form, Input } from 'antd';
import { notification } from 'antd';

const { Title, Paragraph } = Typography;

const CalendarDetails = () => {
  const location = useLocation();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddEntryModalVisible, setIsAddEntryModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [form] = Form.useForm();
  
  
  useEffect(() => {
    const date = location.state?.date;
    if (date) {
      fetchDiaryEntries(date);
    }
  }, [location.state?.date]);

  // Fetch entries from API
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

  // Open edit modal
  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    form.setFieldsValue(entry);
    setIsEditModalVisible(true);
  };

  // Submit updated entry
  const handleEditModalOk = () => {
    form.validateFields().then(values => {
      updateDiaryEntry({
        ...values,
        sessionId: selectedEntry.sessionId
      });
      setIsEditModalVisible(false);
    }).catch(info => {
      console.error('Validate Failed:', info);
    });
  };

  // Update entry in API
  const updateDiaryEntry = async (updatedEntry) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.put(
        'https://m6ja3vhn7g.execute-api.us-east-1.amazonaws.com/prod/resource', 
        JSON.stringify(updatedEntry),
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        fetchDiaryEntries(updatedEntry.date);
      }
    } catch (error) {
      setError('Failed to update the entry. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (sessionId) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`https://05irsninm2.execute-api.us-east-1.amazonaws.com/prod/handdlepython/${sessionId}`);
      if (response.status === 200) {
        notification.success({
          message: 'Entry Deleted',
          description: 'The entry has been successfully deleted.',
        });
        // Refresh entries list
        const newDate = location.state?.date;
        if (newDate) {
          fetchDiaryEntries(newDate);
        }
      }
    } catch (error) {
      console.error(error);
      let errorMessage = 'Failed to delete the entry. Please try again later.';
      if (error.response) {
        
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
        errorMessage = error.response.data.message || errorMessage;
      }
      notification.error({
        message: 'Failed to Delete Entry',
        description: 'Failed to delete the entry. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  const showAddEntryModal = () => {
    setIsAddEntryModalVisible(true);
  };

  
  const handleAddEntryModalOk = () => {
    form.validateFields().then(values => {
      addDiaryEntry({
        ...values,
        date: location.state?.date
      });
      setIsAddEntryModalVisible(false);
    }).catch(info => {
      console.error('Validate Failed:', info);
    });
  };

  
const addDiaryEntry = async (newEntry) => {
  setIsLoading(true);
  try {
    const response = await axios.post(
      'https://5ed0iy3pue.execute-api.us-east-1.amazonaws.com/prod/resource', 
      JSON.stringify(newEntry),
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (response.status === 201) {

      notification.success({
        message: 'Entry Succesfully Saved',
        description: 'The entry has been successfully saved.',
      });

      fetchDiaryEntries(newEntry.date);
    }
  } catch (error) {
    notification.error({
      message: 'Failed to Add Entry',
      description: 'Failed to add the entry. Please try again later.',
      duration: 4.5, 
    });
  } finally {
    setIsLoading(false);
  }
};

 
  const renderEntries = () => {
    if (entries.length === 0) {
      return <Paragraph>No entries available for this date. You can add entries for this date by pressing <b>Add Entry</b> button</Paragraph>;
    }
  
    return entries.map((entry, index) => (
      <Card key={index} className="entryCard">
        <Title level={4}>{entry.title}</Title>
        <Paragraph><strong>Date:</strong> {entry.date}</Paragraph>
        <Paragraph><strong>Mood:</strong> {entry.mood}</Paragraph>
        <Paragraph>{entry.content}</Paragraph>
        <Button type="primary" onClick={() => handleEdit(entry)}>Edit</Button>
        <Button danger style={{ marginLeft: '8px' }} onClick={() => handleDelete(entry.sessionId)}>
          Delete
        </Button>
      </Card>
    ));
  };

  
  return (
    <div className="container">
      <Title level={2}>
        Diary Entries for {location.state?.date}
        <Button type="primary" onClick={showAddEntryModal} style={{ marginLeft: 16 }}>
          Add Entry
        </Button>
      </Title>
      {isLoading ? (
        <Spin tip="Loading diary entries..." />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        renderEntries()
      )}
      <Modal
        title="Edit Diary Entry"
        visible={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Please input the content!' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="mood" label="Mood" rules={[{ required: true, message: 'Please input the mood!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Add New Diary Entry"
        visible={isAddEntryModalVisible}
        onOk={handleAddEntryModalOk}
        onCancel={() => setIsAddEntryModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Please input the content!' }]}>

        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name="mood" label="Mood" rules={[{ required: true, message: 'Please input the mood!' }]}>
        <Input />
      </Form.Item>
      {/* We're not adding a date field here since we're using the date from location.state */}
    </Form>
  </Modal>
</div>
);
};

export default CalendarDetails;