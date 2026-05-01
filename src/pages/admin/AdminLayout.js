// AdminLayout.js
import React from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FolderKanban,
  Layers,
  PackagePlus,
  Eye,
  LogOut
} from "lucide-react";
import { Tag } from "lucide-react";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/admin/subcategories", label: "SubCategories", icon: <Layers size={18} /> },
    { path: "/admin/servicetypes", label: "Service Types", icon: <Layers size={18} /> },
    { path: "/admin/categories", label: "Categories", icon: <FolderKanban size={18} /> },
    { path: "/admin/add-service", label: "Add Service", icon: <PackagePlus size={18} /> },
    { path: "/admin/view-services", label: "View Services", icon: <Eye size={18} /> },
    { path: "/admin/add-package", label: "Add Package", icon: <PackagePlus size={18} /> },
    { path: "/admin/view-packages", label: "View Packages", icon: <Eye size={18} /> },
    { path: "/admin/add-offer", label: "Add Offer", icon: <Tag size={18} /> },
    { path: "/admin/view-offers", label: "View Offers", icon: <Eye size={18} /> },
    { path: "/admin/manage-users", label: "Users", icon: <Users size={18} /> },
    { path: "/admin/manage-providers", label: "Providers", icon: <UserCheck size={18} /> }
    
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR */}
    <motion.div
  initial={{ x: -250 }}
  animate={{ x: 0 }}
  transition={{ duration: 0.4 }}
  className="w-64 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white fixed h-screen flex flex-col shadow-2xl"
>
  {/* Header */}
  <div className="p-6">
    <h1 className="text-2xl font-bold tracking-wide">
      GharSeva Admin
    </h1>
  </div>

  {/* Scrollable Menu */}
  <div className="flex-1 overflow-y-auto px-6">
    <nav className="flex flex-col gap-2 text-sm pb-6">
      {menuItems.map((item, index) => (
        <NavItem
          key={index}
          to={item.path}
          label={item.label}
          icon={item.icon}
          active={location.pathname === item.path}
        />
      ))}
    </nav>
  </div>

  {/* Logout Button (Always Bottom) */}
  <div className="p-6 border-t border-indigo-600">
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl w-full transition-all duration-300 shadow-lg"
    >
      <LogOut size={18} />
      Logout
    </button>
  </div>
</motion.div>

      {/* MAIN CONTENT */}
      <div className="ml-64 w-full">
        <div className="bg-white shadow-sm border-b border-slate-200 px-10 py-5 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-700">Admin Panel</h2>
          <div className="text-sm text-slate-500">Welcome Back 👋</div>
        </div>

        <div className="p-10">
          <Outlet /> {/* Renders child routes */}
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, label, icon, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300
        ${active ? "bg-white text-indigo-700 shadow-md" : "hover:bg-indigo-600 hover:bg-opacity-40"}`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default AdminLayout;