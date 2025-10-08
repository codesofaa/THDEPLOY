import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css';
import Header from './Header';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
    const { token, userId } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:5000/reset-password/${token}/${userId}`, {
                newPassword,
            });
            setMessage(response.data.message || 'Password reset successful.');
            if (response.data.message === 'Password reset successful.') {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="reset-password-wrapper">
            <Header />
            <main className="main-content-rp">
                <div className="reset-password-container">
                    <h2>Reset Password</h2>
                    {message && <p className="message">{message}</p>}
                    <form onSubmit={handleResetPassword}>
                        <div className="input-group-reset">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group-reset">
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};


export default ResetPassword;
