import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import TicketDesc from '../TicketDesc/TicketDesc';
import UserInfo from '../UserInfo/UserInfo';
import { FaCommentAlt, FaUserAlt, FaTag, FaClock, FaTrashAlt } from 'react-icons/fa';

const Tickets = ({ searchQuery }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showTicketDesc, setShowTicketDesc] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Local state for filtering
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [privacyFilter, setPrivacyFilter] = useState('all');  // To filter private or public tickets
    const [ticketFilter, setTicketFilter] = useState('all');    // 'all' for all tickets, 'my' for user's tickets

    // Get ticket status and user data from Redux store
    const ticketStatus = useSelector((state) => state.user.ticketStatus);
    const token = useSelector((state) => state.user.token);
    const userId = useSelector((state) => state.user.id); // Get the logged-in user's ID
    const isAdmin = useSelector((state) => state.user.isAdmin); // Check if the user is an admin
    const loggedIn = useSelector((state) => state.user.isLoggedIn);
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const headers = {};
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }
        
                const response = await axios.get('http://localhost:5000/api/tickets', { headers });
                setTickets(response.data);
            } catch (err) {
                setError('Error fetching tickets: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [token]);

    // Handle when a ticket is clicked
    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
        setShowTicketDesc(true);
        setShowUserInfo(false); // Ensure user info modal is closed
    };

    const handleCloseTicketDesc = () => {
        setShowTicketDesc(false);
        setSelectedTicket(null);
    };

    const handleCloseUserInfo = () => {
        setShowUserInfo(false);
        setSelectedUser(null);
    };

    // Handle deleting a ticket
    const handleDeleteTicket = async (ticketId) => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`, { headers });
            setTickets(tickets.filter(ticket => ticket._id !== ticketId));
        } catch (err) {
            setError('Error deleting ticket: ' + (err.response?.data?.message || err.message));
        }
    };

    // Filter the tickets based on search, date range, privacy, and ticket status
    const filteredTickets = tickets.filter((ticket) => {
        // Apply the ticket filter (only user's tickets or all)
        const isUserTicketMatch = ticketFilter === 'my' ? ticket.userId === userId : true;

        // Apply the status filter from Redux (ticketStatus is set from NavBar)
        const isStatusMatch = ticketStatus === 'open'
            ? ticket.status.toLowerCase() === 'open'
            : ticketStatus === 'closed'
            ? ticket.status.toLowerCase() === 'closed'
            : true;

        // Apply the search query filter
        const matchesSearch = searchQuery
            ? ticket.ticketSubject.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        // Apply the date range filter
        const ticketDate = new Date(ticket.createdAt);
        const isWithinDateRange =
            (startDate ? ticketDate >= new Date(startDate) : true) &&
            (endDate ? ticketDate <= new Date(endDate) : true);

        // Apply the privacy filter
        const matchesPrivacy =
            privacyFilter === 'all'
                ? true
                : privacyFilter === 'private'
                ? ticket.private
                : !ticket.private;

        return isUserTicketMatch && isStatusMatch && matchesSearch && isWithinDateRange && matchesPrivacy;
    });

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="container mx-auto pt-4">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Tickets</h2>

            {/* Filters Section */}
            <div className="flex flex-wrap gap-4 mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
                {/* Privacy Filter */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Privacy</label>
                    <select 
                        value={privacyFilter}
                        onChange={(e) => setPrivacyFilter(e.target.value)}
                        className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>

                {/* Date Filters */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Ticket Filter for Regular Users */}
                {loggedIn && !isAdmin && (
                  <div className="flex flex-col">
                       <label className="text-sm font-medium text-gray-700 mb-2">Ticket Filter</label>
                       <select 
                       value={ticketFilter}
                    onChange={(e) => setTicketFilter(e.target.value)}
                   className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                   <option value="all">All Tickets</option>
                      <option value="my">My Tickets</option>
                    </select>
                      </div>
                    )}

            </div>

            {/* Tickets List */}
            <div className="space-y-4">
                {filteredTickets.length === 0 ? (
                    <div className="text-center text-gray-500">No tickets found</div>
                ) : (
                    filteredTickets.map((ticket) => (
                        <div
                            key={ticket._id}
                            className={`bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${
                                ticket.status.toLowerCase() === 'open' ? 'border-green-500' : 'border-red-500'
                            }`}
                            onClick={() => handleTicketClick(ticket)}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-gray-700 text-sm flex items-center">
                                    <FaTag className="mr-2 text-blue-500" /> Ticket #{ticket._id} 
                                    <span className={`ml-2 px-2 py-1 rounded-md font-medium ${ticket.status.toLowerCase() === 'open' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                                        {ticket.status}
                                    </span>
                                </p>
                                <p className="text-gray-500 text-sm flex items-center">
                                    <FaClock className="mr-2" /> {new Date(ticket.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                    
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{ticket.ticketSubject}</h3>
                            <p className="text-gray-600 mb-4">{ticket.description}</p>
                    
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <FaUserAlt 
                                        className="mr-1 cursor-pointer" 
                                        onClick={(event) => handleUserClick(ticket.user, event)} 
                                    />
                                    <span className="cursor-pointer" onClick={(event) => handleUserClick(ticket.user, event)}>
                                        {ticket.username}
                                    </span>
                    
                                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md flex items-center">
                                        <FaTag className="mr-1" /> {ticket.category}
                                    </span>
                    
                                    <span className="flex items-center bg-gray-200 text-gray-700 px-2 py-1 rounded-md">
                                        <FaCommentAlt className="mr-1" />
                                        {ticket.comments.length}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded-md font-medium ${ticket.priority.toLowerCase() === 'high' ? 'bg-red-200 text-red-900' : ticket.priority.toLowerCase() === 'medium' ? 'bg-yellow-200 text-yellow-900' : 'bg-green-200 text-green-900'}`}>
                                        {ticket.priority}
                                    </span>
                                    <span className={`px-2 py-1 rounded-md font-medium ${ticket.private ? 'bg-gray-400 text-gray-900' : 'bg-blue-200 text-blue-900'}`}>
                                        {ticket.private ? 'Private' : 'Public'}
                                    </span>
                                    {isAdmin && (
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleDeleteTicket(ticket._id);
                                            }}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Ticket Description Modal */}
            {showTicketDesc && selectedTicket && (
                <TicketDesc
                    _id={selectedTicket._id}
                    subject={selectedTicket.ticketSubject}
                    description={selectedTicket.description}
                    category={selectedTicket.category}
                    username={selectedTicket.username}
                    status={selectedTicket.status}
                    createdAt={selectedTicket.createdAt}
                    comments={selectedTicket.comments}
                    priority={selectedTicket.priority}
                    onClose={handleCloseTicketDesc}
                />
            )}

            {/* User Info Modal */}
            {showUserInfo && selectedUser && (
                <UserInfo user={selectedUser} onClose={handleCloseUserInfo} />
            )}
        </div>
    );
};

export default Tickets;
