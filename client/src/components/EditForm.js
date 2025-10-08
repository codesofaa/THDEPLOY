import React, { useState } from 'react';
import axios from 'axios';

const EditForm = ({ thesis, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...thesis });
    const [file, setFile] = useState(null); // State for the new file
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Set the selected file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedThesis = new FormData(); // Using FormData for file uploads

        // Append the updated thesis data to FormData
        updatedThesis.append('titlename', formData.titlename);
        updatedThesis.append('category', formData.category);
        updatedThesis.append('program', formData.program);
        updatedThesis.append('overview', formData.overview);
        updatedThesis.append('author', formData.author);
        updatedThesis.append('thesisdate', formData.thesisdate); // Append the updated thesis date

        // Append the new file if it exists
        if (file) {
            updatedThesis.append('file', file);
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/thesis/${thesis._id}`, updatedThesis, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUpdate(response.data); // Pass the updated thesis back to ThesesPage
            setMessage('Thesis updated successfully!');
            setTimeout(onClose, 2000); // Close modal after short delay
        } catch (error) {
            console.error('Error updating thesis:', error);
            setMessage('Error updating thesis');
        }
    };

    return (
        <div className="upload-form-modal">
            <div className="upload-form-content">
            
                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-group">
                        <input
                            type="text"
                            name="titlename"
                            placeholder="Title"
                            value={formData.titlename}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="program"
                            placeholder="Program"
                            value={formData.program}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="overview"
                            placeholder="Overview"
                            value={formData.overview}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="author"
                            placeholder="Author"
                            value={formData.author}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="thesisdate"
                            placeholder="Date"
                            value={formData.thesisdate}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="form-input"
                            accept="application/pdf"
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="submit-button">Save</button>
                        <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                    </div>
                </form>
                {message && <p className="error-message">{message}</p>}
            </div>
        </div>
    );
};

export default EditForm;
