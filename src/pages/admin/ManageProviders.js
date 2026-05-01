import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Ban, Mail, Trash2 } from "lucide-react";

function ManageProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const providersPerPage = 5;

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/admin/providers");
      setProviders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
  try {
    await axios.put(
      `http://localhost:5000/api/admin/providers/${id}/status`,
      { status }
    );

    alert("Status updated successfully");
    fetchProviders();  // reload list

  } catch (error) {
    console.error(error);
  }
};

  const deleteProvider = async (id) => {
    if (!window.confirm("Delete this provider?")) return;
    await axios.delete(
      `http://127.0.0.1:5000/api/admin/providers/${id}`
    );
    fetchProviders();
  };

  const sendEmail = (provider) => {
    alert(`Approval email sent to ${provider.email}`);
  };

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [providers, search, statusFilter]);

  const indexOfLast = currentPage * providersPerPage;
  const indexOfFirst = indexOfLast - providersPerPage;
  const currentProviders = filteredProviders.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredProviders.length / providersPerPage
  );

  const total = providers.length;
  const active = providers.filter((p) => p.status === "active").length;
  const pending = providers.filter((p) => p.status === "pending").length;
  const blocked = providers.filter((p) => p.status === "blocked").length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-8">
          Manage Providers
        </h2>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total" value={total} />
          <StatCard title="Active" value={active} />
          <StatCard title="Pending" value={pending} />
          <StatCard title="Blocked" value={blocked} />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="🔎 Search provider..."
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
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 text-sm uppercase">
                <tr>
                  <th className="p-4">Name</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentProviders.map((p, i) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">{p.name}</td>

                    <td>
                      <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                        {p.status}
                      </span>
                    </td>

                    <td className="text-center space-x-2">
                      {p.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(p._id, "active")}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl shadow"
                          >
                            <CheckCircle size={16} />
                          </button>

                          <button
                            onClick={() => sendEmail(p)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-xl shadow"
                          >
                            <Mail size={16} />
                          </button>
                        </>
                      )}

                      {p.status === "active" && (
                        <button
                          onClick={() => updateStatus(p._id, "blocked")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl shadow"
                        >
                          <Ban size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => deleteProvider(p._id)}
                        className="bg-gray-800 hover:bg-black text-white px-3 py-2 rounded-xl shadow"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
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

export default ManageProviders;