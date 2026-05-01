import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useState } from "react";

const Navbar = ({ user, city, setCity }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/40 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-700">
          GHARSEVA
        </Link>

        {/* City + Search */}
        <div className="hidden md:flex items-center gap-4 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-md">
          <button 
            onClick={() => setOpen(true)}
            className="font-medium text-gray-700"
          >
            📍 {city}
          </button>

          <input
            type="text"
            placeholder="Search services..."
            className="bg-transparent outline-none"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-indigo-600 hover:scale-110 transition" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              2
            </span>
          </Link>

          {/* Profile */}
          <div className="relative">
            <User 
              className="w-6 h-6 text-indigo-600 cursor-pointer hover:scale-110 transition"
              onClick={() => setOpen(!open)}
            />

            {open && (
              <div className="absolute right-0 mt-2 bg-white/70 backdrop-blur-xl rounded-xl shadow-lg p-3 w-40">
                <Link to="/bookings" className="block py-1">My Bookings</Link>
                <Link to="/profile" className="block py-1">Profile</Link>
                <button className="block py-1 text-red-500">Logout</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;