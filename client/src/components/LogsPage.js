import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LogsPage.css';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState("date"); // "name" or "date"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"
  const [dropdownVisible, setDropdownVisible] = useState(false); // Controls dropdown visibility
  const logsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logs', {
          withCredentials: true,
        });

        // Sort logs based on selected option
        const sortedLogs = response.data.sort((a, b) => {
          if (!sortField) return 0; // If no sort field is selected, return the array as is

          const aValue = sortField === 'name' ? a.message.toLowerCase() : new Date(a.timestamp);
          const bValue = sortField === 'name' ? b.message.toLowerCase() : new Date(b.timestamp);

          // Sort by date in descending order for newest logs first
          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });

        setLogs(sortedLogs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    // Get the admin's name from localStorage
    const storedAdmin = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedAdmin) {
      setAdminName(`${storedAdmin.firstName} ${storedAdmin.lastName}`);
    }

    fetchLogs();
  }, [sortField, sortOrder]); // Re-fetch logs when sortField or sortOrder changes

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setDropdownVisible(false); // Close dropdown after selection
  };

  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp).toLocaleDateString();
    return (
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      logDate.includes(searchQuery) // Filter by date as well
    );
  });
  
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="App">
      <Header />
      <div className="main-page-logs">
        <Sidebar isVisible={sidebarVisible} />
        <div className={`content-logs-page ${sidebarVisible ? 'sidebar-open' : ''}`}>
          <h1 className="greeting">Good day, {adminName}!</h1>
          <div className="table-container">
            <div className="top-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-bar-users"
              />
              <div className="sort-dropdown-logs">
                <button className="sort-button-logs">
                  Sort Order
                </button>
                <div className="sort-menu-logs">
                  <button
                    className={`sort-option-logs ${sortField === 'name' && sortOrder === 'asc' ? 'active' : ''}`}
                    onClick={() => handleSortChange('name', 'asc')}
                  >
                    Name (A-Z)
                  </button>
                  <button
                    className={`sort-option-logs ${sortField === 'name' && sortOrder === 'desc' ? 'active' : ''}`}
                    onClick={() => handleSortChange('name', 'desc')}
                  >
                    Name (Z-A)
                  </button>
                  <button
                    className={`sort-option-logs ${sortField === 'date' && sortOrder === 'asc' ? 'active' : ''}`}
                    onClick={() => handleSortChange('date', 'asc')}
                  >
                    Date (Oldest)
                  </button>
                  <button
                    className={`sort-option-logs ${sortField === 'date' && sortOrder === 'desc' ? 'active' : ''}`}
                    onClick={() => handleSortChange('date', 'desc')}
                  >
                    Date (Newest)
                  </button>
                </div>
              </div>
            </div>
            <table className="log-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map(log => {
                  const date = new Date(log.timestamp).toLocaleDateString();
                  const time = new Date(log.timestamp).toLocaleTimeString();
                  return (
                    <tr key={log._id}>
                      <td>{log.message}</td>
                      <td>{date}</td>
                      <td>{time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="pagination-logs">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <br></br><br></br><br></br><br></br><br></br><br></br>
 
      </div>
      <Footer />
    </div>
  );
};

export default Logs;
