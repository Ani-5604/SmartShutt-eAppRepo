import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Styles/forgetPassword.module.css';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();  // Used for navigation

  // Email validation regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setNotification(null);  // Clear previous notification on input change
  };

  // Handle OTP send request
  const handleSendOTP = async (e) => {
    e.preventDefault();  // Prevent default form submission

    if (!email || !validateEmail(email)) {
      setNotification("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8070/user/submit-otp', { email });
      setIsLoading(false);

      if (response.data.status === 'Success') {
        // Redirect to the OTP verification page with the email passed in the state
        navigate('/verify-otp', { state: { email } });
      } else {
        setNotification(response.data.message);  // Show server-side error message
      }
    } catch (error) {
      setIsLoading(false);
      setNotification(error.response?.data?.message || "Error sending OTP. Please try again.");
    }
  };

  return (
    <div className={styles.center}>
      <h1>Forgot Password</h1>
      {notification && <p className={styles.notification}>{notification}</p>} {/* Notification message */}
      
      {/* Form for email input */}
      <form onSubmit={handleSendOTP} className={styles.form}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          className={styles.input}
          required
        />
        <button 
          type="submit"
          className={styles.button} 
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}

export default ForgetPassword;
