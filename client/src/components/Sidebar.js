import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = () => {
  const [notification, setNotification] = useState('');

  // Logout handler
  const handleLogout = () => {
    axios.get('https://thdeploy.onrender.com/logout', { withCredentials: true })
      .then(response => {
        // Redirect to login page or handle redirection in another way
        window.location.href = '/'; 
      })
      .catch(error => {
        console.error('Logout failed:', error);
        setNotification('Logout failed. Please try again.'); // Show error message
        setTimeout(() => setNotification(''), 3000);
      });
  };

  return (
    <div className="adminsidebar">
      <ul>
        <li><Link to="/logs">Users Logs</Link></li>
        <li><Link to="/theses">Theses Menu</Link></li>
        <li><Link to="/users">Users Accounts</Link></li>
        <li>
          <button 
            onClick={handleLogout} 
          >
            Logout
          </button>
        </li>
      </ul>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}; 

export default Sidebar;
