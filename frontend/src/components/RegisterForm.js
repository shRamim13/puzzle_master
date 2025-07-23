import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Option } = Select;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('captain');
  const { register } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Attempting registration with:', values);
      
      const userData = {
        ...values,
        role,
        teamMembers: role === 'captain' ? values.teamMembers || [] : []
      };
      
      const result = await register(userData);
      console.log('Registration result:', result);
      
      if (result.success) {
        message.success('Registration successful!');
        window.location.href = '/dashboard';
      } else {
        message.error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Join Treasure Hunt</h1>
          <p style={{ color: '#6b7280' }}>Create your account to start</p>
        </div>
        
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username" 
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select
              placeholder="Select your role"
              value={role}
              onChange={setRole}
              className="rounded-lg"
            >
              <Option value="captain">Team Captain</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          {role === 'captain' && (
            <>
              <Form.Item
                name="teamName"
                rules={[{ required: true, message: 'Please input your team name!' }]}
              >
                <Input 
                  prefix={<TeamOutlined />} 
                  placeholder="Team Name" 
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="teamMembers"
                label="Team Members (Optional)"
              >
                <Input.TextArea
                  placeholder="Enter team member names (one per line)"
                  rows={3}
                  className="rounded-lg"
                />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login here
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterForm; 