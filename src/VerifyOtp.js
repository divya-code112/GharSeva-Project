import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

function VerifyOtp() {

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;   // get email from register

  const handleVerify = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );

      setMessage("✅ " + res.data.message);

      // After verification redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Invalid OTP"));
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg,#4e73df,#1cc88a)"
    },
    card: {
      background: "#fff",
      padding: "30px",
      width: "350px",
      borderRadius: "15px",
      textAlign: "center"
    },
    logo: {
      width: "70px",
      marginBottom: "10px"
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "8px",
      border: "1px solid #ccc"
    },
    button: {
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "none",
      background: "#4e73df",
      color: "white",
      fontSize: "16px",
      cursor: "pointer"
    },
    message: {
      marginTop: "10px",
      fontWeight: "bold",
      color: message.includes("❌") ? "red" : "green"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <img src={logo} alt="logo" style={styles.logo} />
        <h2>Verify OTP</h2>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Verify
          </button>
        </form>

        {message && <div style={styles.message}>{message}</div>}

      </div>
    </div>
  );
}

export default VerifyOtp;