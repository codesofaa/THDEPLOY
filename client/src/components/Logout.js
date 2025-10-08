import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'GET',
        credentials: 'include' // This ensures cookies (such as session cookies) are included
      });

      if (response.ok) {
        navigate('/login'); // Redirect to the login page after successful logout
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/logs">Users Logs</Link></li>
        <li><Link to="/theses">Theses Menu</Link></li>
        <li><Link to="/users">Users Accounts</Link></li>
        <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', padding: 0, margin: 0, color: 'inherit', cursor: 'pointer' }}>Logout</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
