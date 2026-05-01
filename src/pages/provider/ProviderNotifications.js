import React, { useEffect, useState } from "react";
import axios from "axios";

function ProviderNotifications() {

  const providerId = localStorage.getItem("userId");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/provider/notifications/${providerId}`)
      .then(res => setNotifications(res.data));
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        Notifications
      </h2>

      {notifications.map(n => (
        <div
          key={n._id}
          className={`border p-3 mb-2 rounded ${
            n.isRead ? "bg-gray-100" : "bg-yellow-100"
          }`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}

export default ProviderNotifications;