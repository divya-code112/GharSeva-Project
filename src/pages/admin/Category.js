import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Category() {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await axios.get('http://127.0.0.1:5000/api/categories');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      'http://127.0.0.1:5000/api/categories',
      { name },
      {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    );

    setName('');
    fetchCategories();
  };

  return (
    <div style={{ marginLeft: "240px", padding: "20px" }}>
      <h2>Categories</h2>

      <form onSubmit={handleSubmit} className="mb-3">
        <input
          className="form-control mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category"
        />
        <button className="btn btn-primary">Add</button>
      </form>

      <ul>
        {categories.map(c => (
          <li key={c._id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Category;