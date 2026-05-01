import React, { useEffect, useState } from "react";
import axios from "axios";

function AddOffer() {
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    applicableTo: "service",
    serviceId: "",
    packageId: "",
    validTill: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/services")
      .then(res => setServices(res.data));

    axios.get("http://localhost:5000/api/packages")
      .then(res => setPackages(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.applicableTo === "service" && !form.serviceId) {
    return alert("Please select service");
  }

  if (form.applicableTo === "package" && !form.packageId) {
    return alert("Please select package");
  }

  const payload = {
    ...form,
    discountValue: Number(form.discountValue),
    validTill: form.validTill ? new Date(form.validTill) : null
  };

  try {
    await axios.post("http://localhost:5000/api/offers", payload);
    alert("Offer Added Successfully");
  } catch (err) {
    console.error("Offer Error:", err.response?.data);
    alert("Something went wrong");
  }
};
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-xl">
      <h2 className="text-2xl font-bold mb-6">Add Offer</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Offer Title"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select name="discountType" onChange={handleChange} className="w-full border p-2 rounded">
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>

        <input
          type="number"
          name="discountValue"
          placeholder="Discount Value"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select name="applicableTo" onChange={handleChange} className="w-full border p-2 rounded">
          <option value="service">Service</option>
          <option value="package">Package</option>
        </select>
       
        {form.applicableTo === "service" && (
          <select name="serviceId" onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Select Service</option>
            {services.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        )}

        {form.applicableTo === "package" && (
          <select name="packageId" onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Select Package</option>
            {packages.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        )}

        <input
          type="date"
          name="validTill"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
          Add Offer
        </button>

      </form>
    </div>
  );
}

export default AddOffer;