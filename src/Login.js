import React, { useState } from "react";
import axios from "axios";
import logo from "./assets/logo.png";
import { useNavigate,Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
     const { token, role, user } = res.data;
      // Save token
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } 
      else if (role === "provider") {
        navigate("/provider/dashboard");
      } 
      else {
        navigate("/");
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #4e73df, #1cc88a)"
    }}>
      <div style={{
        background: "#fff",
        padding: "40px",
        width: "380px",
        borderRadius: "15px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>

        <img src={logo} alt="Logo" width="80" />
        <h2>Gharseva Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <button type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#4e73df",
              color: "white",
              border: "none",
              borderRadius: "8px"
            }}>
            Login
          </button>
        </form>

      <div style={{ marginTop: "15px" }}>
  <p style={{ fontSize: "14px" }}>
    <Link to="/forgot-password" style={{ color: "#4e73df", textDecoration: "none" }}>
      Forgot Password?
    </Link>
  </p>

  <p style={{ fontSize: "14px", marginTop: "5px" }}>
    Don't have an account?{" "}
    <Link to="/register" style={{ color: "#1cc88a", textDecoration: "none" }}>
      Register
    </Link>
  </p>
</div>
        {message && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {message}
          </p>
        )}

      </div>
    </div>
  );
}
export default Login;