import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import Footer from './Footer'; 
import 'font-awesome/css/font-awesome.min.css';
import TermsModal from './TermsModal'; // Import the modal component

const RegisterForm = ({ onSwitchToLogin }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [studentNo, setStudentNo] = useState('');
    const [corFile, setCorFile] = useState(null); // Added state for COR file
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false); // State for modal visibility
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state for tracking submission

    const navigate = useNavigate();


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setCorFile(file);
        } else {
            setErrorMessage('Please upload a PDF file.');
            setCorFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            setSuccessMessage('');
            return;
        }

        if (!agreeToTerms) {
            setErrorMessage('You must agree to the Terms and Conditions to proceed.');
            return;
        }

        // Start loading state
        setIsLoading(true);

        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('studentNo', studentNo);
        formData.append('corFile', corFile);

        try {
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('studentNo', studentNo);
            formData.append('corFile', corFile); // Adding the COR file to FormData
        
            const response = await axios.post('https://thdeploy.onrender.com/signup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Important for file uploads
                }
            });

            if (response.data.status === 'FAILED') {
                setErrorMessage(response.data.message);
                setSuccessMessage('');
            } else {
                setSuccessMessage('Registration successful! Please verify your email.');
                setErrorMessage('');
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (error) {
            setErrorMessage('An error occurred during registration. Please try again.');
            setSuccessMessage('');
            console.error('Registration failed', error);
        } finally {
            // End loading state
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <main className="main-content">
                <div className="welcome-section">
                    <h1>Welcome to Thesis Hub, Code Hearted Fox!</h1>
                    <p>Explore, and discover academic research with ease. Thesis HUB connects students, educators, and researchers, making it simple to access and share valuable theses and dissertations across various disciplines.</p>
                </div>

                <div className="login-form">
                    <h2>Register</h2>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input 
                                type="fname" 
                                placeholder="First Name" 
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="lname" 
                                placeholder="Last Name" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <div className="password-container">
                                <input
                                    type={showPassword ? 'showpassword' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                                      {/* EYE SLASH
                                    <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i> */}
                                </span>
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="password-container">
                                <input
                                    type={showConfirmPassword ? 'showpassword' : 'password'}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-password">
                                     {/* EYE SLASH
                                    <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i> */}
                                </span>
                            </div>
                        </div>
                        <div className="input-group">
                            <input 
                                type="snumber" 
                                placeholder="Student No" 
                                value={studentNo} 
                                onChange={(e) => setStudentNo(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="file" 
                                accept="application/pdf" 
                                onChange={handleFileChange}
                                required 
                            />
                            <small>Upload your Certificate of Registration (PDF only)</small>
                        </div>
                        <div className="input-group checkbox-group">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                required
                            />
                            <label htmlFor="agreeToTerms">
                                I agree to the{' '}
                                <span
                                    className="terms-link"
                                    onClick={() => setShowTermsModal(true)}
                                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Terms and Conditions
                                </span>
                            </label>
                        </div>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                    <p>
                        Already have an account? 
                        <span onClick={onSwitchToLogin} className="switch-link">Login</span>
                    </p>
                </div>
            </main>
            <Footer />
            <TermsModal
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
            />
        </div>
    );
}

export default RegisterForm;
