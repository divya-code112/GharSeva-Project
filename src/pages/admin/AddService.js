import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddService() {
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    subCategoryId: '',
    serviceTypeId: '',
    description: '',
    price: '',
    duration: '',
    available: true
  });

  const [categories, setCategories] = useState([]);
  const [subs, setSubs] = useState([]);
  const [types, setTypes] = useState([]);
  const [image, setImage] = useState(null);

  // Load categories
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  // Load subcategories based on selected category
  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return setSubs([]);
    const res = await axios.get(`http://127.0.0.1:5000/api/subcategories/${categoryId}`);
    setSubs(res.data);
  };

  // Load service types based on selected subcategory
  const fetchTypes = async (subId) => {
    if (!subId) return setTypes([]);
    const res = await axios.get(`http://127.0.0.1:5000/api/servicetypes/${subId}`);
    setTypes(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });

    // Fetch next dropdowns dynamically
    if (name === 'categoryId') {
      fetchSubCategories(value);
      setForm(prev => ({ ...prev, subCategoryId: '', serviceTypeId: '' }));
      setTypes([]);
    }
    if (name === 'subCategoryId') {
      fetchTypes(value);
      setForm(prev => ({ ...prev, serviceTypeId: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    if (image) data.append('image', image);

    try {
      await axios.post('http://127.0.0.1:5000/api/services/add', data);
      alert("✅ Service Added Successfully!");
      setForm({
        name: '',
        categoryId: '',
        subCategoryId: '',
        serviceTypeId: '',
        description: '',
        price: '',
        duration: '',
        available: true
      });
      setImage(null);
      setSubs([]);
      setTypes([]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add service.");
    }
  };

  return (
    <div className="ml-64 p-8 min-h-screen bg-slate-50">
      <h2 className="text-3xl font-bold mb-6">Add Service</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md grid gap-4">

        {/* Category */}
        <select name="categoryId" value={form.categoryId} onChange={handleChange} className="border p-3 rounded">
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        {/* SubCategory */}
        <select name="subCategoryId" value={form.subCategoryId} onChange={handleChange} className="border p-3 rounded">
          <option value="">Select SubCategory</option>
          {subs.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        {/* Service Type */}
        <select name="serviceTypeId" value={form.serviceTypeId} onChange={handleChange} className="border p-3 rounded">
          <option value="">Select Service Type</option>
          {types.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>

        {/* Name */}
        <input type="text" name="name" value={form.name} placeholder="Service Name" onChange={handleChange} className="border p-3 rounded" required />

        {/* Description */}
        <textarea name="description" value={form.description} placeholder="Description" onChange={handleChange} className="border p-3 rounded" required />

        {/* Price */}
        <input type="number" name="price" value={form.price} placeholder="Price" onChange={handleChange} className="border p-3 rounded" required />

        {/* Duration */}
        <input type="text" name="duration" value={form.duration} placeholder="Duration" onChange={handleChange} className="border p-3 rounded" required />

        {/* Availability */}
        <label className="flex items-center gap-2">
          <input type="checkbox" name="available" checked={form.available} onChange={handleChange} /> Available
        </label>

        {/* Image */}
        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="border p-2 rounded" />

        <button type="submit" className="bg-green-500 text-white p-3 rounded font-bold hover:bg-green-600">Add Service</button>
      </form>
    </div>
  );
}

export default AddService;