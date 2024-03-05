import React, { useEffect, useState, useRef } from 'react';
import { Timeline, Card, Modal } from 'antd';
import axios from 'axios';
import styled, { css } from 'styled-components';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';

const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  overflow-y: auto;
  flex: 1;
  padding: 20px;
  gap: 20px;
`;

const StyledCard = styled(Card)`
  width: 400px;
  height: 300px;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 20px; /* Increased font size */
  font-weight: bold; /* Make the font bold */
`;

const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  font-size: 15px;
`;

const DateText = styled.div`
  font-size: 15px;
`;

const ContentText = styled.div`
  font-family: 'Handlee', cursive; /* Apply Handlee font */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const getMonthAbbreviation = (month) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[parseInt(month, 10) - 1];
};

const MoodIcon = ({ mood }) => {
  switch (mood.toLowerCase()) {
    case 'happy':
      return <SmileOutlined style={{ color: 'green' }} />;
    case 'sad':
      return <FrownOutlined style={{ color: 'red' }} />;
    default:
      return null;
  }
};

const Homepage = () => {
  const [diaryHistory, setDiaryHistory] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const response = await axios.get('https://ytlwpwl73k.execute-api.us-east-1.amazonaws.com/prod/resource');
        const responseBody = JSON.parse(response.data.body);
        if (responseBody && Array.isArray(responseBody)) {
          setDiaryHistory(responseBody);
        } else {
          console.error('Received data is not in expected format:', responseBody);
        }
      } catch (error) {
        console.error('Error fetching diary entries:', error);
      }
    };
    fetchDiaryEntries();
  }, []);

  const showModal = (entry) => {
    setSelectedEntry(entry);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h2>Diary Timeline</h2>
      <TimelineWrapper>
        <ContentWrapper>
          <Timeline mode="left">
            {diaryHistory.map((entry, index) => (
              <Timeline.Item key={index} label={entry.date}>
                <StyledCard
                  hoverable
                  onClick={() => showModal(entry)}
                  style={{ marginLeft: index % 2 === 0 ? 0 : 'auto' }}
                >
                  <TitleWrapper>
                    <Title>
                      {entry.title} <MoodIcon mood={entry.mood} />
                    </Title>
                    <DateWrapper>
                      <DateText>{getMonthAbbreviation(entry.date.split('-')[1])}</DateText>
                      <div>{entry.date.split('-')[2]}</div>
                      <div>{entry.date.split('-')[0]}</div>
                    </DateWrapper>
                  </TitleWrapper>
                  <ContentText>{entry.content}</ContentText>
                </StyledCard>
              </Timeline.Item>
            ))}
          </Timeline>
        </ContentWrapper>
      </TimelineWrapper>
      <Modal
        title={<span style={{ color: '#123456' }}>{selectedEntry?.title}</span>}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        closable={true}
        bodyStyle={{ backgroundColor: '#f0f2f5' }}
      >
        <p>Date: {selectedEntry?.date}</p>
        <p>Mood: {selectedEntry?.mood}</p>
        <p>Content: {selectedEntry?.content}</p>
      </Modal>
    </div>
  );
};

export default Homepage;