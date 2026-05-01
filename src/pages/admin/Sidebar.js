import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#1e1e2f",
      color: "#fff",
      position: "fixed",
      padding: "20px"
    }}>
      <h3>GharSeva</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/dashboard" className="text-white">Dashboard</Link></li>
        <li>
  <Link to="/subcategories" className="text-white">
    📁 SubCategories
  </Link>
</li>
<li>
  <Link to="/servicetypes" className="text-white">
    🧩 Service Types
  </Link>
</li>
        <li><Link to="/categories" className="text-white">Categories</Link></li>
        <li><Link to="/add-service" className="text-white">Add Service</Link></li>
        <li><Link to="/view-services" className="text-white">View Services</Link></li>
        <li><Link to="/manage-users" className="text-white">View Users</Link></li>
        <li><Link to="/manage-providers" className="text-white">View Providers</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;