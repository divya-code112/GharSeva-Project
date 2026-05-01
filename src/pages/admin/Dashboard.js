import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  CalendarCheck,
  Clock,
  CheckCircle,
  IndianRupee
} from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users size={28} />,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Providers",
      value: stats.totalProviders,
      icon: <UserCheck size={28} />,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <CalendarCheck size={28} />,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Completed",
      value: stats.completedBookings,
      icon: <CheckCircle size={28} />,
      color: "from-green-500 to-lime-600"
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: <Clock size={28} />,
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Revenue",
      value: stats.totalRevenue,
      icon: <IndianRupee size={28} />,
      color: "from-rose-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 p-8">
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-slate-800 mb-10"
      >
        📊 Dashboard Overview
      </motion.h2>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <StatCard key={index} card={card} index={index} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ card, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="relative p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Gradient Circle */}
      <div
        className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-20 blur-2xl`}
      ></div>

      <div className="flex items-center justify-between">
        <div className="text-slate-500 text-sm font-medium">
          {card.title}
        </div>
        <div className="text-indigo-600">{card.icon}</div>
      </div>

      <h2 className="text-4xl font-bold text-slate-800 mt-4">
        {card.value || 0}
      </h2>
    </motion.div>
  );
}

export default Dashboard;