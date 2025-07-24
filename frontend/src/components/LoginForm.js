import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, BulbOutlined, TrophyOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toggleTheme } = useTheme();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', values);
      const result = await login(values);
      console.log('Login result:', result);
      
      if (result.success) {
        message.success('Login successful!');
        window.location.href = '/dashboard';
      } else {
        message.error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #2d3748 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      {/* Theme Toggle Button */}
      <Button
        type="text"
        icon={<BulbOutlined />}
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          color: '#ffffff',
          fontSize: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
      />

      {/* Left Side - Image */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{
            width: '400px',
            height: '600px',
            margin: '0 auto 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '30px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
            border: '3px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(30, 35, 48, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <img 
              src="/ssd.png" 
              alt="Treasure Hunt Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '27px'
              }}
              onError={(e) => {
                console.log('Image failed to load:', e.target.src);
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '27px'
            }}>
              <TrophyOutlined style={{ fontSize: '80px', color: 'white' }} />
            </div>
          </div>
          <Title level={1} style={{ 
            color: '#ffffff', 
            marginBottom: '16px',
            fontWeight: 'bold',
            fontSize: '48px'
          }}>
            Treasure Hunt
          </Title>
          <Text style={{ 
            color: '#a0aec0',
            fontSize: '20px',
            lineHeight: '1.6'
          }}>
            Embark on an exciting adventure filled with puzzles, challenges, and hidden treasures!
          </Text>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <Card style={{ 
          width: '100%', 
          maxWidth: '450px', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          borderRadius: '20px',
          background: 'rgba(30, 35, 48, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ 
              color: '#ffffff', 
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              Welcome Back
            </Title>
            <Text style={{ 
              color: '#a0aec0',
              fontSize: '16px'
            }}>
              Sign in to continue your adventure
            </Text>
          </div>
          
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#a0aec0' }} />} 
                placeholder="Email"
                style={{ 
                  borderRadius: '12px', 
                  height: '50px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#a0aec0' }} />}
                placeholder="Password"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{ 
                  borderRadius: '12px', 
                  height: '50px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff'
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)'
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ 
            color: '#a0aec0',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            Don't have an account?
          </Divider>

          <Button
            type="link"
            href="/register"
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Create Account
          </Button>
        </Card>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default LoginForm; 