import React, { useState } from 'react';
import axios from 'axios';

const AdminCreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    telephone: '',
    organization: '',
    role: 'user', // Default to 'user'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ticket-proj.vercel.app/api/auth/register', formData);
      setSuccessMessage('User created successfully');
      setFormData({
        name: '',
        email: '',
        password: '',
        telephone: '',
        organization: '',
        role: 'user',
      });
    } catch (error) {
      setErrorMessage('Error creating user. Please try again.');
    }
  };

  return (
    <div className="admin-create-user-form">
      <h2>Create New User</h2>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter name"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
          />
        </div>
        <div>
          <label>Telephone</label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
            placeholder="Enter telephone"
          />
        </div>
        <div>
          <label>Organization</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            required
            placeholder="Enter organization"
          />
        </div>
        <div>
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default AdminCreateUser;
