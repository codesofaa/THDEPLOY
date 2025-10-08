import React from 'react';
import './TermsModal.css'; // Optional: Add specific styles for the modal if needed

const TermsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Render nothing if the modal is not open

    return (
        <div className="modal-terms">
            <div className="modal-content-terms">
            <h2 style={{ textAlign: 'center' }}>Terms and Conditions</h2>
                <div className="terms-text">
             
                    <h3>Welcome to Thesis Hub!</h3>
                    <p>By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.</p>

                    <h4>Acceptance of Terms</h4>
                    <p>By using Thesis Hub, you acknowledge that you have read, understood, and agree to these Terms and Conditions. This agreement governs your access to and use of our services, including browsing, viewing, downloading, or interacting with any thesis or content on the platform.</p>

                    <h4>Purpose of Use</h4>
                    <p>Thesis Hub provides access to theses and research materials for educational and informational purposes only. You agree not to:</p>
                    <ul>
                        <li>Use any content for commercial purposes without proper authorization.</li>
                        <li>Copy, distribute, or publish content without explicit permission from the rightful owner.</li>
                        <li>Engage in any activity that violates intellectual property rights or applicable laws.</li>
                    </ul>

                    <h4>Intellectual Property</h4>
                    <p>All content available on Thesis Hub, including theses, research papers, and other materials, remains the intellectual property of their respective authors and contributors. Unauthorized use of any material, including reproduction, redistribution, or commercial exploitation, is strictly prohibited.</p>

                    <h4>User Responsibility</h4>
                    <p>You agree to use the platform responsibly and acknowledge that you are solely accountable for:</p>
                    <ul>
                        <li>Ensuring any use of the content complies with copyright and intellectual property laws.</li>
                        <li>Avoiding unauthorized duplication, distribution, or plagiarism of the materials.</li>
                        <li>Adhering to all applicable laws and regulations in your jurisdiction.</li>
                    </ul>
                    <p>Failure to comply may result in legal consequences.</p>

                    <h4>Privacy and Data Security</h4>
                    <p>Thesis Hub prioritizes data privacy and security. However:</p>
                    <ul>
                        <li>You agree to provide accurate and lawful information when registering or using our services.</li>
                        <li>Any misuse of the platform, including attempts to compromise its security, is strictly prohibited.</li>
                    </ul>

                    <h4>Prohibited Activities</h4>
                    <p>Users are strictly prohibited from:</p>
                    <ul>
                        <li>Accessing or using the platform for illegal activities.</li>
                        <li>Circumventing any measures implemented to prevent unauthorized access to restricted areas of the website.</li>
                        <li>Sharing or distributing malicious software or engaging in activities that harm the platform or its users.</li>
                    </ul>

                    <h4>Accountability for Misuse</h4>
                    <p>Users agree to accept full responsibility for any illegal activities, including but not limited to:</p>
                    <ul>
                        <li>Unauthorized copying or plagiarism of content.</li>
                        <li>Violation of data privacy laws, including the General Data Protection Regulation (GDPR) or similar laws applicable in your region.</li>
                        <li>Sharing, downloading, or redistributing content without proper permissions.</li>
                    </ul>
                    <p>Thesis Hub reserves the right to take necessary legal action or suspend access for violations.</p>

                    <h4>Disclaimer of Liability</h4>
                    <p>Thesis Hub does not guarantee the accuracy, completeness, or reliability of any content provided on the platform. The content is offered "as is" and for informational purposes only. We are not responsible for user misuse or legal issues arising from improper use of the materials.</p>

                    <h4>Governing Law</h4>
                    <p>These Terms and Conditions are governed by the laws of [Insert Jurisdiction]. By using Thesis Hub, you agree to submit to the exclusive jurisdiction of the courts in [Insert Jurisdiction] for the resolution of any disputes.</p>

                    <h4>Changes to Terms</h4>
                    <p>Thesis Hub reserves the right to modify these Terms and Conditions at any time. Users will be notified of significant changes through the website or email. Continued use of the platform signifies acceptance of any revised terms.</p>

                    <h4>Contact Us</h4>
                    <p>If you have questions about these Terms and Conditions, please contact us at:</p>
                    <p>Email: <a href="mailto:thesishubit@gmail.com">thesishubit@gmail.com</a></p>
                </div>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
};

export default TermsModal;
