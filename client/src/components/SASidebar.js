import React from 'react';
import { Link } from 'react-router-dom';
import './SASidebar.css';

const SASidebar = () => {
  return (
    <div className="SAsidebar">
      <ul>
        <li><Link to="/adminlogs">Admin Logs</Link></li>
        <li><Link to="/admins">Admin Accounts</Link></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
    </div>
  );
};

export default SASidebar;
