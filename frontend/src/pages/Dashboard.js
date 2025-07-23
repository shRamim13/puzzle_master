import React from 'react';
import { Card, Typography, Button, Space, Row, Col, Statistic } from 'antd';
import { 
  TrophyOutlined, 
  PlayCircleOutlined, 
  SettingOutlined, 
  BarChartOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const adminActions = [
    {
      title: 'Manage Puzzles',
      description: 'Create, edit, and delete puzzles',
      icon: <SettingOutlined />,
      path: '/admin/puzzles',
      color: '#1890ff'
    },
    {
      title: 'View Leaderboard',
      description: 'See all teams and their progress',
      icon: <BarChartOutlined />,
      path: '/leaderboard',
      color: '#52c41a'
    }
  ];

  const captainActions = [
    {
      title: 'Start Game',
      description: 'Begin your treasure hunt adventure',
      icon: <PlayCircleOutlined />,
      path: '/game',
      color: '#1890ff'
    },
    {
      title: 'View Leaderboard',
      description: 'Check your team\'s position',
      icon: <BarChartOutlined />,
      path: '/leaderboard',
      color: '#52c41a'
    }
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2}>
              <TrophyOutlined style={{ color: '#faad14', marginRight: '8px' }} />
              Treasure Hunt Dashboard
            </Title>
            <Text type="secondary">
              Welcome back, {user?.username}!
            </Text>
          </div>
          <Space>
            <Text>
              <UserOutlined /> {user?.role === 'admin' ? 'Admin' : 'Team Captain'}
            </Text>
            <Button onClick={handleLogout}>
              Logout
            </Button>
          </Space>
        </div>
      </Card>

      {/* User Info */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Role"
              value={user?.role === 'admin' ? 'Administrator' : 'Team Captain'}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        {user?.role === 'captain' && (
          <>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Team Name"
                  value={user?.teamName || 'N/A'}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Team Members"
                  value={user?.teamMembers?.length || 0}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
          </>
        )}
      </Row>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <Row gutter={[16, 16]}>
          {(user?.role === 'admin' ? adminActions : captainActions).map((action, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: `2px solid ${action.color}`
                }}
                onClick={() => handleNavigation(action.path)}
              >
                <div style={{ 
                  fontSize: '48px', 
                  color: action.color, 
                  marginBottom: '16px' 
                }}>
                  {action.icon}
                </div>
                <Title level={4}>{action.title}</Title>
                <Text type="secondary">{action.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Game Rules */}
      <Card title="Game Rules" style={{ marginTop: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>For Team Captains:</Title>
            <ul>
              <li>Complete 5 levels to win the treasure hunt</li>
              <li>Each level has 3 difficulty options: Easy, Medium, Hard</li>
              <li>Once you choose a lower difficulty, you cannot select higher difficulties in subsequent levels</li>
              <li>Points are awarded based on difficulty and completion time</li>
              <li>The first team to complete all levels wins!</li>
            </ul>
          </Col>
          <Col span={12}>
            <Title level={5}>For Admins:</Title>
            <ul>
              <li>Create and manage puzzles for all levels and difficulties</li>
              <li>Monitor team progress and leaderboard</li>
              <li>Set up question types: riddles, math, science, internet, etc.</li>
              <li>Configure scoring system and game rules</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard; 