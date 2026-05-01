import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import axios from "axios";

function ProviderLayout() {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState(null);
  const navigate = useNavigate();

  const providerId = localStorage.getItem("userId");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/providers/profile/${providerId}`
      );
      setProvider(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div
        className={`bg-white shadow-xl w-64 p-5 space-y-6 fixed md:static z-50 h-full transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="text-2xl font-bold text-blue-600">
          Provider Panel
        </h2>

        <nav className="space-y-3">

          <NavLink
            to="/provider/dashboard"
            className={({ isActive }) =>
              `block p-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/provider/bookings"
            className={({ isActive }) =>
              `block p-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200"
              }`
            }
          >
            Bookings
          </NavLink>

          <NavLink
            to="/provider/profile"
            className={({ isActive }) =>
              `block p-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200"
              }`
            }
          >
            Profile
          </NavLink>

        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 mt-10"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Main Section */}
      <div className="flex-1">

        {/* Topbar */}
        <div className="flex justify-between items-center bg-white p-4 shadow">

          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>

          <h1 className="font-semibold text-lg">
            Welcome {provider?.name} 😊✨
          </h1>

          {/* Real Profile Image */}
          <div className="flex items-center gap-3">
            {provider?.profileImage ? (
              <img
                src={`http://localhost:5000/uploads/providers/profile/${provider.profileImage}`}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300" />
            )}
          </div>

        </div>

        <div className="p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default ProviderLayout;