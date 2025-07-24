import React, { useState, useEffect } from 'react';
import { Card, Button, Input, message, Modal, Typography, Space, Progress, Tag } from 'antd';
import { CheckOutlined, ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { gameAPI, puzzleAPI } from '../services/api';
import TreasureCompletion from '../components/TreasureCompletion';

const { Text, Title } = Typography;
const { TextArea } = Input;

const GamePlay = () => {
  const { user } = useAuth();
  const [currentGame, setCurrentGame] = useState(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [puzzleLoading, setPuzzleLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [showTreasureModal, setShowTreasureModal] = useState(false);
  const [treasureData, setTreasureData] = useState(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      setLoading(true);
      let game = await gameAPI.getCurrentGame();
      
      if (!game) {
        // Start new game if no active session
        game = await gameAPI.startGame();
        message.success('Game started!');
      }
      
      setCurrentGame(game);
      
      // If game is active and no puzzle is loaded, get a puzzle
      if (game.status === 'active' && !currentPuzzle) {
        await getPuzzle();
      }
    } catch (error) {
      console.error('Error initializing game:', error);
      message.error('Failed to initialize game');
    } finally {
      setLoading(false);
    }
  };

  const getPuzzle = async () => {
    try {
      setPuzzleLoading(true);
      const puzzle = await puzzleAPI.getRandomPuzzle(currentGame.currentLevel);
      setCurrentPuzzle(puzzle);
      setStartTime(Date.now());
      setAnswer('');
    } catch (error) {
      console.error('Error getting puzzle:', error);
      message.error('Failed to get puzzle');
    } finally {
      setPuzzleLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      message.warning('Please enter an answer');
      return;
    }

    try {
      setLoading(true);
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      
      const response = await gameAPI.submitAnswer({
        puzzleId: currentPuzzle._id,
        answer: answer.trim(),
        timeTaken
      });

      if (response.isCorrect) {
        message.success(`Correct! +${response.points} points`);
        
        // Update game state
        setCurrentGame(response.gameSession);
        setCurrentPuzzle(null);
        setAnswer('');
        
        // Show treasure hint if available
        if (response.treasureHint) {
          setTreasureData({
            hint: response.treasureHint,
            location: response.treasureLocation,
            nextDestination: response.nextDestination
          });
          setShowTreasureModal(true);
        } else if (response.gameSession.isCompleted) {
          message.success('Congratulations! You completed all levels!');
        } else {
          // Get next puzzle
          setTimeout(() => {
            getPuzzle();
          }, 2000);
        }
      } else {
        message.error('Incorrect answer. Try again!');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      message.error('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const handleTreasureComplete = () => {
    setShowTreasureModal(false);
    setTreasureData(null);
    
    if (currentGame.isCompleted) {
      message.success('Congratulations! You completed the treasure hunt!');
    } else {
      // Get next puzzle
      setTimeout(() => {
        getPuzzle();
      }, 1000);
    }
  };

  const handleEndGame = async () => {
    try {
      await gameAPI.endGame();
      message.success('Game ended successfully');
      setCurrentGame(null);
      setCurrentPuzzle(null);
    } catch (error) {
      console.error('Error ending game:', error);
      message.error('Failed to end game');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Loading game...</Text>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>No active game found</Text>
        <br />
        <Button type="primary" onClick={initializeGame}>
          Start New Game
        </Button>
      </div>
    );
  }

  const progress = (currentGame.completedLevels.length / 5) * 100;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: '20px' }}>
          <Title level={3}>Treasure Hunt Game</Title>
          <Space>
            <Text>Team: {currentGame.teamName}</Text>
            <Text>Level: {currentGame.currentLevel}/5</Text>
            <Text>Points: {currentGame.totalPoints}</Text>
            <Text>Time: {Math.floor(currentGame.totalTime / 60)}m {currentGame.totalTime % 60}s</Text>
          </Space>
        </div>

        <Progress percent={progress} status="active" />

        {currentGame.isCompleted ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <TrophyOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }} />
            <Title level={2}>Congratulations!</Title>
            <Text>You completed all levels!</Text>
            <br />
            <Text>Final Score: {currentGame.totalPoints} points</Text>
            <br />
            <Text>Total Time: {Math.floor(currentGame.totalTime / 60)}m {currentGame.totalTime % 60}s</Text>
            <br />
            <Button type="primary" onClick={handleEndGame} style={{ marginTop: '16px' }}>
              End Game
            </Button>
          </div>
        ) : currentPuzzle ? (
          <div>
            <Card title={`Level ${currentPuzzle.level} - ${currentPuzzle.questionType.toUpperCase()}`}>
              <div style={{ marginBottom: '20px' }}>
                <Text strong>Question:</Text>
                <br />
                <Text>{currentPuzzle.question}</Text>
              </div>

              {currentPuzzle.hints && currentPuzzle.hints.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <Text strong>Hints:</Text>
                  <br />
                  {currentPuzzle.hints.map((hint, index) => (
                    <Tag key={index} color="blue" style={{ marginTop: '4px' }}>
                      {hint}
                    </Tag>
                  ))}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <Text strong>Your Answer:</Text>
                <TextArea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  rows={3}
                  style={{ marginTop: '8px' }}
                />
              </div>

              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleSubmitAnswer}
                loading={loading}
                size="large"
              >
                Submit Answer
              </Button>
            </Card>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text>Loading puzzle...</Text>
            <br />
            <Button type="primary" onClick={getPuzzle} loading={puzzleLoading}>
              Get Puzzle
            </Button>
          </div>
        )}
      </Card>

      <TreasureCompletion
        visible={showTreasureModal}
        treasureData={treasureData}
        onComplete={handleTreasureComplete}
      />
    </div>
  );
};

export default GamePlay; 