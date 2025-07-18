import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { regDoctorApi } from '../services/allApi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const [doctorData, setDoctorData] = useState({
    name: '',
    email: '',
    number: '',
    department: '',
    password: ''
  });

  const handleAddDoctor = async () => {
    const { name, email, number, department, password } = doctorData;

    if (!name || !email || !number || !department || !password) {
      toast.warning('Please fill in all fields.');
    } else {
      try {
        const result = await regDoctorApi(doctorData);
        if (result.status === 201) {
          toast.success(result.data);
          clearFields();
        } else if (result.status === 406) {
          toast.error('User Already Exists');
        } else {
          toast.error('Something went wrong. Try again.');
        }
      } catch (error) {
        console.log('Registration error:', error);
        toast.error('Server error. Please try again later.');
      }
    }
  };

  const clearFields = () => {
    setDoctorData({
      name: '',
      email: '',
      number: '',
      department: '',
      password: ''
    });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center pt-3" style={{ minHeight: '100vh' }}>
      <div className="col-md-8">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-5">
            <h3 className="text-center text-primary mb-4">Doctor Registration</h3>

            <Form>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter your name"
                  value={doctorData.name}
                  onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                />
              </Form.Group>

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

              <Form.Group className="mb-3" controlId="formBasicNumber">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  required
                  type="tel"
                  placeholder="Enter mobile number"
                  value={doctorData.number}
                  onChange={(e) => setDoctorData({ ...doctorData, number: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicDepartment">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter your department"
                  value={doctorData.department}
                  onChange={(e) => setDoctorData({ ...doctorData, department: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Create a password"
                  value={doctorData.password}
                  onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                />
              </Form.Group>

              <div className="d-grid gap-2 mb-3">
                <Button variant="primary" onClick={handleAddDoctor}>
                  REGISTER
                </Button>
              </div>

              <p className="text-center text-muted">
                Already have an account?{' '}
                <Link to="/" className="text-decoration-none">
                  Login here
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
