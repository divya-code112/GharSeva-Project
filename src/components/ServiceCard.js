import React from 'react';

function ServiceCard({ service, onDelete, onEdit }) {
  return (
    <div style={{
      width: "250px",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }}>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <p><b>₹{service.price}</b></p>

      {service.image && (
        <img
          src={`http://127.0.0.1:5000/uploads/${service.image}`}
          width="100%"
        />
      )}

      <button onClick={() => onEdit(service._id)}>✏️</button>
      <button onClick={() => onDelete(service._id)}>🗑</button>
    </div>
  );
}

export default ServiceCard;