import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Space, 
  Popconfirm,
  Card,
  Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { puzzleAPI } from '../services/api';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AdminPuzzles = () => {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPuzzle, setEditingPuzzle] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPuzzles();
  }, []);

  const fetchPuzzles = async () => {
    setLoading(true);
    try {
      const response = await puzzleAPI.getPuzzles();
      setPuzzles(response.data);
    } catch (error) {
      message.error('Failed to fetch puzzles');
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingPuzzle(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingPuzzle(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await puzzleAPI.deletePuzzle(id);
      message.success('Puzzle deleted successfully');
      fetchPuzzles();
    } catch (error) {
      message.error('Failed to delete puzzle');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingPuzzle) {
        await puzzleAPI.updatePuzzle(editingPuzzle._id, values);
        message.success('Puzzle updated successfully');
      } else {
        await puzzleAPI.createPuzzle(values);
        message.success('Puzzle created successfully');
      }
      setModalVisible(false);
      fetchPuzzles();
    } catch (error) {
      message.error('Failed to save puzzle');
    }
  };

  const columns = [
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 80,
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      render: (difficulty) => (
        <span style={{ 
          color: difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'orange' : 'red',
          fontWeight: 'bold'
        }}>
          {difficulty.toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'questionType',
      key: 'questionType',
      width: 100,
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      width: 80,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this puzzle?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={3}>Manage Puzzles</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add Puzzle
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={puzzles}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingPuzzle ? 'Edit Puzzle' : 'Add Puzzle'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="level"
              label="Level"
              rules={[{ required: true, message: 'Please input level!' }]}
            >
              <Select placeholder="Select level">
                {[1, 2, 3, 4, 5].map(level => (
                  <Option key={level} value={level}>{level}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="difficulty"
              label="Difficulty"
              rules={[{ required: true, message: 'Please select difficulty!' }]}
            >
              <Select placeholder="Select difficulty">
                <Option value="easy">Easy</Option>
                <Option value="medium">Medium</Option>
                <Option value="hard">Hard</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="questionType"
              label="Question Type"
              rules={[{ required: true, message: 'Please select question type!' }]}
            >
              <Select placeholder="Select question type">
                <Option value="riddle">Riddle</Option>
                <Option value="question">Question</Option>
                <Option value="math">Math</Option>
                <Option value="science">Science</Option>
                <Option value="internet">Internet</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="question"
              label="Question"
              rules={[{ required: true, message: 'Please input question!' }]}
            >
              <TextArea rows={4} placeholder="Enter the question or riddle" />
            </Form.Item>

            <Form.Item
              name="answer"
              label="Answer"
              rules={[{ required: true, message: 'Please input answer!' }]}
            >
              <Input placeholder="Enter the correct answer" />
            </Form.Item>

            <Form.Item
              name="points"
              label="Points"
              rules={[{ required: true, message: 'Please input points!' }]}
            >
              <Input type="number" placeholder="Enter points" />
            </Form.Item>

            <Form.Item
              name="hints"
              label="Hints (Optional)"
            >
              <TextArea rows={2} placeholder="Enter hints (one per line)" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingPuzzle ? 'Update' : 'Create'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default AdminPuzzles; 