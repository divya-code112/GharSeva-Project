import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function ViewServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    const res = await axios.get("http://127.0.0.1:5000/api/services");
    setServices(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get("http://127.0.0.1:5000/api/categories"); // your categories route
    setCategories(res.data);
  };

  const handleEditClick = (service) => {
    setEditingId(service._id);
    setEditForm({
      name: service.name,
      price: service.price,
      available: service.available,
      categoryId: service.categoryId
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://127.0.0.1:5000/api/services/${id}`, editForm);
    setEditingId(null);
    fetchServices();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`http://127.0.0.1:5000/api/services/${id}`);
    fetchServices();
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesAvailability =
      availabilityFilter === "all"
        ? true
        : availabilityFilter === "available"
        ? s.available
        : !s.available;
    const matchesCategory =
      categoryFilter === "all" ? true : s.categoryId === categoryFilter;
    return matchesSearch && matchesAvailability && matchesCategory;
  });

  return (
    <div className="ml-64 p-8 min-h-screen bg-slate-50">
      <h2 className="text-3xl font-bold mb-8">Service Management</h2>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-md mb-8 grid md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-xl"
        />

        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="border p-3 rounded-xl"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-3 rounded-xl"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((s) => (
          <motion.div
            key={s._id}
            whileHover={{ y: -5 }}
            layout
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col"
          >
            {s.image && <img src={`http://127.0.0.1:5000/uploads/${s.image}`} alt={s.name} className="w-full h-40 object-cover rounded-xl mb-4" />}

            {editingId === s._id ? (
              <>
                <input name="name" value={editForm.name} onChange={handleEditChange} className="border p-2 rounded mb-2" />
                <input type="number" name="price" value={editForm.price} onChange={handleEditChange} className="border p-2 rounded mb-2" />
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" name="available" checked={editForm.available} onChange={handleEditChange} /> Available
                </label>
                <select name="categoryId" value={editForm.categoryId} onChange={handleEditChange} className="border p-2 rounded mb-2">
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(s._id)} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{s.name}</h3>
                <p className="text-gray-600 mt-1">₹{s.price}</p>
                <span className={`text-sm font-medium ${s.available ? "text-green-600" : "text-red-600"}`}>
                  {s.available ? "Available" : "Unavailable"}
                </span>
                <p className="text-indigo-600 mt-2">{categories.find(c => c._id === s.categoryId)?.name || "No Category"}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEditClick(s)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
                  <button onClick={() => handleDelete(s._id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ViewServices;