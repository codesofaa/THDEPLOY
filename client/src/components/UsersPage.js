import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsersPage.css';
import Sidebar from './Sidebar';
import './Sidebar.css';
import Header from './Header';
import Footer from './Footer';

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('https://thdeploy.onrender.com/api/users/');
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredData = currentUsers.filter(user =>
    (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const adminName = loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : 'Admin';

  const handleApprovalChange = async (userId, isApproved) => {
    try {
      await axios.post(`https://thdeploy.onrender.com/api/users/approve`, {
        userId,
        approved: isApproved
      });
      setUsers(users.map(user => user._id === userId ? { ...user, approved: isApproved } : user));
    } catch (error) {
      setError('Failed to update approval status');
    }
  };

  const handleViewCOR = (userId) => {
    window.open(`https://thdeploy.onrender.com/api/users/${userId}/cor`, '_blank');
  };

  const openDeleteModal = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      console.log('Attempting to delete user with ID:', userToDelete); // Check ID format
      try {
        await axios.delete(`https://thdeploy.onrender.com/api/users/${userToDelete}`);
        setUsers(users.filter(user => user._id !== userToDelete));
        closeDeleteModal();
      } catch (error) {
        console.log(error.response);  // Log detailed error response
        setError('Failed to delete user');
        closeDeleteModal();
      }
    }
  };

  return (
    
    <div className="App">
      <Header />
      <div className="main-page-users">
        <Sidebar isVisible={sidebarVisible} />
        <div className={`logs ${sidebarVisible ? 'sidebar-open' : ''}`}>
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
            </div>

            {error && <p className="error-message">{error}</p>}

            <table className="data-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Student Number</th>
                  <th>Verified</th>
                  <th>View COR</th>
                  <th>Approved</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(user => (
                  <tr key={user._id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.studentNo}</td>
                    <td>{user.verified ? 'Yes' : 'No'}</td>
                    <td>
                      {user.corFile ? (
                        <button onClick={() => handleViewCOR(user._id)}>View COR</button>
                      ) : (
                        'No COR Uploaded'
                      )}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={user.approved || false}
                        onChange={(e) => handleApprovalChange(user._id, e.target.checked)}
                      />
                    </td>
                    <td>
                    <button className="delete-button-users" onClick={() => openDeleteModal(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-users">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
              <span>Page {currentPage}</span>
              <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastUser >= users.length}>Next</button>
            </div>
          </div>
        </div>
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <button className='confirm-button-users' onClick={confirmDeleteUser}>Confirm</button>
            <button className='cancel-button-users' onClick={closeDeleteModal}>Cancel</button>
          </div>
    

        </div>
      )}

      </div>
      <Footer />

    </div>
    
  );
};

export default UsersPage;
