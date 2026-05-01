import React, { useState } from "react";
import axios from "axios";
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    serviceType: "",
    experience: "",
    aadhaarNumber: "",
    idProofImage: null,
    certificateImage: null,
    profilePhoto: null
  });

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {

    if (e.target.type === "file") {

      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        return setMessage("❌ Only image files allowed");
      }

      setForm({ ...form, [e.target.name]: file });

      setPreview({
        ...preview,
        [e.target.name]: URL.createObjectURL(file)
      });

    } else {

      if (e.target.name === "aadhaarNumber") {
        const onlyNumbers = e.target.value.replace(/\D/g, "");
        setForm({ ...form, aadhaarNumber: onlyNumbers });
      } else {
        setForm({ ...form, [e.target.name]: e.target.value });
      }
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {

    e.preventDefault();
    setMessage("");

    try {

      if (role === "provider" && form.aadhaarNumber.length !== 12) {
        return setMessage("❌ Aadhaar must be 12 digits");
      }

      const formData = new FormData();

      Object.keys(form).forEach(key => {
        if (form[key]) formData.append(key, form[key]);
      });

      formData.append("role", role);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      // 🔥 SHOW DIFFERENT MESSAGE BASED ON ROLE
      if (role === "provider") {
        setMessage("✅ Registered successfully. Wait for admin approval email.");
      } else {
        setMessage("✅ Registered successfully. You can login now.");
      }

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Registration failed"));
    }
  };

  /* ================= STYLES ================= */
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg,#4e73df,#1cc88a)",
      fontFamily: "Arial"
    },
    card: {
      background: "#fff",
      padding: "30px",
      width: "420px",
      borderRadius: "15px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      maxHeight: "90vh",
      overflowY: "auto",
      textAlign: "center"
    },
    logo: {
      width: "80px",
      marginBottom: "5px"
    },
    title: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "15px"
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc"
    },
    select: {
      width: "100%",
      padding: "10px",
      marginBottom: "12px",
      borderRadius: "8px"
    },
    button: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      background: "#4e73df",
      color: "white",
      fontSize: "16px",
      cursor: "pointer"
    },
    preview: {
      width: "80px",
      height: "80px",
      objectFit: "cover",
      marginBottom: "10px",
      borderRadius: "8px"
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

        <img src={logo} alt="Gharseva Logo" style={styles.logo} />
        <div style={styles.title}>Gharseva Register</div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">

          {/* ROLE SELECT */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
          >
            <option value="user">User</option>
            <option value="provider">Provider</option>
          </select>

          {/* COMMON FIELDS */}
          <input type="text" name="name" placeholder="Full Name"
            style={styles.input} onChange={handleChange} required />

          <input type="email" name="email" placeholder="Email"
            style={styles.input} onChange={handleChange} required />

          <input type="password" name="password" placeholder="Password"
            style={styles.input} onChange={handleChange} required />

          <input type="text" name="phone" placeholder="Phone Number"
            style={styles.input} onChange={handleChange} required />

          {/* PROVIDER ONLY */}
          {role === "provider" && (
            <>
              <input type="text" name="serviceType"
                placeholder="Service Type"
                style={styles.input} onChange={handleChange} required />

              <input type="number" name="experience"
                placeholder="Years of Experience"
                style={styles.input} onChange={handleChange} required />

              <input type="text" name="aadhaarNumber"
                placeholder="Aadhaar Number (12 digits)"
                style={styles.input}
                value={form.aadhaarNumber}
                onChange={handleChange}
                required
              />

              <label>ID Proof</label>
              <input type="file" name="idProofImage"
                style={styles.input} onChange={handleChange} required />
              {preview.idProofImage && (
                <img src={preview.idProofImage} style={styles.preview} alt="" />
              )}

              <label>Certificate</label>
              <input type="file" name="certificateImage"
                style={styles.input} onChange={handleChange} required />
              {preview.certificateImage && (
                <img src={preview.certificateImage} style={styles.preview} alt="" />
              )}

              <label>Profile Photo</label>
              <input type="file" name="profilePhoto"
                style={styles.input} onChange={handleChange} required />
              {preview.profilePhoto && (
                <img src={preview.profilePhoto} style={styles.preview} alt="" />
              )}
            </>
          )}

          <button type="submit" style={styles.button}>
            Register
          </button>

        </form>
       <div style={{ marginTop: "15px" }}>
  <p style={{ fontSize: "14px" }}>
    Already have an account?{" "}
    <Link
      to="/login"
      style={{
        color: "#4e73df",
        fontWeight: "bold",
        textDecoration: "none"
      }}
    >
      Login
    </Link>
  </p>
</div>
        {message && <div style={styles.message}>{message}</div>}

      </div>
    </div>
  );
}

export default Register;