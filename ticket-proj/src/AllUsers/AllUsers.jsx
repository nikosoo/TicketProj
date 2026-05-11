import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';  // Import the FaTrash icon

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null); // Track the user being edited
    const [editFormData, setEditFormData] = useState({ name: '', email: '', telephone: '', organization: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/all-users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
            setUsers(users.filter((user) => user._id !== id)); // Remove the user from the state
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user._id);
        setEditFormData({
            name: user.name,
            email: user.email,
            telephone: user.telephone,
            organization: user.organization,
        });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/auth/users/${id}`, editFormData);
            setEditingUser(null); // Close the edit form after the update
            fetchUsers(); // Fetch updated users
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg font-semibold">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">All Users</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Organization</th>
                            <th className="py-3 px-6 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {users.map((user) => (
                            <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-left">{user.email}</td>
                                <td className="py-3 px-6 text-left">{user.organization}</td>
                                <td className="py-3 px-6 text-left">
                                    {/* Edit Form */}
                                    {editingUser === user._id ? (
                                        <div className="flex flex-col space-y-2">
                                            <input
                                                type="text"
                                                name="name"
                                                value={editFormData.name}
                                                onChange={handleEditChange}
                                                className="p-2 border border-gray-300 rounded"
                                            />
                                            <input
                                                type="email"
                                                name="email"
                                                value={editFormData.email}
                                                onChange={handleEditChange}
                                                className="p-2 border border-gray-300 rounded"
                                            />
                                            <input
                                                type="text"
                                                name="telephone"
                                                value={editFormData.telephone}
                                                onChange={handleEditChange}
                                                className="p-2 border border-gray-300 rounded"
                                            />
                                            <input
                                                type="text"
                                                name="organization"
                                                value={editFormData.organization}
                                                onChange={handleEditChange}
                                                className="p-2 border border-gray-300 rounded"
                                            />
                                            <button
                                                onClick={() => handleUpdate(user._id)}
                                                className="bg-blue-500 text-white p-2 rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingUser(null)}
                                                className="bg-red-500 text-white p-2 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="bg-[#3A6D8C] hover:bg-[#2C566E] text-white p-2 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="bg-red-500 text-white p-2 rounded flex items-center "
                                            >
                                                <FaTrash /> {/* React icon for delete */}
                                                
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;
