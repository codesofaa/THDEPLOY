import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';
import Footer from './Footer';

const LoginForm = ({ onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [retryTimeout, setRetryTimeout] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`https://thdeploy.onrender.com/login`, {
                email,
                password
            }, {
                withCredentials: true
            });


            if (response.data.success) {
                // Save the token and user info in localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('loggedInUser', JSON.stringify(response.data.user));
                
                login(response.data.user.role);

                // Handle role-based redirection
                if (response.data.user.role === 'superadmin') {
                    navigate('/adminlogs'); // Redirect to superadmin dashboard
                } else if (response.data.user.role === 'admin') {
                    navigate('/theses'); // Redirect to theses page for admin
                } else {
                    navigate('/main'); // Redirect to main page for regular users
                }
            } else {
                setErrorMessage(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred during login. Please try again.');
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setForgotPasswordMessage('');
        
        try {
            const response = await axios.post(`https://thdeploy.onrender.com/forgot-password`, { email: forgotEmail });
            setForgotPasswordMessage(response.data.message || 'Successfully sent to your email, please check your inbox.');
            
            // Simulate 5-minute timeout for frontend enforcement
            if (!retryTimeout) {
                setRetryTimeout(300); // 5 minutes in seconds
                const interval = setInterval(() => {
                    setRetryTimeout((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            return null;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'An error occurred. Please try again.';
            setForgotPasswordMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <main className="main-content">
                {/* Left panel with welcome message */}
                <div className="welcome-section">
                    <h1><b>Welcome to Thesis Hub, Code Hearted Fox!</b></h1>
                    <p><strong>Explore, and discover academic research with ease. Thesis HUB connects students, educators, and researchers, making it simple to access and share valuable theses and dissertations across various disciplines.</strong></p>
                 {/* Add the GIF here */}
                </div>

                {/* Right panel with login form */}
                <div className="login-form">
                    <h2>Login</h2>
                    <p>Enter your account to continue with Thesis HUB</p>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <form onSubmit={handleSubmit}>
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

                        <button type="submit">Confirm</button>
                    </form>
                    <p>
                        Don't have an account?{' '}
                        <span onClick={onSwitchToRegister} className="switch-link">Register</span>
                    </p>
                    <p>
                        <span
                            onClick={() => setIsForgotPasswordModalOpen(true)}
                            className="forgot-password-link"
                        >
                            Forgot Password
                        </span>
                    </p>
                </div>
            </main>

            {isForgotPasswordModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Forgot Password</h3>
                        <p>Enter your email to reset your password.</p>
                        {forgotPasswordMessage && <p className="success-message">{forgotPasswordMessage}</p>}
                        <form onSubmit={handleForgotPasswordSubmit}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                    disabled={loading || retryTimeout}
                                />
                            </div>
                            <button type="submit" disabled={loading || retryTimeout}>
                                {loading ? 'Sending...' : 'Submit'}
                            </button>
                            {retryTimeout && <p>Please wait {retryTimeout} seconds before trying again.</p>}
                            <button onClick={() => setIsForgotPasswordModalOpen(false)} className="close-modal">
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default LoginForm;
