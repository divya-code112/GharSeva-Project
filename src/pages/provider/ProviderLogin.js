import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProviderLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/provider-auth/login",
        { email, password }
      );

      localStorage.setItem("providerToken", res.data.token);
      localStorage.setItem("providerId", res.data.provider.id);

      alert("Login Successful");
      navigate("/provider/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div>
      <h2>Provider Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default ProviderLogin;