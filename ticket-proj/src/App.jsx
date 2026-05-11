import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './NavBar/NavBar';
import Home from './Home/Home';
import Tickets from './Tickets/Tickets';
import SubmitTicket from './SubmitTicket/SubmitTicket';
import SignIn from './SignIn/SignIn';
import { useSelector } from 'react-redux';
import UserInfo from './UserInfo/UserInfo';
import AllUsers from './AllUsers/AllUsers';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';

function App() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const toggleSignInModal = () => {
    setIsSignInOpen(!isSignInOpen);
  };
  
  const searchQuery = useSelector((state) => state.user.searchQuery);
  const isAuthenticated = useSelector((state) => state.user.isLoggedIn); // Assume authentication state exists in Redux

  return (
    <Router>
      <div className="flex">
        <NavBar toggleSignInModal={toggleSignInModal} />
        <main className="flex-grow ml-64 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tickets" element={<Tickets searchQuery={searchQuery} />} />
            
            {/* Only show "Submit Ticket" route if user is logged in */}
            {isAuthenticated && (
              <Route path="/submitticket" element={<SubmitTicket />} />
            )}

            <Route path="/userinfo" element={<UserInfo />} />
            
            {/* Protect the "All Users" route */}
            <Route path="/allusers" element={<ProtectedRoute element={AllUsers} />} />
          </Routes>
          {isSignInOpen && <SignIn toggleSignInModal={toggleSignInModal} />}
        </main>
      </div>
    </Router>
  );
}

export default App;
