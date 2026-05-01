import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";

function ViewPackages() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/packages");
      setPackages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      await axios.delete(`http://localhost:5000/api/packages/${id}`);
      fetchPackages();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 p-8">

      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-slate-800 mb-8"
      >
        📦 Manage Packages
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {packages.map((pkg, index) => (
          <motion.div
            key={pkg._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200"
          >

            <h3 className="text-xl font-semibold text-indigo-700">
              {pkg.name}
            </h3>

            <p className="text-slate-600 mt-2 text-sm">
              {pkg.description}
            </p>

            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">
                Services Included:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 mt-1">
                {pkg.services?.map((service, i) => (
                  <li key={i}>{service.name || service}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-lg font-bold text-green-600">
              ₹ {pkg.totalPrice}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="text-indigo-600 hover:text-indigo-800"
              >
                <Eye size={20} />
              </button>

              <button
                onClick={() => handleDelete(pkg._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>

          </motion.div>
        ))}

      </div>
    </div>
  );
}

export default ViewPackages;