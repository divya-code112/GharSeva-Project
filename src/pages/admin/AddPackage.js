import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function AddPackage() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    services: [],
    totalPrice: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(res => setCategories(res.data));
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "categoryId") {
      const res = await axios.get("http://localhost:5000/api/services");
      const filtered = res.data.filter(
        (service) => service.categoryId === value
      );
      setServices(filtered);
    }
  };

  const handleServiceSelect = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setForm({ ...form, services: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/packages", form);
    alert("Package Added Successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Create New Package
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="text"
          name="name"
          placeholder="Package Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
        />

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {services.length > 0 && (
          <select
            multiple
            onChange={handleServiceSelect}
            className="w-full border p-3 rounded-xl h-40"
          >
            {services.map(service => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          name="totalPrice"
          placeholder="Total Price"
          value={form.totalPrice}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl w-full"
        >
          Add Package
        </button>

      </form>
    </motion.div>
  );
}

export default AddPackage;