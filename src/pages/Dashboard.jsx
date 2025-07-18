import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { toast } from 'react-toastify';

function Dashboard() {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      setIsLogin(true);
    }
    const storedUser = sessionStorage.getItem('existingUser');
    if (storedUser) {
      setName(JSON.parse(storedUser).name);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const [formData, setFormData] = useState({
    doctorName: '',
    patientName: '',
    patientAge: '',
    gender: '',
    symptoms: '',
    diagnosis: '',
    advice: '',
    medicines: ['']
  });

  const [suggestions, setSuggestions] = useState({});

  useEffect(() => {
    setFormData((prev) => ({ ...prev, doctorName: name }));
  }, [name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicineChange = (index, value) => {
    const updated = [...formData.medicines];
    updated[index] = value;
    setFormData({ ...formData, medicines: updated });

    if (value.length >= 3) {
      axios
        .get(`https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${value}`)
        .then((res) => {
          const items = res.data.approximateGroup?.candidate || [];
          const names = items
            .filter((c) => c.name)
            .map((c) => c.name)
            .filter((val, idx, self) => self.indexOf(val) === idx);
          setSuggestions((prev) => ({ ...prev, [index]: names }));
        })
        .catch((err) => console.log(err));
    } else {
      setSuggestions((prev) => ({ ...prev, [index]: [] }));
    }
  };

  const addMedicineField = () => {
    setFormData({ ...formData, medicines: [...formData.medicines, ''] });
  };

  const removeMedicineField = (index) => {
    const updated = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: updated });

    const newSuggestions = { ...suggestions };
    delete newSuggestions[index];
    setSuggestions(newSuggestions);
  };

  const selectSuggestion = (index, name) => {
    const updated = [...formData.medicines];
    updated[index] = name;
    setFormData({ ...formData, medicines: updated });
    setSuggestions((prev) => ({ ...prev, [index]: [] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { patientName, patientAge } = formData;
    if (!patientName || !patientAge) {
      toast.warning('Patient name and age are required');
      return;
    }

    sessionStorage.setItem('prescriptionData', JSON.stringify(formData));
    navigate('/preview');
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-primary">👨‍⚕️ Welcome, Dr. {name}</h2>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Form onSubmit={handleSubmit} className="mt-4 border rounded p-4 shadow">
        <Form.Group className="mb-3">
          <Form.Label>Patient Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter patient name"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Patient Age</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter patient age"
            name="patientAge"
            value={formData.patientAge}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Gender</Form.Label>
          <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Symptoms</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Diagnosis</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Advice</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="advice"
            value={formData.advice}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Label>Medicines</Form.Label>
        {formData.medicines.map((medicine, index) => (
          <div key={index} className="position-relative mb-2 d-flex align-items-center">
            <Form.Control
              type="text"
              className="me-2"
              value={medicine}
              onChange={(e) => handleMedicineChange(index, e.target.value)}
              required
            />
            {formData.medicines.length > 1 && (
              <Button variant="danger" size="sm" onClick={() => removeMedicineField(index)}>
                X
              </Button>
            )}
            {suggestions[index]?.length > 0 && (
              <ul
                className="list-group position-absolute w-100"
                style={{ top: '100%', zIndex: '10' }}
              >
                {suggestions[index].map((sug, i) => (
                  <li
                    key={i}
                    className="list-group-item"
                    onClick={() => selectSuggestion(index, sug)}
                    style={{ cursor: 'pointer' }}
                  >
                    {sug}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <Button variant="secondary" onClick={addMedicineField}>
          + Add More
        </Button>

        <div className="text-center mt-4">
          <Button type="submit" variant="primary">
            Submit Prescription
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Dashboard;
