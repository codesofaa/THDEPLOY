import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminsPage.css';
import Sidebar from './SASidebar';
import './SASidebar.css';
import Header from './Header';
import Footer from './Footer';

const AdminPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false); // New state for Add Admin modal
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [showEditModal, setShowEditModal] = useState(false); // New state for Edit Admin modal
const [adminToEdit, setAdminToEdit] = useState(null); // Store the admin being edited
const [editAdmin, setEditAdmin] = useState({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://thdeploy.onrender.com/api/admins/');
        setAdmins(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  // Pagination Logic
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter admins based on search query
  const filteredData = currentAdmins.filter(admin =>
    (admin.firstName && admin.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (admin.lastName && admin.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (admin.email && admin.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAccessChange = async (adminId, hasAccess) => {
    try {
      await axios.post(`https://thdeploy.onrender.com/api/admins/access`, {
        adminId,
        access: hasAccess
      });
      // Update state with the new access value
      setAdmins(admins.map(admin => admin._id === adminId ? { ...admin, access: hasAccess } : admin));
    } catch (error) {
      setError('Failed to update access status');
    }
  };
  

  // Handle delete action
  const openDeleteModal = (adminId) => {
    setAdminToDelete(adminId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setAdminToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDeleteAdmin = async () => {
    if (adminToDelete) {
      try {
        await axios.delete(`https://thdeploy.onrender.com/api/admins/${adminToDelete}`);
        setAdmins(admins.filter(admin => admin._id !== adminToDelete));
        closeDeleteModal();
      } catch (error) {
        setError('Failed to delete admin');
        closeDeleteModal();
      }
    }
  };

  // Open and close Add Admin modal
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  // Handle add admin form submission
  const handleAddAdminChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prevAdmin) => ({ ...prevAdmin, [name]: value }));
  };

  const handleAddAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://thdeploy.onrender.com/api/admins/', newAdmin);
      setAdmins([...admins, response.data]); // Add new admin to state
      closeAddModal();
      setNewAdmin({ firstName: '', lastName: '', email: '', password: '' }); // Clear form
    } catch (error) {
      setError('Failed to add new admin');
    }
  };

  const openEditModal = (admin) => {
    setAdminToEdit(admin);
    setEditAdmin({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      password: ''  // You may choose to leave the password empty for edit, or leave it as is
    });
    setShowEditModal(true);
  };
  
  const closeEditModal = () => {
    setAdminToEdit(null);
    setShowEditModal(false);
  };

  const handleEditAdminChange = (e) => {
    const { name, value } = e.target;
    setEditAdmin(prevAdmin => ({
      ...prevAdmin,
      [name]: value
    }));
  };

  const handleEditAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://thdeploy.onrender.com/api/admins/${adminToEdit._id}`, editAdmin);
      // Update the state with the new details after successful update
      setAdmins(admins.map(admin => admin._id === adminToEdit._id ? response.data : admin));
      closeEditModal();
    } catch (error) {
      setError('Failed to update admin');
    }
  };
  

  return (
    <div className="App">
      <Header />
      <div className="main-page-admins">
        <Sidebar isVisible={sidebarVisible} />
        <div className={`contents ${sidebarVisible ? 'sidebar-open' : ''}`}>
          <h1 className="greeting">SUPER ADMIN</h1>
          <div className="table-container">
            <div className="top-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-bar-super-admins"
              />
              <button onClick={openAddModal} className="add-admin-button"><span className="plus-icon">+</span>Add Admin</button> {/* Add Admin Button */}
            </div>

            {error && <p className="error-message">{error}</p>}

            <table className="data-table-super-admin">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Access</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(admin => (
                  <tr key={admin._id}>
                    <td>{admin.firstName}</td>
                    <td>{admin.lastName}</td>
                    <td>{admin.email}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={admin.access || false}
                        onChange={(e) => handleAccessChange(admin._id, e.target.checked)}
                      />
                    </td>
                    <td>
  <button className="edit-button-super-admin" onClick={() => openEditModal(admin)}>Edit</button>
</td>
<td>
  <button className="delete-button-super-admin" onClick={() => openDeleteModal(admin._id)}>Delete</button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-super-admin">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
              <span>Page {currentPage}</span>
              <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastAdmin >= admins.length}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
  <div className="modal">
    <div className="modal-content">
      <h2>Edit Admin</h2>
      <form onSubmit={handleEditAdminSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={editAdmin.firstName}
          onChange={handleEditAdminChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={editAdmin.lastName}
          onChange={handleEditAdminChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={editAdmin.email}
          onChange={handleEditAdminChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={editAdmin.password}
          onChange={handleEditAdminChange}
        />
        <button type="submit">Update Admin</button>
        <button type="button" onClick={closeEditModal}>Cancel</button>
      </form>
    </div>
  </div>
)}


      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this admin?</p>
            <button onClick={confirmDeleteAdmin}className='confirm-button-super-admin'>Confirm</button>
            <button onClick={closeDeleteModal}className='cancel-button-super-admin' >Cancel</button>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Admin</h2>
            <form onSubmit={handleAddAdminSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newAdmin.firstName}
                onChange={handleAddAdminChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newAdmin.lastName}
                onChange={handleAddAdminChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={handleAddAdminChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={handleAddAdminChange}
                required
              />
              <button type="submit">Add Admin</button>
              <button type="button" onClick={closeAddModal}>Cancel</button>
            </form>
          </div>
          
        </div>
        
      )}
      
      <Footer />
    </div>
  );
}

export default AdminPage;
