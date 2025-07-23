import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Badge, 
  Space, 
  Statistic, 
  Row, 
  Col,
  message 
} from 'antd';
import { TrophyOutlined, ClockCircleOutlined, StarOutlined } from '@ant-design/icons';
import { gameAPI } from '../services/api';

const { Title } = Typography;

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await gameAPI.getLeaderboard();
      setLeaderboard(response.data);
    } catch (error) {
      message.error('Failed to fetch leaderboard');
    }
    setLoading(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const columns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 80,
      render: (_, __, index) => {
        const rank = index + 1;
        let color = 'default';
        if (rank === 1) color = 'gold';
        else if (rank === 2) color = 'silver';
        else if (rank === 3) color = 'bronze';
        
        return (
          <Badge 
            count={rank} 
            style={{ 
              backgroundColor: color,
              fontSize: '16px',
              fontWeight: 'bold'
            }} 
          />
        );
      },
    },
    {
      title: 'Team',
      dataIndex: 'teamName',
      key: 'teamName',
      render: (teamName, record) => (
        <Space>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {teamName}
          </span>
          {record.isCompleted && (
            <Badge status="success" text="Completed" />
          )}
        </Space>
      ),
    },
    {
      title: 'Points',
      dataIndex: 'totalPoints',
      key: 'totalPoints',
      width: 100,
      render: (points) => (
        <span style={{ 
          color: '#52c41a', 
          fontWeight: 'bold', 
          fontSize: '16px' 
        }}>
          {points}
        </span>
      ),
      sorter: (a, b) => b.totalPoints - a.totalPoints,
    },
    {
      title: 'Time',
      dataIndex: 'totalTime',
      key: 'totalTime',
      width: 120,
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          <span>{formatTime(Math.round(time))}</span>
        </Space>
      ),
      sorter: (a, b) => a.totalTime - b.totalTime,
    },
    {
      title: 'Levels Completed',
      key: 'levelsCompleted',
      width: 150,
      render: (_, record) => (
        <span>
          {record.completedLevels?.length || 0} / 5
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        if (record.isCompleted) {
          return <Badge status="success" text="Winner" />;
        } else if (record.status === 'active') {
          return <Badge status="processing" text="Playing" />;
        } else {
          return <Badge status="default" text="Inactive" />;
        }
      },
    },
  ];

  const getTopTeams = () => {
    return leaderboard.slice(0, 3);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        <TrophyOutlined style={{ color: '#faad14', marginRight: '8px' }} />
        Treasure Hunt Leaderboard
      </Title>

      {/* Top 3 Teams */}
      {getTopTeams().length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          {getTopTeams().map((team, index) => (
            <Col xs={24} sm={8} key={team._id}>
              <Card 
                style={{ 
                  textAlign: 'center',
                  border: index === 0 ? '2px solid #faad14' : 
                          index === 1 ? '2px solid #d9d9d9' : 
                          '2px solid #d48806'
                }}
              >
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: '8px',
                  color: index === 0 ? '#faad14' : 
                         index === 1 ? '#d9d9d9' : '#d48806'
                }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
                <Title level={4}>{team.teamName}</Title>
                <Statistic 
                  title="Points" 
                  value={team.totalPoints} 
                  prefix={<StarOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
                <div style={{ marginTop: '8px', color: '#666' }}>
                  Time: {formatTime(Math.round(team.totalTime))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Full Leaderboard Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={leaderboard}
          loading={loading}
          rowKey="_id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} teams`
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default Leaderboard; 