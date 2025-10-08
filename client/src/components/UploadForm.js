import React, { useState } from "react";
import axios from "axios";

const UploadForm = ({ onClose, onUploadSuccess }) => {
  const [titlename, settitlename] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState(""); // State for custom category
  const [program, setProgram] = useState("");
  const [author, setAuthor] = useState("");
  const [overview, setOverview] = useState("");
  const [thesisdate, setThesisDate] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track if form is being submitted
  const [isButtonClicked, setIsButtonClicked] = useState(false); // State to disable the button after the first click

  const handleSubmit = async (event) => {
    event.preventDefault();

    // If the button has already been clicked, prevent further submission
    if (isButtonClicked) return;

    // Disable the button after the first click
    setIsButtonClicked(true);

    // Prevent multiple submissions if form is already being submitted
    if (isSubmitting) return;

    // If file is not PDF, show an error message
    if (file && file.type !== "application/pdf") {
      setMessage("Please upload a valid PDF file.");
      return;
    }

    setIsSubmitting(true); // Set submitting state to true

    // Set the category to custom category if 'Other' is selected
    const finalCategory = category === "Other" ? customCategory : category;

    const formData = new FormData();
    formData.append("titlename", titlename);
    formData.append("category", finalCategory); // Use finalCategory
    formData.append("program", program);
    formData.append("author", author);
    formData.append("overview", overview);
    formData.append("thesisdate", thesisdate);
    formData.append("thesisPDF", file);

    try {
      const response = await axios.post(
        "https://thdeploy.onrender.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("File uploaded successfully!");
      setIsUploaded(true);

      // Call onUploadSuccess with the new thesis data from the response
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage(error.response?.data?.message || "Error uploading file");
    } finally {
      setIsSubmitting(false); // Reset submitting state after the request
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Upload Thesis</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Title"
              value={titlename}
              onChange={(e) => settitlename(e.target.value)}
              className="form-input"
              required
            />
            {/* Conditionally render select or input based on category selection */}
            {category !== "Other" ? (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="Market System">Market System</option>
                <option value="Management System">Management System</option>
                <option value="Chat Bot">Chat Bot</option>
                <option value="Internet of Things">Internet of Things</option>
                <option value="Inventory and Sales System">
                  Inventory and Sales System
                </option>
                <option value="Repository">Repository</option>
                <option value="Information System">Information System</option>
                <option value="Augmented Reality">Augmented Reality</option>
                <option value="Identification System">
                  Identification System
                </option>
                <option value="Farming Information System">
                  Farming Information System
                </option>
                <option value="Arduino">Arduino</option>
                <option value="Voting System">Voting System</option>
                <option value="Digital Game">Digital Game</option>
                <option value="Detector">Detector</option>
                <option value="Learning Management System">
                  Learning Management System
                </option>
                <option value="Website">Website</option>
                <option value="Monitoring and Tracking System">
                  Monitoring and Tracking System
                </option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)} // Update custom category state
                className="form-input"
                placeholder="Enter custom category"
                required
              />
            )}
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="form-input"
              required
            >
              <option value="" disabled>
                Select Program
              </option>
              <option value="BSCS – Bachelor of Science in Computer Science">
                BSCS – Bachelor of Science in Computer Science
              </option>
              <option value="BSIT – Bachelor of Science in Information Technology">
                BSIT – Bachelor of Science in Information Technology
              </option>
              <option value="BSIS – Bachelor of Science in Information Systems">
                BSIS – Bachelor of Science in Information Systems
              </option>
            </select>
          </div>
          <div className="form-row">
            <textarea
              placeholder="Overview"
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="form-input-overview"
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="form-input"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={thesisdate}
              onChange={(e) => setThesisDate(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-row">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="form-input"
              accept="application/pdf"
              required
            />
          </div>
          <div className="button-row">
            <button
              type="submit"
              className="save-button-upload"
              disabled={isButtonClicked} // Disable the button once clicked
            >
              {isButtonClicked ? "Uploading..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cancel-button-upload"
            >
              Cancel
            </button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default UploadForm;
