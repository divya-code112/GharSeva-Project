import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SubCategory() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [subs, setSubs] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post('http://127.0.0.1:5000/api/subcategories', {
      name,
      categoryId
    });

    setName('');
    fetchSubCategories(categoryId);
  };

  return (
    <div style={{ marginLeft: "240px", padding: "20px" }}>
      <h2>SubCategory Management</h2>

      {/* SELECT CATEGORY */}
      <select
        className="form-control mb-2"
        onChange={(e) => {
          setCategoryId(e.target.value);
          fetchSubCategories(e.target.value);
        }}
      >
        <option>Select Category</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* ADD SUBCATEGORY */}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Enter SubCategory"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary">Add</button>
      </form>

      {/* LIST */}
      <ul className="mt-3">
        {subs.map(s => (
          <li key={s._id}>{s.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default SubCategory;