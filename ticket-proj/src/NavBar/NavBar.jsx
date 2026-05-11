import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setSearchQuery, setTicketStatus, setHasNewTickets } from '../features/userSlice';
import { FaTicketAlt, FaPlusSquare, FaSignOutAlt, FaSignInAlt, FaPhone, FaEnvelope, FaUser, FaUsers, FaCircle, FaChevronDown } from 'react-icons/fa'; 
import axios from 'axios';

const NavBar = ({ toggleSignInModal }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch new tickets status for the admin
  useEffect(() => {
    if (user.isAdmin) {
      const fetchNewTickets = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/tickets/admin/check-new-tickets', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          dispatch(setHasNewTickets(response.data.hasNewTickets)); // Update Redux state with hasNewTickets
        } catch (error) {
          console.error('Error fetching new tickets status:', error);
        }
      };

      fetchNewTickets();
    }
  }, [user.isAdmin, dispatch, user.token]);

  // Clear the new tickets notification when admin views tickets
  const handleViewTickets = async () => {
    if (user.isAdmin && user.hasNewTickets) {
      try {
        await axios.post('http://localhost:5000/api/tickets/admin/clear-new-tickets', {}, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        dispatch(setHasNewTickets(false)); // Clear the red dot in Redux state
      } catch (error) {
        console.error('Error clearing new tickets notification:', error);
      }
    }
    setDropdownOpen(!dropdownOpen); // Toggle dropdown menu
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  // Handle status filter change (All, Open, Closed)
  const handleStatusFilterChange = (status) => {
    dispatch(setTicketStatus(status));
    setDropdownOpen(false);
    navigate('/'); // Redirect to ticket list
  };

  return (
    <aside className="bg-gradient-to-b from-gray-800 to-gray-700 h-full w-64 fixed left-0 top-0 shadow-lg flex flex-col">
      <div className="p-4">
        <div className="text-white text-xl font-bold flex items-center justify-center mb-4">
          <span>Ticket System</span>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search tickets..."
          onChange={handleSearchChange}
          className="mt-4 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
        />

        {/* Menu Links */}
        <ul className="mt-8 space-y-4">
          {/* Tickets Menu */}
          <li className="relative">
            <button
              onClick={handleViewTickets} // Clear new ticket notifications when viewing tickets
              className="text-gray-300 hover:text-white flex items-center space-x-2 transition duration-300 w-full focus:outline-none"
            >
              <FaTicketAlt />
              <span>Tickets</span>
              {user.hasNewTickets && (
                <FaCircle className="text-red-500 ml-2" style={{ fontSize: '8px' }} /> // Red dot if new tickets
              )}
              <FaChevronDown className={`ml-auto transform transition-transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            {/* Dropdown Menu for Ticket Status */}
            {dropdownOpen && (
              <ul className="absolute left-0 mt-2 bg-gray-700 text-white rounded shadow-lg w-full">
                <li
                  onClick={() => handleStatusFilterChange('all')}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-600"
                >
                  All
                </li>
                <li
                  onClick={() => handleStatusFilterChange('open')}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-600"
                >
                  Open
                </li>
                <li
                  onClick={() => handleStatusFilterChange('closed')}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-600"
                >
                  Closed
                </li>
              </ul>
            )}
          </li>

          {/* Submit Ticket for non-admins */}
          {!user.isAdmin && user.isLoggedIn && (
            <li>
              <Link to="/submitticket" className="text-gray-300 hover:text-white flex items-center space-x-2 transition duration-300">
                <FaPlusSquare />
                <span>Submit a Ticket</span>
              </Link>
            </li>
          )}

          {/* Profile link for logged-in users */}
          {user.isLoggedIn && (
            <li>
              <Link to="/userinfo" className="text-gray-300 hover:text-white flex items-center space-x-2 transition duration-300">
                <FaUser />
                <span>My Profile</span>
              </Link>
            </li>
          )}

          {/* Customers link for admins */}
          {user.isAdmin && (
            <li>
              <Link to="/allusers" className="text-gray-300 hover:text-white flex items-center space-x-2 transition duration-300">
                <FaUsers />
                <span>Customers</span>
              </Link>
            </li>
          )}
        </ul>

        {/* Sign in/out button */}
        <div className="mt-8">
          {user.isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="mt-2 px-4 py-2 bg-[#3A6D8C] text-white rounded-lg flex items-center space-x-2 hover:bg-[#2C566E] transition duration-300 shadow-lg"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={toggleSignInModal}
              className="mt-2 px-4 py-2 bg-[#3A6D8C] text-white rounded-lg flex items-center space-x-2 hover:bg-[#2C566E] transition duration-300 shadow-lg"
            >
              <FaSignInAlt />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      
    </aside>
  );
};

export default NavBar;
