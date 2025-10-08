import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MainPage.css";
import DateSelector from "./Date";
import ProfileModal from "./ProfileModal";
import ChatbotModal from "./ChatbotModal";
import Footer from "./Footer";
import Fuse from "fuse.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faSearch,
  faUserCircle,
  faStar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ContactModal from "./ContactModal";
import AboutUs from "./AboutUs";

const MainPage = () => {
  const [theses, setTheses] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDateModalOpen, setDateModalOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isLibraryModalOpen, setLibraryModalOpen] = useState(false);
  const [isChatbotModalOpen, setChatbotModalOpen] = useState(false);
  const [libraryItems, setLibraryItems] = useState([]);
  const [notification, setNotification] = useState("");
  const [pdfSrc, setPdfSrc] = useState("");
  const [isPdfVisible, setPdfVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  //contact modal
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  //AboutUs
  const [isAboutUsOpen, setAboutUsOpen] = useState(false);

  // sort
  const [sortField, setSortField] = useState(null); // "name" or "date"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [selectedCategories, setSelectedCategories] = useState([]);

  // menu open
  const [isMenuOpen, setMenuOpen] = useState(false);

  // get the user data
  const [userName, setUserName] = useState("");
  const [profileIcon, setProfileIcon] = useState("");
  const defaultIcon = "/defaulticon.jpg"; // Path to default profile icon

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const [userContent, setUserContent] = useState(""); // State for storing user content

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from profile endpoint
        const response = await axios.get("http://localhost:5000/profile", {
          withCredentials: true,
        });
        const user = response.data;

        // Set user's name if available
        setUserName(user.name || "");

        // Fetch the user's profile image
        const imageResponse = await axios.get(
          "http://localhost:5000/profile/image",
          {
            responseType: "blob",
            withCredentials: true,
          }
        );

        if (imageResponse.status === 200 && imageResponse.data.size > 0) {
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setProfileIcon(imageUrl);
        } else {
          setProfileIcon(defaultIcon);
        }

        const contentResponse = await axios.get(
          "http://localhost:5000/profile/content",
          {
            withCredentials: true,
          }
        );

        if (contentResponse.status === 200) {
          setUserContent(contentResponse.data.content || "");
        } else {
          setUserContent("No content available");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserContent("Failed to load user content. Please try again.");
      }
    };

    fetchUserData();
  }, []);

  // logout handler
  const handleLogout = () => {
    axios
      .get("http://localhost:5000/logout", { withCredentials: true })
      .then((response) => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        setNotification("Logout failed. Please try again.");
        setTimeout(() => setNotification(""), 3000);
      });
  };

  useEffect(() => {
    axios
    .get("http://localhost:5000/api/theses", { withCredentials: true })
    .then((response) => {
      const activeTheses = response.data.filter((thesis) => !thesis.deleted);
      setTheses(activeTheses);
    })
    .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    // Configure Fuse.js options
    const options = {
      keys: ["titlename", "author", "overview"],
      threshold: 0.5, // Adjust sensitivity (lower means stricter matches)
      includeScore: true,
    };

    const fuse = new Fuse(theses, options);

    const results = query
      ? fuse.search(query).map((result) => result.item)
      : theses;

    // Apply additional filters for categories and years
    const filteredByYearAndCategory = results.filter((thesis) => {
      const matchesYear =
        selectedYears.length === 0 ||
        selectedYears.includes(new Date(thesis.thesisdate).getFullYear());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(thesis.category);

      return matchesYear && matchesCategory;
    });

    // Apply sorting
    if (sortField) {
      filteredByYearAndCategory.sort((a, b) => {
        const aValue =
          sortField === "name" ? a.titlename : new Date(a.thesisdate);
        const bValue =
          sortField === "name" ? b.titlename : new Date(b.thesisdate);
        return (aValue < bValue ? -1 : 1) * (sortOrder === "asc" ? 1 : -1);
      });
    }

    setFilteredResults(filteredByYearAndCategory);
  }, [query, theses, selectedYears, selectedCategories, sortField, sortOrder]);
  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) => {
      // Toggle the category selection
      const updatedCategories = prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category];

      // Reset the page to 1 whenever the category changes
      setCurrentPage(1);

      return updatedCategories;
    });
  };

  // State to track the visibility of each category group
  const [expandedGroups, setExpandedGroups] = useState({
    "Web and Mobile Technologies": false,
    "Enterprise and Business Solutions": false,
    "IoT and Embedded Systems": false,
    "Data Management and Processing": false,
    "AI and Augmented Reality": false,
  });

  const handleGroupToggle = (groupName) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [groupName]: !prevState[groupName],
    }));
  };

  // Function to handle year checkbox changes
  const handleYearChange = (year) => {
    setSelectedYears((prevYears) =>
      prevYears.includes(year)
        ? prevYears.filter((y) => y !== year)
        : [...prevYears, year]
    );
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const toggleProfile = () => setProfileOpen(!isProfileOpen);

  const openProfileModal = () => {
    setProfileModalOpen(true);
    setProfileOpen(false);
  };

  const closeProfileModal = () => setProfileModalOpen(false);

  const closeLibraryModal = () => setLibraryModalOpen(false);

  const openChatbotModal = () => setChatbotModalOpen(true);

  const closeChatbotModal = () => setChatbotModalOpen(false);

  const openDateModal = () => setDateModalOpen(true);

  const closeDateModal = () => setDateModalOpen(false);

  const applyDateSelection = () => {
    closeDateModal();
    handleSearch();
  };

  const handleContactUs = () => {
    setContactModalOpen(true);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
  };

  const handleAboutUs = () => {
    setAboutUsOpen(true);
  };

  const closeAboutUs = () => {
    setAboutUsOpen(false);
  };

  const handleAddToLibrary = (item) => {
    setLibraryItems([...libraryItems, item]);
    setNotification("Added to your library");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    closeProfileModal();
  };

  const handleDeleteFromLibrary = (index) => {
    const updatedLibraryItems = libraryItems.filter((_, i) => i !== index);
    setLibraryItems(updatedLibraryItems);
    setNotification("Removed from your library");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleSearch = () => {};

  const showPDF = (pdf) => {
    const encodedPdf = encodeURIComponent(pdf);
    setPdfSrc(`http://localhost:5000/files/${encodedPdf}#toolbar=0`);
    setPdfVisible(true);
  };

  const [clickedFilenames, setClickedFilenames] = useState([]);

  useEffect(() => {
    const storedFilenames = sessionStorage.getItem("clickedFilenames");
    if (storedFilenames) {
      setClickedFilenames(JSON.parse(storedFilenames));
    }
  }, []);

  const handleTitleClick = (filename) => {

    if (!filename) {
      console.error("Filename is undefined.");
      return;
    }

    // Add the new filename to the existing array of clicked filenames
    const updatedFilenames = [...clickedFilenames, filename];
    setClickedFilenames(updatedFilenames); // Update the state

    const encodedPdf = encodeURIComponent(filename);
    setPdfSrc(`http://localhost:5000/files/${encodedPdf}#toolbar=0`);
    setPdfVisible(true); // Show the PDF iframe
  };

  return (
    <div className="App">
      <header className="header">
        <img src="/thubbg.png" alt="Logo" className="logo" />

        <div className="libchat-button">
          <button
            className="library-button"
            onClick={() => setLibraryModalOpen(true)}
          ></button>
          <img
            src="/chatbotlogo.png"
            alt="chatbotLogo"
            className="Chatbotlogo"
          />
          <button className="chatbot-button" onClick={openChatbotModal}>
            .
          </button>

          {/* Navbar for Contact Us and Logout */}
          <div className="navbar-buttons">
            {/* Contact Us Button */}
            <button className="contact-us-button" onClick={handleContactUs}>
              Contact Us
            </button>

            {/* ContactModal */}
            <ContactModal
              isOpen={isContactModalOpen}
              onClose={closeContactModal} // Pass the close function to the modal
            />
            <button className="about-us-button" onClick={handleAboutUs}>
              About Us
            </button>

            {/* ContactModal */}
            <AboutUs
              isOpen={isAboutUsOpen}
              onClose={closeAboutUs} // Pass the close function to the modal
            />
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            <div className="menu-container">
              <button className="menu-button" onClick={toggleMenu}>
                <img
                  src={profileIcon}
                  alt="Profile Icon"
                  className="profile-icon"
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                  }}
                />
              </button>

              {isMenuOpen && (
                <div className="menu-options">
                  <button
                    className="menu-option-button"
                    onClick={openProfileModal}
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {isPdfVisible && (
        <div className="pdf-overlay">
          <div className="pdf-iframe-container">
            <button
              className="pdf-close-button"
              onClick={() => setPdfVisible(false)}
            >
              Close PDF
            </button>
            <iframe
              src={pdfSrc}
              title="PDF Viewer"
              frameBorder="0"
              className="pdf-iframe"
            ></iframe>
            <div className="blank-overlay" />
          </div>
        </div>
      )}

      <div className="App-results">
        <div className="content">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="sort-dropdown-main">
              <button className="sort-button-main">Sort Order</button>
              <div className="sort-menu-main">
                <button
                  className={`sort-option-logs ${
                    sortField === "name" && sortOrder === "asc" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSortField("name");
                    setSortOrder("asc");
                  }}
                >
                  Name (A-Z)
                </button>

                <button
                  className={`sort-option-logs ${
                    sortField === "name" && sortOrder === "desc" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSortField("name");
                    setSortOrder("desc");
                  }}
                >
                  Name (Z-A)
                </button>

                <button
                  className={`sort-option-logs ${
                    sortField === "date" && sortOrder === "asc" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSortField("date");
                    setSortOrder("asc");
                  }}
                >
                  Date (Oldest)
                </button>

                <button
                  className={`sort-option-logs ${
                    sortField === "date" && sortOrder === "desc" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSortField("date");
                    setSortOrder("desc");
                  }}
                >
                  Date (Newest)
                </button>
              </div>
            </div>
          </div>

          <div className="results">
            {filteredResults.length === 0 ? (
              <p>No results found..</p>
            ) : (
              currentResults.map((result) => (
                <div key={result.thesisid} className="result-item">
                  <p
                    className="result-title"
                    onClick={() => handleTitleClick(result.filename)}
                    style={{
                      cursor: "pointer",
                      opacity: clickedFilenames.includes(result.filename)
                        ? 0.65
                        : 1,
                    }}
                  >
                    {result.titlename}
                  </p>
                  <p className="result-authors">{result.author}</p>
                  <p className="result-overview">{result.overview}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="sidebar-mpage">
          <div className="sidebar-container">
            <br></br>
            <h3>Year:</h3>

            <div className="checkbox-group-mpage">
              <label>
                <input
                  type="checkbox"
                  checked={selectedYears.includes(2023)}
                  onChange={() => handleYearChange(2023)}
                />{" "}
                2023
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedYears.includes(2022)}
                  onChange={() => handleYearChange(2022)}
                />{" "}
                2022
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedYears.includes(2021)}
                  onChange={() => handleYearChange(2021)}
                />{" "}
                2021
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedYears.includes(2020)}
                  onChange={() => handleYearChange(2020)}
                />{" "}
                2020
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedYears.includes(2019)}
                  onChange={() => handleYearChange(2019)}
                />{" "}
                2019
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedYears.includes(2018)}
                  onChange={() => handleYearChange(2018)}
                />{" "}
                2018
              </label>
            </div>
            <h3>Category:</h3>
            <div
              className={`category-dropdown ${
                isExpanded ? "expanded" : "collapsed"
              }`}
            >
              {/* Category Groups */}
              {[
                {
                  title: "Web and Mobile Technologies",
                  options: [
                    "Website",
                    "Mobile Application",
                    "Learning Management System",
                    "Voting System",
                    "Digital Game",
                  ],
                },
                {
                  title: "Enterprise and Business Solutions",
                  options: [
                    "Management System",
                    "Inventory and Sales System",
                    "Information System",
                    "Monitoring and Tracking System",
                  ],
                },
                {
                  title: "IoT and Embedded Systems",
                  options: ["Arduino", "Detector"],
                },
                {
                  title: "Data Management and Processing",
                  options: [
                    "Repository",
                    "Identification System",
                    "Farming Information System",
                  ],
                },
                {
                  title: "AI and Augmented Reality",
                  options: ["Chat Bot", "Augmented Reality"],
                },
              ].map((category) => (
                <div key={category.title} className="category-group">
                  <h3
                    className={expandedGroups[category.title] ? "expanded" : ""}
                    onClick={() => handleGroupToggle(category.title)}
                  >
                    {category.title}
                  </h3>
                  {expandedGroups[category.title] && (
                    <>
                      {category.options.map((option) => (
                        <label key={option}>
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(option)}
                            onChange={() => handleCategoryChange(option)}
                          />{" "}
                          {option}
                        </label>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>

            <button
              className="see-more-button"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "" : ""}
            </button>
          </div>
        </div>

        <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />

        <ChatbotModal isOpen={isChatbotModalOpen} onClose={closeChatbotModal} />

        {notification && (
          <div className="notification-container">
            <p className="notification-message">{notification}</p>
          </div>
        )}
      </div>
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
