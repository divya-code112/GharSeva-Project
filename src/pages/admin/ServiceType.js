import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ServiceType() {
  const [categories, setCategories] = useState([]);
  const [subs, setSubs] = useState([]);
  const [types, setTypes] = useState([]);

  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get('http://127.0.0.1:5000/api/categories');
    setCategories(res.data);
  };

  const fetchSubCategories = async (id) => {
    const res = await axios.get(`http://127.0.0.1:5000/api/subcategories/${id}`);
    setSubs(res.data);
  };

  const fetchTypes = async (id) => {
    const res = await axios.get(`http://127.0.0.1:5000/api/servicetypes/${id}`);
    setTypes(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post('http://127.0.0.1:5000/api/servicetypes', {
      name,
      subCategoryId
    });

    setName('');
    fetchTypes(subCategoryId);
  };

  return (
    <div style={{ marginLeft: "240px", padding: "20px" }}>
      <h2>Service Type</h2>

      {/* CATEGORY */}
      <select className="form-control mb-2"
        onChange={(e) => {
          setCategoryId(e.target.value);
          fetchSubCategories(e.target.value);
        }}>
        <option>Select Category</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      {/* SUBCATEGORY */}
      <select className="form-control mb-2"
        onChange={(e) => {
          setSubCategoryId(e.target.value);
          fetchTypes(e.target.value);
        }}>
        <option>Select SubCategory</option>
        {subs.map(s => (
          <option key={s._id} value={s._id}>{s.name}</option>
        ))}
      </select>

      {/* ADD TYPE */}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Enter Service Type"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary">Add</button>
      </form>

      {/* LIST */}
      <ul className="mt-3">
        {types.map(t => (
          <li key={t._id}>{t.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ServiceType;