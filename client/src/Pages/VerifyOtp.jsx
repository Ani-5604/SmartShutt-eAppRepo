import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from '../Styles/verifyOtp.module.css';

function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};  // Retrieve the email from the previous page state

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setNotification(null);  // Clear previous notification
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
  
    if (!otp || otp.length !== 6) {
      setNotification("Please enter a valid 6-digit OTP.");
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8070/user/verify-otp', {
        email,  // Make sure the email is being passed correctly
        otp,    // OTP entered by the user
      });
  
      setIsLoading(false);
  
      if (response.data.status === "Success") {
        navigate('/reset-password', { state: { email } });  // Redirect to reset password page
      } else {
        setNotification(response.data.message);  // Show error if OTP is incorrect
      }
    } catch (error) {
      setIsLoading(false);
      setNotification(error.response?.data?.message || "Error verifying OTP. Please try again.");
    }
  };
  
  return (
    <div className={styles.center}>
      <h1>Verify OTP</h1>
      {notification && <p className={styles.notification}>{notification}</p>}
      <form onSubmit={handleVerifyOtp} className={styles.form}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleOtpChange}
          className={styles.input}
          maxLength="6"
          required
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}

export default VerifyOtp;
