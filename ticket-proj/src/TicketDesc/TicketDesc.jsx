import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';

const TicketDesc = ({ _id, subject, description, category, username, status, createdAt, priority, onClose, comments }) => {
  const [ticketStatus, setTicketStatus] = useState(status);
  const [ticketPriority, setTicketPriority] = useState(priority);
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState(comments || []);
  const [loading, setLoading] = useState(false);  // Added loading state
  const [feedback, setFeedback] = useState('');   // Added feedback state
  const loggedInUser = useSelector((state) => state.user.name);
  const isAdmin = useSelector((state) => state.user.isAdmin); 
  const token = useSelector((state) => state.user.token);

  // Function to handle comment submission
  const handleCommentSubmit = async () => {
    if (!comment) return;

    setLoading(true); // Start loading when the comment submission starts
    setFeedback('');  // Clear previous feedback

    try {
      const response = await axios.post(`https://ticket-proj.vercel.app/api/tickets/${_id}/comments`, {
        username: loggedInUser,
        comment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.comment) {
        setCommentList((prev) => [...prev, response.data.comment]);
        setComment(''); // Clear the comment input after submitting
        setFeedback('Comment submitted successfully!'); // Success message
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setFeedback('Failed to submit the comment. Please try again.'); // Error message
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 p-8 overflow-y-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl transition duration-300">
          &times;
        </button>

        <h3 className="text-3xl font-semibold text-gray-900 mb-4">{subject}</h3>
        <p className="text-lg text-gray-800 mb-4">{description}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <p className="text-gray-700"><strong>Category:</strong> {category}</p>
          <p className="text-gray-700"><strong>Submitted by:</strong> {username}</p>
          <p className="text-gray-700"><strong>Date Created:</strong> {new Date(createdAt).toLocaleDateString()}</p>
          <p className={`text-gray-700 font-bold ${ticketStatus === 'Open' ? 'text-green-600' : 'text-red-600'}`}>
            <strong>Status:</strong> {ticketStatus}
          </p>
        </div>

        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-4">Comments</h4>
          <div className="max-h-48 overflow-y-auto mb-4 border border-gray-300 rounded-lg p-4 bg-gray-50">
            {commentList.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              commentList.map((c) => (
                <div key={c._id} className="flex justify-between items-center text-gray-700 mb-2">
                  <span><strong>{c.username || 'Anonymous'}:</strong> {c.comment || 'No comment provided.'}</span>
                </div>
              ))
            )}
          </div>

          {/* Add a Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          {/* Loading Spinner */}
          {loading ? (
            <div className="text-center mb-4">
              <p className="text-blue-600">Submitting your comment...</p>
            </div>
          ) : (
            <button 
              onClick={handleCommentSubmit} 
              className="px-6 py-2 bg-[#3A6D8C] text-white rounded-lg hover:bg-[#2C566E] transition duration-300"
            >
              Submit Comment
            </button>
          )}

          {/* Feedback Message */}
          {feedback && <p className={`mt-4 ${feedback.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{feedback}</p>}
        </div>
      </div>
    </div>
  );
};

export default TicketDesc;
