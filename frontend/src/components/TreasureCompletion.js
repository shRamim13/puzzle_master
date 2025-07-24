import React from 'react';
import { Modal, Typography, Button, Space } from 'antd';
import { TrophyOutlined, CompassOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TreasureCompletion = ({ visible, treasureData, onComplete }) => {
  if (!treasureData) return null;

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center' }}>
          <TrophyOutlined style={{ color: '#ffd700', marginRight: '8px' }} />
          Treasure Found!
        </div>
      }
      open={visible}
      onCancel={onComplete}
      footer={[
        <Button 
          key="continue" 
          type="primary" 
          onClick={onComplete}
          icon={<CompassOutlined />}
        >
          Continue Adventure
        </Button>
      ]}
      width={600}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
            🎯 Your Next Clue
          </Title>
          
          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ color: 'white', fontSize: '16px' }}>
              {treasureData.hint}
            </Text>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '12px', 
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <Text style={{ color: 'white' }}>
              <EnvironmentOutlined style={{ marginRight: '8px' }} />
              <strong>Location:</strong> {treasureData.location}
            </Text>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '12px', 
            borderRadius: '8px'
          }}>
            <Text style={{ color: 'white' }}>
              <CompassOutlined style={{ marginRight: '8px' }} />
              <strong>Next Destination:</strong> {treasureData.nextDestination}
            </Text>
          </div>
        </div>
        
        <div style={{ 
          background: '#f6ffed', 
          border: '1px solid #b7eb8f', 
          padding: '16px', 
          borderRadius: '8px',
          marginTop: '16px'
        }}>
          <Text style={{ color: '#52c41a', fontSize: '14px' }}>
            💡 Tip: Follow the clues to find the physical treasure point and scan the QR code there!
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default TreasureCompletion; 