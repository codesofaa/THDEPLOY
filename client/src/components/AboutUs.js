// ContactModal.js
import React from 'react';
import './AboutUs.css'; // Assuming you will create a CSS file for styling the modal

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;  // Don't render the modal if it's not open

  return (
    <div className="about-us-modal-overlay">
      <div className="about-us-modal-content">
        <button className="about-us-modal-close" onClick={onClose}>X</button>
        <h2>About Us</h2>
        <p>

        Welcome to <strong>Thesis HUB</strong>, the home of research and innovation for the College of Computing Studies at Don Honorio Ventura State University. <br></br><br></br>

        We created this platform to make it easier for everyone—students, faculty, and researchers—to access and share the amazing work being done in our department. Thesis HUB serves as a digital archive where theses, capstone projects, and research outputs are preserved, celebrated, and made accessible to inspire future ideas and breakthroughs.
    <br></br><br></br>
        <strong>Our Mission</strong><br></br>
        We aim to provide a space where the hard work of our students and faculty is recognized and preserved, while also fostering an environment of learning, collaboration, and innovation.<br></br><br></br>

        <strong>Our Vision</strong><br></br>
        To become a go-to resource for research in computing and IT, inspiring students and faculty to push boundaries and create meaningful change within and beyond our university.<br></br><br></br>

        <strong>What We Offer</strong><br></br>
        <strong>Easy Access:</strong> A collection of theses and capstone projects you can explore anytime, anywhere.<br></br>
        <strong>Knowledge for All:</strong> A place where ideas live on and are shared with the next generation.<br></br>
        <strong>Inspiration Hub:</strong> Discover past works to guide your own research and spark creativity.<br></br>
        <strong>Support System:</strong> A resource to help you navigate the research process and achieve academic success.<br></br><br></br>
        At <strong>Thesis HUB</strong>, we believe in the power of collaboration and learning from one another. This platform is more than just a repository—it’s a celebration of your hard work and a tool to help you reach your goals. Whether you’re looking for inspiration, resources, or simply a glimpse into the incredible projects happening in our college, Thesis HUB is here for you.<br></br>
        <br></br>
        <strong>Together, let’s continue to innovate and shape the future of computing!</strong></p>

      </div>
    </div>
  );
};

export default ContactModal;
