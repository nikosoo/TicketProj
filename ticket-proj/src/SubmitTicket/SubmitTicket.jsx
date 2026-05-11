import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const SubmitTicket = () => {
  const categories = [
    'Test1', 'Test2', 'Test3', 'Test4', 'Test5', 'Test6', 'Test7'
  ];

  const priorities = ['Low', 'Medium', 'High'];
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [relatedUrl, setRelatedUrl] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState('Low');
  const [isPrivate, setIsPrivate] = useState(false); // State for the privacy option
  const [error, setError] = useState(null);
  
  const username = useSelector((state) => state.user.name);
  const userId = useSelector((state) => state.user.id);
  const email = useSelector((state)=>state.user.email)
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setTicketPriority(e.target.value);
  };

  // Function to handle the privacy checkbox change
  const handlePrivacyChange = (e) => {
    setIsPrivate(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedCategory || !ticketSubject || !ticketDescription) {
      setError('Please fill in all required fields.');
      return;
    }
  
    try {
      const response = await axios.post('https://ticket-proj.vercel.app/api/tickets', {
        ticketSubject,
        relatedUrl,
        description: ticketDescription,
        category: selectedCategory,
        username,
        userEmail: email,
        priority: ticketPriority,
        userId,
        private: isPrivate,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Notify the admin about the new ticket (You can adjust this API based on your backend logic)
      
      console.log('Ticket submitted successfully');
      alert('Ticket submitted successfully!');
      
      // Reset the form fields
      setTicketSubject('');
      setRelatedUrl('');
      setTicketDescription('');
      setSelectedCategory('');
      setTicketPriority('Low');
      setIsPrivate(false);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error submitting ticket. Please try again.';
      setError(errorMessage);
      console.error('Error during ticket submission:', err);
    }
  };
  



  return (
    <div className="pt-20 container mx-auto">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Product or Category</h2>
        <p className="mb-4">With which product or category do you need help?</p>

        <div className="mb-4">
          <label htmlFor="category" className="block text-lg font-medium text-gray-700">
            Select a Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="mt-2 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Submit a Ticket for {selectedCategory}</h3>
            {error && <p className="text-red-500" aria-live="assertive">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Ticket Subject</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the ticket subject"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">Related URL</label>
                <input
                  type="url"
                  value={relatedUrl}
                  onChange={(e) => setRelatedUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the related URL"
                />
              </div>

              <div>
                <label className="block text-gray-700">Ticket Description</label>
                <textarea
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the ticket description"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-gray-700">Select Priority:</label>
                <select
                  id="priority"
                  value={ticketPriority}
                  onChange={handlePriorityChange}
                  className="mt-2 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              {/* Privacy Option */}
              <div>
                <label className="block text-gray-700">Privacy:</label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={handlePrivacyChange}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">Make this ticket private</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#3A6D8C] text-white p-2 rounded hover:bg-[#2C566E] transition duration-300"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitTicket;
