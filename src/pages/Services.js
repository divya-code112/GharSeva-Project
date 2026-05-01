import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios";

const Services = () => {
  const { categoryId } = useParams();
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, [categoryId]);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`/services?categoryId=${categoryId}`);
      setServices(res.data);
    } catch (err) {
      console.log("Service Error:", err);
    }
  };

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
      {services.map((service) => (
        <div
          key={service._id}
          className="bg-white/40 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
        >
          <img
            src={`http://localhost:5000/uploads/${service.image}`}
            alt={service.name}
            className="rounded-xl mb-4"
          />
          <h3 className="font-bold text-lg">{service.name}</h3>
          <p className="text-gray-600">{service.description}</p>
          <p className="font-semibold mt-2">₹{service.price}</p>
        </div>
      ))}
    </div>
  );
};

export default Services;