import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Tickets from '../Tickets/Tickets';
import { FaBuilding, FaPhoneAlt, FaEnvelope, FaPlusSquare } from 'react-icons/fa';

const Home = () => {
    const user = useSelector((state) => state.user);
    const searchQuery = useSelector((state) => state.user.searchQuery);

    return (
        <div className="flex flex-col mt-4 mb-6 px-4 md:px-0 min-h-screen">
            {/* User Info Bar */}
            {user.isLoggedIn && (
                <div className="bg-gradient-to-r from-slate-500 to-zinc-500 p-4 rounded-lg shadow-md mb-6 flex items-center">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold text-white">{user.name}</h2>
                        <div className="flex items-center text-gray-300">
                            <FaBuilding className="mr-2" />
                            <span className="mr-2">{user.organization}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <FaPhoneAlt className="mx-2" />
                            <span className="mr-2">{user.telephone}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <FaEnvelope className="ml-2" />
                            <span className="ml-2">{user.email}</span>
                        </div>
                    </div>
                    <div className="ml-auto flex space-x-3 text-gray-300">
                        <button className="p-2 hover:text-gray-200">
                            <i className="fas fa-phone-alt"></i>
                        </button>
                        <button className="p-2 hover:text-gray-200">
                            <i className="fas fa-video"></i>
                        </button>
                        <button className="p-2 hover:text-gray-200">
                            <i className="fas fa-comment"></i>
                        </button>
                        <button className="p-2 hover:text-gray-200">
                            <i className="fas fa-envelope"></i>
                        </button>
                        {!user.isAdmin && <Link to="/submitticket" className="ml-4">
                            <button className="bg-[#3A6D8C] text-white px-4 py-2 rounded-xl hover:bg-[#2C566E] flex items-center">
                                <FaPlusSquare className="mr-2" />
                                Submit a Ticket
                            </button>
                        </Link>}
                        
                    </div>
                </div>
            )}

            {/* Tickets Section */}
            <div className="flex-1 p-5 overflow-auto bg-gray-100 rounded-lg shadow-md">
                <Tickets searchQuery={searchQuery} />
            </div>
        </div>
    );
};

export default Home;
