import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function ProviderDashboard() {
  const providerId =
    localStorage.getItem("providerId") ||
    localStorage.getItem("userId");

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };

  /* ================= REAL-TIME AUTO REFRESH ================= */
  useEffect(() => {
    fetchAll();

    const interval = setInterval(() => {
      fetchAll();
    }, 5000); // 🔥 every 5 sec

    return () => clearInterval(interval);
  }, []);

  const fetchAll = () => {
    fetchBookings();
    fetchNotifications();
    fetchWallet();
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/provider/${providerId}`,
        axiosConfig
      );
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/providers/notifications/${providerId}`,
        axiosConfig
      );
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/providers/wallet/${providerId}`,
        axiosConfig
      );
      setWalletBalance(res.data.walletBalance || 0);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= STATUS UPDATE ================= */
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/update-status/${id}`,
        { status },
        axiosConfig
      );

      fetchAll(); // 🔥 instant refresh
    } catch (err) {
      console.log(err);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/providers/mark-read/${id}`,
        {},
        axiosConfig
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FILTER ================= */
  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const completedBookings = bookings.filter(
    (b) => b.status === "completed"
  );

  const totalEarnings = completedBookings.reduce(
    (sum, b) => sum + (b.providerEarning || 0),
    0
  );

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  /* ================= UI ================= */
  return (
    <motion.div className="p-6 space-y-6">
      {/* STATS */}
      <div className="grid md:grid-cols-5 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          Total: <CountUp end={bookings.length} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          Completed: <CountUp end={completedBookings.length} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          Earnings: ₹<CountUp end={totalEarnings} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          Wallet: ₹<CountUp end={walletBalance} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          Notifications: {unreadCount}
        </div>
      </div>

      {/* BOOKINGS */}
      <div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="completed">Completed</option>
        </select>

        <div className="space-y-3 mt-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white p-4 rounded shadow flex justify-between"
            >
              <div>
                <p>{b.client?.name}</p>
                <p>{b.service?.name}</p>
                <p>₹{b.totalAmount}</p>
              </div>

              <div>
                {b.status === "pending" && (
                  <button
                    onClick={() =>
                      updateStatus(b._id, "accepted")
                    }
                  >
                    Accept
                  </button>
                )}

                {b.status === "accepted" && (
                  <button
                    onClick={() =>
                      updateStatus(b._id, "completed")
                    }
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div>
        {notifications.map((n) => (
          <p
            key={n._id}
            onClick={() => markNotificationRead(n._id)}
            className={
              n.isRead
                ? "text-gray-400"
                : "font-bold cursor-pointer"
            }
          >
            {n.message}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

export default ProviderDashboard;