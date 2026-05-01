import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Ban, CheckCircle, Trash2 } from "lucide-react";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://127.0.0.1:5000/api/admin/users");
    setUsers(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(
      `http://127.0.0.1:5000/api/admin/users/${id}`,
      { status }
    );
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(
      `http://127.0.0.1:5000/api/admin/users/${id}`
    );
    fetchUsers();
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" || u.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [users, search, statusFilter]);

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const total = users.length;
  const active = users.filter((u) => u.status === "active").length;
  const blocked = users.filter((u) => u.status === "blocked").length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-8">
          Manage Users
        </h2>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Users" value={total} />
          <StatCard title="Active" value={active} />
          <StatCard title="Blocked" value={blocked} />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="🔎 Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full md:w-1/3"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full md:w-1/4"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-600 text-sm uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th>Email</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((u, i) => (
                <motion.tr
                  key={u._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="p-4 font-medium">{u.name}</td>
                  <td>{u.email}</td>

                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        u.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="text-center space-x-2">
                    {u.status === "active" ? (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          updateStatus(u._id, "blocked")
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl shadow"
                      >
                        <Ban size={16} />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          updateStatus(u._id, "active")
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl shadow"
                      >
                        <CheckCircle size={16} />
                      </motion.button>
                    )}

                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-gray-800 hover:bg-black text-white px-3 py-2 rounded-xl shadow"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-2xl shadow-lg"
    >
      <h4 className="text-slate-500">{title}</h4>
      <h2 className="text-3xl font-bold text-indigo-700 mt-2">
        {value}
      </h2>
    </motion.div>
  );
}

export default ManageUsers;