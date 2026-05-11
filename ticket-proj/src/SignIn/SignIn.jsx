import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';

const SignIn = ({ toggleSignInModal }) => {
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
    telephone: '',
    organization: '',
    secretKey: '',
  });
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleAdminChange = (e) => {
    setIsAdmin(e.target.value === 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister && formData.password !== formData.repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      let response;
      if (isRegister) {
        // Registration logic
        response = await axios.post('http://localhost:5000/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          telephone: formData.telephone,
          organization: formData.organization,
          isAdmin: isRegister && isAdmin,
          secretKey: formData.secretKey,
        });
      } else {
        // Login logic
        response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });
      }

      // Handle the response
      console.log(response);

      if (response.data.user) {
        const userData = {
          name: response.data.user.name,
          email: response.data.user.email,
          telephone: response.data.user.telephone,
          organization: response.data.user.organization,
          token: response.data.token,
          id: response.data.user.id,
          isAdmin: response.data.user.isAdmin,
        };

        dispatch(login(userData));
        toggleSignInModal();
      } else {
        setError('User data not found in response');
      }
    } catch (error) {
      setError('Error during authentication, please try again');
      console.error('Error during authentication:', error.response?.data || error);
    }
  };

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setIsAdmin(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      telephone: '',
      organization: '',
      secretKey: '',
    }); // Reset form data when toggling
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{isRegister ? 'Register' : 'Sign In'}</h2>
          <button onClick={toggleSignInModal} className="text-gray-600 hover:text-gray-900">
            &#10005;
          </button>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Telephone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your telephone"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your organization"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">Register as Admin?</label>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="isAdmin"
                      value="true"
                      checked={isAdmin}
                      onChange={handleAdminChange}
                      className="mr-2"
                    />
                    <label className="mr-4">Yes</label>
                    <input
                      type="radio"
                      name="isAdmin"
                      value="false"
                      checked={!isAdmin}
                      onChange={handleAdminChange}
                      className="mr-2"
                    />
                    <label>No</label>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">Secret Key</label>
                  <input
                    type="text"
                    name="secretKey"
                    value={formData.secretKey}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your secret key"
                    required={isAdmin} // Make it required if registering as admin
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            {isRegister && (
              <div>
                <label className="block text-gray-700">Repeat Password</label>
                <input
                  type="password"
                  name="repeatPassword"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Repeat your password"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className={`w-full ${isRegister ? 'bg-green-600' : 'bg-blue-600'} text-white p-2 rounded hover:bg-opacity-90 transition duration-300`}
            >
              {isRegister ? 'Register' : 'Sign In'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={toggleForm} className="text-blue-600 hover:underline">
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
