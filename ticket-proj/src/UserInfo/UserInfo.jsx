import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout, updateUserDetails } from '../features/userSlice';
import { FaSignOutAlt, FaUserEdit, FaEnvelope, FaPhone, FaBuilding, FaEdit } from 'react-icons/fa';

const UserInfo = () => {
  const dispatch = useDispatch();
  
  // Accessing user state from Redux store
  const { name, email, telephone, organization, isLoggedIn, token } = useSelector((state) => state.user);
  
  // State to track the field currently being edited
  const [editingField, setEditingField] = useState(null);
  
  // State to hold the updated values during editing
  const [updatedInfo, setUpdatedInfo] = useState({ email, telephone, organization });

  // Function to handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Function to handle update user details for a specific field
  const handleUpdateDetails = async (field) => {
    try {
      // Make API request to update user details
      const response = await axios.put(
        'http://localhost:5000/api/auth/update',
        { [field]: updatedInfo[field] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Dispatch to update Redux state
      dispatch(updateUserDetails(response.data.user));
      
      // Exit edit mode after successful update
      setEditingField(null);
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  // Function to handle field changes
  const handleChange = (field, value) => {
    setUpdatedInfo((prev) => ({ ...prev, [field]: value }));
  };

  if (!isLoggedIn) {
    return <div className="text-center text-red-500 font-semibold">Please log in to see your user information.</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Profile</h1>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium text-gray-700">
            <FaUserEdit className="inline mr-2 text-gray-500" /> Name: 
            <span className="ml-2">{name}</span>
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-lg font-medium text-gray-700">
            <FaEnvelope className="inline mr-2 text-gray-500" /> Email: 
            {editingField === 'email' ? (
              <input
                type="text"
                value={updatedInfo.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="ml-2 border p-1 rounded"
              />
            ) : (
              <span className="ml-2">{email}</span>
            )}
          </p>
          {editingField === 'email' ? (
            <button
              onClick={() => handleUpdateDetails('email')}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Save
            </button>
          ) : (
            <FaEdit
              className="text-gray-500 cursor-pointer"
              onClick={() => setEditingField('email')}
            />
          )}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-lg font-medium text-gray-700">
            <FaPhone className="inline mr-2 text-gray-500" /> Telephone: 
            {editingField === 'telephone' ? (
              <input
                type="text"
                value={updatedInfo.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
                className="ml-2 border p-1 rounded"
              />
            ) : (
              <span className="ml-2">{telephone}</span>
            )}
          </p>
          {editingField === 'telephone' ? (
            <button
              onClick={() => handleUpdateDetails('telephone')}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Save
            </button>
          ) : (
            <FaEdit
              className="text-gray-500 cursor-pointer"
              onClick={() => setEditingField('telephone')}
            />
          )}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-lg font-medium text-gray-700">
            <FaBuilding className="inline mr-2 text-gray-500" /> Organization: 
            {editingField === 'organization' ? (
              <input
                type="text"
                value={updatedInfo.organization}
                onChange={(e) => handleChange('organization', e.target.value)}
                className="ml-2 border p-1 rounded"
              />
            ) : (
              <span className="ml-2">{organization}</span>
            )}
          </p>
          {editingField === 'organization' ? (
            <button
              onClick={() => handleUpdateDetails('organization')}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Save
            </button>
          ) : (
            <FaEdit
              className="text-gray-500 cursor-pointer"
              onClick={() => setEditingField('organization')}
            />
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 flex justify-center items-center space-x-2"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
