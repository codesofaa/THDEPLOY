import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminLogsPage.css'; // Ensure this CSS file is updated for layout
import SASidebar from './SASidebar';
import Header from './Header';
import Footer from './Footer';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [SAsidebarVisible, setSASidebarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const logsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/adlogs', {
          withCredentials: true,
        });
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

  const toggleSASidebar = () => {
    setSASidebarVisible(!SAsidebarVisible);
  };

  // Helper function to check if search query matches the date
  const matchDate = (dateString, query) => {
    // Convert the query and date to string and compare
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString(); // Date in 'MM/DD/YYYY' format
    return dateStr.includes(query);
  };

  // Filter logs based on search query (both message and date)
  const filteredLogs = logs.filter(log => {
    const messageMatches = log.message.toLowerCase().includes(searchQuery.toLowerCase());
    const dateMatches = matchDate(log.timestamp, searchQuery);
    return messageMatches || dateMatches; // Include logs that match either
  });

  // Sort the filtered logs based on selected field and order
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.message.localeCompare(b.message);
    } else if (sortField === 'date') {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      comparison = dateA - dateB;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination calculations
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(sortedLogs.length / logsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <div className="App">
      <Header />
      <div className="main-page-logs-admin">
        <SASidebar isVisible={SAsidebarVisible} />
        <div className={`logs-contents ${SAsidebarVisible ? 'SAsidebar-open' : ''}`}>
          <h1 className="greeting">SUPER ADMIN</h1>
          <div className="table-container">
            <div className="top-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-bar-admins"
              />

              {/* Sort Dropdown */}
              <div className="sort-dropdown-super-logs">
                <button className="sort-button-super-logs">
                  Sort Order
                </button>
                <div className="sort-menu-super-logs">
                  <button
                    className={`sort-option-super-logs ${sortField === 'name' && sortOrder === 'asc' ? 'active' : ''}`}
                    onClick={() => handleSortChange('name', 'asc')}
                  >
                    Name (A-Z)
                  </button>
                  <button
                    className={`sort-option-super-logs ${sortField === 'name' && sortOrder === 'desc' ? 'active' : ''}`}
                    onClick={() => handleSortChange('name', 'desc')}
                  >
                    Name (Z-A)
                  </button>
                  <button
                    className={`sort-option-super-logs ${sortField === 'date' && sortOrder === 'asc' ? 'active' : ''}`}
                    onClick={() => handleSortChange('date', 'asc')}
                  >
                    Date (Oldest)
                  </button>
                  <button
                    className={`sort-option-super-logs ${sortField === 'date' && sortOrder === 'desc' ? 'active' : ''}`}
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
                  <th>Admin</th>
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

            {/* Pagination */}
            <div className="pagination-super-logs">
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
       
      </div>
      <Footer />
    </div>
  );
};

export default Logs;
