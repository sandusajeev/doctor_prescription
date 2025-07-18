import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { loginApi } from '../services/allApi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function LoginPage() {
  const [doctorData, setDoctorData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleLogin = async () => {
    const { email, password } = doctorData;

    if (!email || !password) {
      toast.warning('Please fill in all fields.');
      return;
    }

    try {
      const result = await loginApi(doctorData);

      if (result.status === 200) {
        sessionStorage.setItem('existingUser', JSON.stringify(result.data.doctor_data));
        sessionStorage.setItem('token', result.data.jwt_token);
        toast.success('Login Successful');
        navigate('/dashborad');
      } else if (result.status === 406) {
        toast.error('Email or password mismatch!');
      } else {
        toast.error('Something went wrong!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Server error. Please try again later.');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="col-md-6">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-5">
            <h3 className="text-center text-primary mb-4">Doctor Login</h3>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Enter email"
                  value={doctorData.email}
                  onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Password"
                  value={doctorData.password}
                  onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                />
              </Form.Group>

              <div className="d-grid mb-3">
                <Button variant="primary" onClick={handleLogin}>
                  LOGIN
                </Button>
              </div>

              <p className="text-center text-muted">
                Don't have an account?{' '}
                <Link to="/register" className="text-decoration-none">
                  Register here
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


