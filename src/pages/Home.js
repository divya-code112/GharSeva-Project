import React, { useEffect, useState } from "react";
import { MapPin, Search, ShoppingCart, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";


const Home = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);

  const [city, setCity] = useState("Pune");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const isBestSeller = (index) => index === 0;

  useEffect(() => {
    fetchCategories();
    fetchPackages();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data);
  };

  const fetchPackages = async () => {
    const res = await axios.get("http://localhost:5000/api/packages");
    setPackages(res.data);
  };
const getEmoji = (name) => {
  switch (name) {
    case "Salon":
      return "💇‍♀️";
    case "Kitchen Appliances":
      return "🍳";
    case "Cleaning":
      return "🧹";
    case "Home Repair":
      return "🔧";
    case "Pest Control":
      return "🐜";
    case "Renovation":
      return "🏠";
    case "Moving and Storage":
      return "🚚";
    default:
      return "✨";
  }
};

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-4 bg-white shadow-sm">

        <div className="flex items-center gap-3">
          <img src={logo} className="h-10" />
          <h1 className="text-xl font-bold text-indigo-600">
          
          </h1>
        </div>

        <div className="flex items-center gap-4">

          {user ? (
            <div className="relative">
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <User size={18} />
                <span>Welcome, {user.name}</span>
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white shadow rounded-lg p-2 w-40">
                  <button
                    onClick={() => navigate("/my-booking-history")}
                    className="block w-full text-left p-2 hover:bg-gray-100"
                  >
                    My Bookings
                  </button>

                  <button
                    onClick={() => {
                      localStorage.clear();
                      navigate("/login");
                    }}
                    className="block w-full text-left p-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full"
            >
              Login
            </button>
          )}

        </div>
      </div>

      {/* HERO (IMPROVED) */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-20 px-6">

        <h2 className="text-4xl font-bold">
          Premium Home Services at Your Doorstep
        </h2>

        <p className="mt-3 text-white/80">
          Book trusted professionals in seconds
        </p>

        <div className="mt-6 flex justify-center">

          <div className="bg-white text-black flex items-center gap-2 px-4 py-2 rounded-full w-[500px]">

            <MapPin size={18} />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="outline-none"
            >
              <option>Pune</option>
              <option>Mumbai</option>
            </select>

            <input
              placeholder="Search services..."
              className="flex-1 outline-none px-2"
            />

            <Search size={18} />
          </div>

        </div>
      </div>

      {/* CATEGORIES (IMPROVED) */}
    <div className="px-10 py-14">

  <h3 className="text-2xl font-bold mb-6">
    Explore Categories
  </h3>

  <div className="grid grid-cols-6 gap-6">

    {categories.map((cat, i) => (
      <div
        key={cat._id}
        onClick={() => navigate(`/category/${cat._id}`)}
        className={`relative group float-card bg-white/30 backdrop-blur-xl border border-white/40 p-5 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer text-center overflow-hidden`}
        style={{ animationDelay: `${i * 0.2}s` }}
      >

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-pink-200/40 opacity-0 group-hover:opacity-100 transition duration-500"></div>

        {/* Emoji */}
        <div className="relative text-5xl transition-transform duration-500 group-hover:scale-125 group-hover:-translate-y-2 group-hover:rotate-6">
          {getEmoji(cat.name)}
        </div>

        {/* Name */}
        <p className="relative mt-3 font-semibold text-gray-800">
          {cat.name}
        </p>

      </div>
    ))}

  </div>
</div>

      {/* PACKAGES (IMPROVED PREMIUM UI) */}
  <div className="px-10 py-14 bg-gradient-to-b from-gray-50 to-white">

  <h3 className="text-2xl font-bold mb-6">
    Trending Packages
  </h3>

  <div className="grid grid-cols-4 gap-6">

    {packages.map((pkg, i) => (
      <div
        key={pkg._id}
        className="relative float-card bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden"
        style={{ animationDelay: `${i * 0.2}s` }}
      >

        {/* Badge */}
        {i === 0 && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-xs px-2 py-1 rounded-full font-bold">
            🔥 Best
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
          <h4 className="font-bold">{pkg.name}</h4>
        </div>

        {/* Body */}
        <div className="p-4">

          <p className="text-sm text-gray-600">
            {pkg.description}
          </p>

          <div className="mt-4 flex justify-between">
            <span className="text-indigo-600 font-bold">
              ₹{pkg.totalPrice}
            </span>

            <span className="text-xs text-gray-400">
              {pkg.services?.length || 0} services
            </span>
          </div>

          <button
            onClick={() => navigate(`/package/${pkg._id}`)}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            View Package
          </button>

        </div>

      </div>
    ))}

  </div>
</div>

    </div>
  );
};

export default Home;