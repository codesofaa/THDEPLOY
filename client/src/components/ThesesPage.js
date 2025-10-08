import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ThesesPage.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import UploadForm from "./UploadForm";
import EditForm from "./EditForm";

const ThesesPage = () => {
  const [theses, setTheses] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thesisToDelete, setThesisToDelete] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditFormModalOpen, setIsEditFormModalOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);

  // Sorting
  const [sortColumn, setSortColumn] = useState(false); // Track the column being sorted
  const [sortOrder, setSortOrder] = useState("asc"); // Ascending or descending order

  useEffect(() => {
    axios
      .get("https://thdeploy.onrender.com/api/theses", { withCredentials: true })
      .then((response) => {
        const activeTheses = response.data.filter((thesis) => !thesis.deleted);
        setTheses(activeTheses);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const refreshTheses = () => {
    axios
      .get("https://thdeploy.onrender.com/api/theses", { withCredentials: true })
      .then((response) => {
        const activeTheses = response.data.filter((thesis) => !thesis.deleted);
        setTheses(activeTheses);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleUploadSuccess = (newThesis) => {
    refreshTheses(); // Re-fetch data to show the latest theses
    // Update the theses state to include the newly uploaded thesis
    setTheses((prevTheses) => [...prevTheses, newThesis]);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const addThesis = () => {
    openFormModal();
  };

  const editThesis = (thesis) => {
    setSelectedThesis(thesis);
    setIsEditFormModalOpen(true);
  };

  const openModal = (id) => {
    setIsModalOpen(true);
    setThesisToDelete(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setThesisToDelete(null);
  };

  const confirmDelete = () => {
    axios
      .delete(`https://thdeploy.onrender.com/api/thesis/${thesisToDelete}`)
      .then(() => {
        setTheses(theses.filter((thesis) => thesis._id !== thesisToDelete));
        closeModal();
      })
      .catch((err) => {
        setError(err.message);
        closeModal();
      });
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  const closeEditFormModal = () => {
    setIsEditFormModalOpen(false);
    setSelectedThesis(null);
  };

  const filteredTheses = theses.filter((thesis) => {
    const title = thesis.titlename?.toLowerCase() ?? "";
    const category = thesis.category?.toLowerCase() ?? "";
    const program = thesis.program?.toLowerCase() ?? "";
    const author = thesis.author?.toLowerCase() ?? "";
    const search = searchQuery.toLowerCase();
  
    return (
      title.includes(search) ||
      category.includes(search) ||
      program.includes(search) ||
      author.includes(search)
    );
  });

  const indexOfLastThesis = currentPage * resultsPerPage;
  const indexOfFirstThesis = indexOfLastThesis - resultsPerPage;

  const totalPages = Math.ceil(filteredTheses.length / resultsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Retrieve admin's name from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const adminName = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "Admin";

  // for sorting
  const sortedTheses = [...filteredTheses].sort((a, b) => {
    if (!sortColumn) return 0; // If no sort column is selected, don't sort

    const valA = a[sortColumn];
    const valB = b[sortColumn];

    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }

    return 0;
  });

  const currentTheses = sortedTheses.slice(
    indexOfFirstThesis,
    indexOfLastThesis
  );

  // sorting handler
  const handleSortChange = (e) => {
    const [column, order] = e.target.value.split("-");
    setSortColumn(column);
    setSortOrder(order);
  };

  // sorting handler
  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle sorting order if the same column is clicked again
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending order
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="admin-page">
        <Sidebar isVisible={sidebarVisible} />
        <div className={`content-log${sidebarVisible ? "sidebar-open" : ""}`}>
          <h1 className="greeting">Good day, {adminName}!</h1> {/* Greeting */}
          <div className="table-container">
            {" "}
            {/* Container box around the table */}
            <div className="top-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar-users"
              />

              <button onClick={addThesis} className="upload-button">
                <span className="plus-icon">+</span> Upload{" "}
              </button>
            </div>
            {/* NEW DROPDOWN ADDED FOR SORTING */}
            <div className="sort-dropdown-theses">
              <select
                onChange={handleSortChange}
                value={`${sortColumn}-${sortOrder}`}
              >
                <option value="titlename-asc">Sort by Title (A-Z)</option>
                <option value="titlename-desc">Sort by Title (Z-A)</option>
                <option value="category-asc">Sort by Category (A-Z)</option>
                <option value="category-desc">Sort by Category (Z-A)</option>
                <option value="program-asc">Sort by Program (A-Z)</option>
                <option value="program-desc">Sort by Program (Z-A)</option>
                <option value="author-asc">Sort by Author (A-Z)</option>
                <option value="author-desc">Sort by Author (Z-A)</option>
                <option value="thesisdate-asc">Sort by Year (Old-New)</option>
              </select>
            </div>
            <br></br>
            <br></br>
            <br></br>
          </div>
          {error && <p>Error: {error}</p>}
          <table className="theses-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("titlename")}>
                  Title{" "}
                  {sortColumn === "titlename" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("category")}>
                  Category{" "}
                  {sortColumn === "category" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("program")}>
                  Program{" "}
                  {sortColumn === "program" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Overview</th>
                <th onClick={() => handleSort("author")}>
                  Author{" "}
                  {sortColumn === "author" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("thesisdate")}>
                  Year{" "}
                  {sortColumn === "thesisdate" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTheses.map((thesis) => (
                <tr key={thesis._id}>
                  <td>{thesis.titlename}</td>
                  <td>{thesis.category}</td>
                  <td>{thesis.program}</td>
                  <td>
                    <div className="scrollable-overview">{thesis.overview}</div>
                  </td>
                  <td>{thesis.author}</td>
                  <td>{thesis.thesisdate}</td> {/* Display thesisdate */}
                  <td>{thesis.filename}</td>
                  <td>
                    <button
                      onClick={() => editThesis(thesis)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openModal(thesis._id)}
                      className="delete-button-theses"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-theses">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        {/* Form Modal */}
        {isFormModalOpen && (
                <UploadForm onClose={closeFormModal} onUploadSuccess={handleUploadSuccess} />
            )}

        {/* Edit Form Modal */}
        {isEditFormModalOpen && selectedThesis && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Thesis</h2>
              <EditForm
                thesis={selectedThesis}
                onClose={closeEditFormModal}
                onUpdate={(updatedThesis) => {
                  setTheses(
                    theses.map((thesis) =>
                      thesis._id === updatedThesis._id ? updatedThesis : thesis
                    )
                  );
                  closeEditFormModal();
                }}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this thesis?</p>
              <div className="modal-buttons">
                <button onClick={confirmDelete} className="confirm-button">
                  Confirm
                </button>
                <button onClick={closeModal} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      
      </div>
      <Footer />
    </div>
  );
};

export default ThesesPage;
