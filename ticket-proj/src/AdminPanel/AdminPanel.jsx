import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [tickets, setTickets] = useState([]);  // State to store tickets
    const [error, setError] = useState(null);    // State to store any error
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch all tickets when component mounts
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
                const response = await axios.get('https://ticket-proj.vercel.app/api/tickets', {
                    headers: {
                        Authorization: `Bearer ${token}` // Pass the token in the headers
                    }
                });
                setTickets(response.data);  // Store tickets in state
                setLoading(false);  // Loading is complete
            } catch (err) {
                setError('Failed to fetch tickets');
                setLoading(false);  // Loading is complete
            }
        };

        fetchTickets();
    }, []);

    // Conditional rendering based on loading and error states
    if (loading) {
        return <div>Loading tickets...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Admin Panel - All Tickets</h1>
            {tickets.length === 0 ? (
                <p>No tickets available</p>
            ) : (
                <ul>
                    {tickets.map(ticket => (
                        <li key={ticket._id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                            <h3>{ticket.ticketSubject}</h3>
                            <p><strong>Description:</strong> {ticket.description}</p>
                            <p><strong>Status:</strong> {ticket.status}</p>
                            <p><strong>Priority:</strong> {ticket.priority}</p>
                            <p><strong>Private:</strong> {ticket.private ? 'Yes' : 'No'}</p>
                            <p><strong>Created by:</strong> {ticket.username}</p>
                            <p><strong>Category:</strong> {ticket.category}</p>

                            {/* If you want to display the comments */}
                            {ticket.comments.length > 0 && (
                                <div>
                                    <h4>Comments:</h4>
                                    <ul>
                                        {ticket.comments.map(comment => (
                                            <li key={comment._id}>
                                                <strong>{comment.username}:</strong> {comment.comment}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminPanel;
