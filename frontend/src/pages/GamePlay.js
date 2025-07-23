import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Typography, 
  Space, 
  Progress, 
  Badge, 
  message, 
  Modal,
  Select,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  PlayCircleOutlined, 
  TrophyOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { gameAPI, puzzleAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Game configuration constants
const GAME_CONFIG = {
  MAX_LEVELS: 5
};

const { Title, Text } = Typography;
const { Option } = Select;

const GamePlay = () => {
  const { user } = useAuth();
  const [currentGame, setCurrentGame] = useState(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timer, setTimer] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [availableDifficulties, setAvailableDifficulties] = useState(['easy']);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [treasureHint, setTreasureHint] = useState(null);
  const [treasureLocation, setTreasureLocation] = useState(null);
  const [nextDestination, setNextDestination] = useState(null);
  const [showTreasureModal, setShowTreasureModal] = useState(false);

  useEffect(() => {
    fetchCurrentGame();
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (currentGame && currentGame.status === 'active') {
      startTimer();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentGame]);

  const fetchCurrentGame = async () => {
    try {
      const response = await gameAPI.getCurrentGame();
      setCurrentGame(response.data);
      
      if (response.data.status === 'active') {
        fetchAvailableDifficulties();
      }
    } catch (error) {
      if (error.response?.status === 404) {
        message.info('No active game found. Please start a new game.');
      } else {
        message.error('Failed to fetch current game');
      }
    }
  };

  const fetchAvailableDifficulties = async () => {
    try {
      const response = await gameAPI.getAvailableDifficulties();
      setAvailableDifficulties(response.data.availableDifficulties);
      setSelectedDifficulty(response.data.availableDifficulties[0]);
    } catch (error) {
      message.error('Failed to fetch available difficulties');
    }
  };

  const startTimer = () => {
    if (timer) clearInterval(timer);
    const newTimer = setInterval(() => {
      setTimeTaken(prev => prev + 1);
    }, 1000);
    setTimer(newTimer);
  };

  const handleStartGame = async () => {
    setLoading(true);
    try {
      const response = await gameAPI.startGame();
      setCurrentGame(response.data.gameSession);
      message.success('Game started successfully!');
      fetchAvailableDifficulties();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to start game');
    }
    setLoading(false);
  };

  const handleGetPuzzle = async () => {
    if (!selectedDifficulty) {
      message.error('Please select a difficulty');
      return;
    }

    setLoading(true);
    try {
      const response = await puzzleAPI.getRandomPuzzle(
        currentGame.currentLevel, 
        selectedDifficulty
      );
      setCurrentPuzzle(response.data);
      setTimeTaken(0);
      startTimer();
      setShowDifficultyModal(false);
    } catch (error) {
      message.error('Failed to get puzzle');
    }
    setLoading(false);
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      message.error('Please enter an answer');
      return;
    }

    setLoading(true);
    try {
      const response = await gameAPI.submitAnswer(
        currentPuzzle._id,
        answer,
        timeTaken
      );

      if (response.data.isCorrect) {
        message.success('Correct answer!');
        setCurrentGame(response.data.gameSession);
        setCurrentPuzzle(null);
        setAnswer('');
        setTimeTaken(0);
        
        // Handle treasure hints
        if (response.data.treasureHint) {
          setTreasureHint(response.data.treasureHint);
          setTreasureLocation(response.data.treasureLocation);
          setNextDestination(response.data.nextDestination);
          setShowTreasureModal(true);
        }
        
        if (response.data.gameSession.isCompleted) {
          message.success('Congratulations! You have completed the treasure hunt!');
          if (timer) clearInterval(timer);
          setTimer(null);
        }
      } else {
        message.error('Incorrect answer. Try again!');
      }
    } catch (error) {
      message.error('Failed to submit answer');
    }
    setLoading(false);
  };

  const handleEndGame = async () => {
    try {
      await gameAPI.endGame();
      message.success('Game ended successfully');
      setCurrentGame(null);
      setCurrentPuzzle(null);
      setAnswer('');
      setTimeTaken(0);
      if (timer) clearInterval(timer);
    } catch (error) {
      message.error('Failed to end game');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentGame) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Title level={3}>Welcome to Treasure Hunt!</Title>
          <Text style={{ display: 'block', marginBottom: '24px' }}>
            Ready to start your adventure, {user?.teamName}?
          </Text>
          <Button 
            type="primary" 
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleStartGame}
            loading={loading}
          >
            Start Game
          </Button>
        </Card>
      </div>
    );
  }

  // Show game completion screen
  if (currentGame.isCompleted || currentGame.status === 'completed') {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <TrophyOutlined style={{ fontSize: '64px', color: '#ffd700', marginBottom: '16px' }} />
            <Title level={2} style={{ color: '#52c41a' }}>
              🎉 Congratulations! 🎉
            </Title>
            <Title level={3}>
              You have completed the Treasure Hunt!
            </Title>
          </div>

          <Row gutter={16} style={{ marginBottom: '32px' }}>
            <Col span={8}>
              <Statistic 
                title="Final Score" 
                value={currentGame.totalPoints} 
                valueStyle={{ color: '#52c41a', fontSize: '24px' }}
              />
            </Col>
            <Col span={8}>
              <Statistic 
                title="Total Time" 
                value={formatTime(Math.round(currentGame.totalTime))} 
                valueStyle={{ fontSize: '24px' }}
              />
            </Col>
            <Col span={8}>
              <Statistic 
                title="Levels Completed" 
                value={currentGame.completedLevels.length} 
                valueStyle={{ fontSize: '24px' }}
              />
            </Col>
          </Row>

          <div style={{ marginBottom: '24px' }}>
            <Title level={4}>Completed Levels:</Title>
            <Row gutter={[16, 16]}>
              {currentGame.completedLevels.map((level, index) => (
                <Col span={8} key={index}>
                  <Card size="small">
                    <div style={{ textAlign: 'center' }}>
                      <Badge 
                        status="success" 
                        text={`Level ${level.level}`} 
                      />
                      <div style={{ marginTop: '8px' }}>
                        <Text type="secondary">{level.difficulty}</Text>
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        <Text strong style={{ color: '#52c41a' }}>
                          +{level.points} pts
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <Button 
            type="primary" 
            size="large"
            onClick={() => window.location.href = '/leaderboard'}
          >
            View Leaderboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Game Status */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic 
              title="Current Level" 
              value={currentGame.currentLevel} 
              prefix={<TrophyOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Total Points" 
              value={currentGame.totalPoints} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Time Taken" 
              value={formatTime(Math.round(currentGame.totalTime))} 
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Progress" 
              value={Math.round((currentGame.completedLevels.length / 5) * 100)} 
              suffix="%" 
              prefix={<Progress type="circle" size={20} />}
            />
          </Col>
        </Row>
      </Card>

      {/* Current Puzzle */}
      {currentPuzzle ? (
        <Card title={`Level ${currentPuzzle.level} - ${currentPuzzle.difficulty.toUpperCase()}`}>
          <div style={{ marginBottom: '24px' }}>
            <Title level={4}>Question:</Title>
            <Text style={{ fontSize: '16px' }}>{currentPuzzle.question}</Text>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <Text strong>Time: {formatTime(timeTaken)}</Text>
          </div>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              placeholder="Enter your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onPressEnter={handleSubmitAnswer}
              size="large"
            />
            <Space>
              <Button 
                type="primary" 
                onClick={handleSubmitAnswer}
                loading={loading}
                icon={<CheckCircleOutlined />}
              >
                Submit Answer
              </Button>
              <Button onClick={() => setCurrentPuzzle(null)}>
                Cancel
              </Button>
            </Space>
          </Space>
        </Card>
      ) : currentGame.currentLevel <= GAME_CONFIG.MAX_LEVELS ? (
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={4}>Ready for the next challenge?</Title>
            <Text style={{ display: 'block', marginBottom: '16px' }}>
              Select difficulty for Level {currentGame.currentLevel}
            </Text>
            <Button 
              type="primary" 
              size="large"
              onClick={() => setShowDifficultyModal(true)}
              icon={<PlayCircleOutlined />}
            >
              Get Puzzle
            </Button>
          </div>
        </Card>
      ) : null}

      {/* Completed Levels */}
      {currentGame.completedLevels.length > 0 && (
        <Card title="Completed Levels" style={{ marginTop: '24px' }}>
          <Row gutter={[16, 16]}>
            {currentGame.completedLevels.map((level, index) => (
              <Col span={8} key={index}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <Badge 
                      status="success" 
                      text={`Level ${level.level}`} 
                    />
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary">{level.difficulty}</Text>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <Text strong style={{ color: '#52c41a' }}>
                        +{level.points} pts
                      </Text>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary">
                        {Math.round(level.timeTaken)}s
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* End Game Button - Only show if game is not completed */}
      {!currentGame.isCompleted && currentGame.status !== 'completed' && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button 
            danger 
            onClick={handleEndGame}
            icon={<ExclamationCircleOutlined />}
          >
            End Game
          </Button>
        </div>
      )}

      {/* Difficulty Selection Modal */}
      <Modal
        title="Select Difficulty"
        open={showDifficultyModal}
        onCancel={() => setShowDifficultyModal(false)}
        footer={null}
      >
        <div style={{ textAlign: 'center' }}>
          <Text style={{ display: 'block', marginBottom: '16px' }}>
            Choose difficulty for Level {currentGame.currentLevel}
          </Text>
          <Select
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
            style={{ width: '200px', marginBottom: '16px' }}
          >
            {availableDifficulties.map(difficulty => (
              <Option key={difficulty} value={difficulty}>
                {difficulty.toUpperCase()}
              </Option>
            ))}
          </Select>
          <div>
            <Button 
              type="primary" 
              onClick={handleGetPuzzle}
              loading={loading}
            >
              Get Puzzle
            </Button>
          </div>
        </div>
      </Modal>

      {/* Treasure Hints Modal */}
      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <TrophyOutlined style={{ color: '#ffd700', marginRight: '8px' }} />
            Treasure Found!
          </div>
        }
        open={showTreasureModal}
        onCancel={() => setShowTreasureModal(false)}
        footer={[
          <Button 
            key="continue" 
            type="primary" 
            onClick={() => setShowTreasureModal(false)}
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
                {treasureHint}
              </Text>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '12px', 
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <Text style={{ color: 'white' }}>
                <strong>Location:</strong> {treasureLocation}
              </Text>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '12px', 
              borderRadius: '8px'
            }}>
              <Text style={{ color: 'white' }}>
                <strong>Next Destination:</strong> {nextDestination}
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
    </div>
  );
};

export default GamePlay; 