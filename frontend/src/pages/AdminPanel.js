import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  Select, 
  Typography, 
  Space, 
  message, 
  Table,
  Modal,
  Row,
  Col,
  Tabs,
  Switch,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  QrcodeOutlined,
  PuzzleOutlined,
  TrophyOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { puzzleAPI, treasureAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const AdminPanel = () => {
  const { user } = useAuth();
  const [puzzles, setPuzzles] = useState([]);
  const [treasures, setTreasures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [puzzleModalVisible, setPuzzleModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [treasureModalVisible, setTreasureModalVisible] = useState(false);
  const [editingPuzzle, setEditingPuzzle] = useState(null);
  const [editingTreasure, setEditingTreasure] = useState(null);
  const [puzzleForm] = Form.useForm();
  const [qrForm] = Form.useForm();
  const [treasureForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [puzzlesRes, treasuresRes] = await Promise.all([
        puzzleAPI.getPuzzles(),
        treasureAPI.getAllTreasures()
      ]);
      setPuzzles(puzzlesRes.data);
      setTreasures(treasuresRes.data);
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handlePuzzleSubmit = async (values) => {
    try {
      console.log('Puzzle form values:', values); // Debug log
      if (editingPuzzle) {
        await puzzleAPI.updatePuzzle(editingPuzzle._id, values);
        message.success('Puzzle updated successfully');
      } else {
        await puzzleAPI.createPuzzle(values);
        message.success('Puzzle created successfully');
      }
      setPuzzleModalVisible(false);
      puzzleForm.resetFields();
      setEditingPuzzle(null);
      fetchData();
    } catch (error) {
      message.error('Failed to save puzzle');
    }
  };

  const handleTreasureSubmit = async (values) => {
    try {
      if (editingTreasure) {
        await treasureAPI.updateTreasure(editingTreasure._id, values);
        message.success('Treasure updated successfully');
      } else {
        await treasureAPI.createTreasure(values);
        message.success('Treasure created successfully');
      }
      setTreasureModalVisible(false);
      treasureForm.resetFields();
      setEditingTreasure(null);
      fetchData();
    } catch (error) {
      message.error('Failed to save treasure');
    }
  };

  const handleQRSubmit = async (values) => {
    try {
      message.success('QR Code created successfully');
      setQrModalVisible(false);
      qrForm.resetFields();
    } catch (error) {
      message.error('Failed to create QR code');
    }
  };

  const handleEditPuzzle = async (puzzle) => {
    try {
      // Get treasure data for this puzzle's level
      const treasureResponse = await treasureAPI.getTreasures();
      const treasure = treasureResponse.find(t => t.level === puzzle.level);
      
      setEditingPuzzle(puzzle);
      puzzleForm.setFieldsValue({
        ...puzzle,
        hints: puzzle.hints ? puzzle.hints.join('\n') : '',
        treasureClue: treasure?.clue || '',
        treasureLocation: treasure?.location || '',
        nextDestination: treasure?.nextDestination || ''
      });
      setPuzzleModalVisible(true);
    } catch (error) {
      console.error('Error loading treasure data:', error);
      // Fallback to just puzzle data
      setEditingPuzzle(puzzle);
      puzzleForm.setFieldsValue({
        ...puzzle,
        hints: puzzle.hints ? puzzle.hints.join('\n') : ''
      });
      setPuzzleModalVisible(true);
    }
  };

  const handleEditTreasure = (treasure) => {
    setEditingTreasure(treasure);
    treasureForm.setFieldsValue(treasure);
    setTreasureModalVisible(true);
  };

  const handleDeletePuzzle = async (id) => {
    try {
      await puzzleAPI.deletePuzzle(id);
      message.success('Puzzle deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete puzzle');
    }
  };

  const handleDeleteTreasure = async (id) => {
    try {
      await treasureAPI.deleteTreasure(id);
      message.success('Treasure deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete treasure');
    }
  };

  const puzzleColumns = [
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 80,
    },
    {
      title: 'Type',
      dataIndex: 'questionType',
      key: 'questionType',
      width: 100,
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true,
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      width: 80,
    },
    {
      title: 'Treasure',
      key: 'treasure',
      width: 100,
      render: (_, record) => {
        const treasure = treasures.find(t => t.level === record.level);
        return treasure ? (
          <Tag color="green" icon={<TrophyOutlined />}>
            Set
          </Tag>
        ) : (
          <Tag color="orange" icon={<ExclamationCircleOutlined />}>
            Not Set
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditPuzzle(record)}
          />
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePuzzle(record._id)}
          />
        </Space>
      ),
    },
  ];

  const treasureColumns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code) => (
        <Text code style={{ fontSize: '12px' }}>{code}</Text>
      )
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 80,
    },
    {
      title: 'Clue',
      dataIndex: 'clue',
      key: 'clue',
      ellipsis: true,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      width: 80,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive) => (
        <span style={{ 
          color: isActive ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditTreasure(record)}
          />
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTreasure(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <TrophyOutlined style={{ color: '#faad14', marginRight: '8px' }} />
        Admin Panel
      </Title>
      <Text type="secondary">Welcome, {user?.username}!</Text>

      <Tabs defaultActiveKey="puzzles" style={{ marginTop: '24px' }}>
        <TabPane 
          tab={
            <span>
              <PuzzleOutlined />
              Puzzles
            </span>
          } 
          key="puzzles"
        >
          <Card>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4}>Manage Puzzles</Title>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingPuzzle(null);
                  puzzleForm.resetFields();
                  setPuzzleModalVisible(true);
                }}
              >
                Add Puzzle
              </Button>
            </div>
            
            <Table 
              columns={puzzleColumns} 
              dataSource={puzzles} 
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <TrophyOutlined />
              Treasure Points
            </span>
          } 
          key="treasures"
        >
          <Card>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4}>Manage Treasure Points</Title>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingTreasure(null);
                  treasureForm.resetFields();
                  setTreasureModalVisible(true);
                }}
              >
                Add Treasure Point
              </Button>
            </div>
            
            <Table 
              columns={treasureColumns} 
              dataSource={treasures} 
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <QrcodeOutlined />
              QR Codes
            </span>
          } 
          key="qrcodes"
        >
          <Card>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4}>Manage QR Codes</Title>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setQrModalVisible(true)}
              >
                Add QR Code
              </Button>
            </div>
            
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <QrcodeOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={4}>QR Code Management</Title>
              <Text type="secondary">
                Create QR codes for treasure points and link them to puzzles
              </Text>
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {/* Puzzle Modal */}
      <Modal
        title={editingPuzzle ? 'Edit Puzzle' : 'Add Puzzle'}
        open={puzzleModalVisible}
        onCancel={() => {
          setPuzzleModalVisible(false);
          setEditingPuzzle(null);
          puzzleForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={puzzleForm}
          layout="vertical"
          onFinish={handlePuzzleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: 'Please select level' }]}
              >
                <Select placeholder="Select level">
                  {[1, 2, 3, 4, 5].map(level => (
                    <Option key={level} value={level}>{level}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="questionType"
                label="Question Type"
                rules={[{ required: true, message: 'Please select question type' }]}
              >
                <Select placeholder="Select question type">
                  <Option value="riddle">Riddle</Option>
                  <Option value="question">Question</Option>
                  <Option value="math">Math</Option>
                  <Option value="science">Science</Option>
                  <Option value="internet">Internet</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: 'Please enter question' }]}
          >
            <TextArea rows={3} placeholder="Enter the puzzle question" />
          </Form.Item>

          <Form.Item
            name="answer"
            label="Answer"
            rules={[{ required: true, message: 'Please enter answer' }]}
          >
            <Input placeholder="Enter the correct answer" />
          </Form.Item>

          <Form.Item
            name="hints"
            label="Hints"
          >
            <TextArea rows={2} placeholder="Enter hints (optional)" />
          </Form.Item>

          <Form.Item
            name="points"
            label="Points"
            rules={[{ required: true, message: 'Please enter points' }]}
          >
            <Input type="number" placeholder="Enter points" />
          </Form.Item>

          {/* Checkpoint Clue Section */}
          <div style={{ 
            border: '2px solid #1890ff', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '20px',
            background: '#f0f8ff'
          }}>
            <Title level={4} style={{ marginBottom: '16px', color: '#1890ff' }}>
              🎯 Checkpoint Clue (Optional)
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
              This clue will be shown to players after they solve this puzzle
            </Text>
            
            <Form.Item
              name="treasureClue"
              label="Treasure Clue"
            >
              <TextArea 
                rows={3} 
                placeholder="Enter the clue that leads to the next treasure point (e.g., 'Look for the ancient tree near the fountain')" 
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="treasureLocation"
                  label="Treasure Location"
                >
                  <Input placeholder="Physical location (e.g., 'Central Park Fountain')" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="nextDestination"
                  label="Next Destination"
                >
                  <Input placeholder="Next location hint (e.g., 'Library Entrance')" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPuzzle ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => {
                setPuzzleModalVisible(false);
                setEditingPuzzle(null);
                puzzleForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Treasure Modal */}
      <Modal
        title={editingTreasure ? 'Edit Treasure Point' : 'Add Treasure Point'}
        open={treasureModalVisible}
        onCancel={() => {
          setTreasureModalVisible(false);
          setEditingTreasure(null);
          treasureForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={treasureForm}
          layout="vertical"
          onFinish={handleTreasureSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Code"
                rules={[{ required: true, message: 'Please enter code' }]}
              >
                <Input placeholder="Enter unique code" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: 'Please select level' }]}
              >
                <Select placeholder="Select level">
                  {[1, 2, 3, 4, 5].map(level => (
                    <Option key={level} value={level}>{level}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="clue"
            label="Clue"
            rules={[{ required: true, message: 'Please enter clue' }]}
          >
            <TextArea rows={2} placeholder="Enter clue for this treasure point" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input placeholder="Enter treasure point location" />
          </Form.Item>

          <Form.Item
            name="nextDestination"
            label="Next Destination"
            rules={[{ required: true, message: 'Please enter next destination' }]}
          >
            <Input placeholder="Enter next destination clue" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="points"
                label="Points"
                rules={[{ required: true, message: 'Please enter points' }]}
              >
                <Input type="number" placeholder="Enter points" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Active"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTreasure ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => {
                setTreasureModalVisible(false);
                setEditingTreasure(null);
                treasureForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        title="Add QR Code"
        open={qrModalVisible}
        onCancel={() => {
          setQrModalVisible(false);
          qrForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={qrForm}
          layout="vertical"
          onFinish={handleQRSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: 'Please select level' }]}
              >
                <Select placeholder="Select level">
                  {[1, 2, 3, 4, 5].map(level => (
                    <Option key={level} value={level}>{level}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="difficulty"
                label="Difficulty"
                rules={[{ required: true, message: 'Please select difficulty' }]}
              >
                <Select placeholder="Select difficulty">
                  <Option value="easy">Easy</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="hard">Hard</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="clue"
            label="Clue"
            rules={[{ required: true, message: 'Please enter clue' }]}
          >
            <TextArea rows={2} placeholder="Enter clue for this treasure point" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input placeholder="Enter treasure point location" />
          </Form.Item>

          <Form.Item
            name="nextDestination"
            label="Next Destination"
            rules={[{ required: true, message: 'Please enter next destination' }]}
          >
            <Input placeholder="Enter next destination clue" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create QR Code
              </Button>
              <Button onClick={() => {
                setQrModalVisible(false);
                qrForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPanel; 


// ok bye