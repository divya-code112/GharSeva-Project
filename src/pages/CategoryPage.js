// src/pages/CategoryPage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CategoryPage = () => {
  const { categoryId } = useParams();
const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showPopup, setShowPopup] = useState(true);

  const [selectedService, setSelectedService] = useState(null);
  const [providers, setProviders] = useState([]);
  const handleSelect = (providerId, serviceId) => {
  navigate(`/provider/${providerId}/${serviceId}`);
};

  // ================= FETCH =================

  useEffect(() => {
    getCategory();
    getSubcategories();
  }, [categoryId]);

  useEffect(() => {
    if (selectedSub) getServiceTypes(selectedSub);
  }, [selectedSub]);

  useEffect(() => {
    if (selectedSub) getServices();
  }, [selectedSub, selectedType]);

  useEffect(() => {
  console.log("ALL SERVICES:", services);
}, [services]);

useEffect(() => {
  console.log("CATEGORY ID:", categoryId);
}, [categoryId]);

  const getCategory = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    const found = res.data.find((c) => c._id === categoryId);
    setCategory(found);
  };

  const getSubcategories = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/subcategories/${categoryId}`
    );
    setSubcategories(res.data);
  };

  const getServiceTypes = async (subId) => {
    const res = await axios.get(
      `http://localhost:5000/api/servicetypes/${subId}`
    );
    setServiceTypes(res.data);
  };

  const getServices = async () => {
  const res = await axios.get("http://localhost:5000/api/services");

  const filtered = res.data.filter((s) => {
    return (
      String(s.categoryId?._id || s.categoryId) === String(categoryId)
    );
  });

  setServices(filtered);
};
  // ================= FETCH PROVIDERS =================

  const fetchProviders = async (serviceName) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/providers/by-service-type/${serviceName}`
      );
      setProviders(res.data);
    } catch (err) {
      console.log(err);
      setProviders([]);
    }
  };

  // ================= CREATE BOOKING =================

  const handleCreateBooking = async (providerId) => {
    try {
      const userId = localStorage.getItem("userId");

      await axios.post("http://localhost:5000/api/bookings/create", {
        client: userId,
        provider: providerId,
        service: selectedService._id,
        totalAmount: selectedService.price,
        status: "pending"
      });

      alert("Booking Created Successfully 🎉");

      setSelectedService(null);
      setProviders([]);
    } catch (err) {
      console.log(err);
      alert("Booking failed");
    }
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-10">
        <h1 className="text-5xl font-bold">{category?.name}</h1>
        <p className="mt-4 text-lg opacity-90">
          Book professional {category?.name} services instantly
        </p>
      </div>

      {/* SUBCATEGORY MODAL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-40">
          <div className="bg-white rounded-3xl w-[700px] p-10 shadow-2xl">
            <h2 className="text-3xl font-bold mb-8">
              Choose a Subcategory
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {subcategories.map((sub) => (
                <div
                  key={sub._id}
                  onClick={() => {
                    setSelectedSub(sub._id);
                    setShowPopup(false);
                  }}
                  className="p-6 bg-gray-100 rounded-2xl cursor-pointer hover:scale-105 transition"
                >
                  {sub.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SERVICES */}
      <div className="px-12 py-14">
        <h2 className="text-2xl font-semibold mb-10">
          Available Services
        </h2>

        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl border hover:shadow-md transition cursor-pointer"
              onClick={() => {
                setSelectedService(service);
                fetchProviders(service.categoryId?.name || category?.name); // 👈 important
              }}
            >
              <img
                src={`http://localhost:5000/uploads/${service.image}`}
                alt={service.name}
                className="h-32 w-full object-cover rounded-t-xl"
              />

              <div className="p-3">
                <h3 className="text-sm font-semibold truncate">
                  {service.name}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {service.description}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-bold text-indigo-600">
                    ₹{service.price}
                  </span>

                  <button className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DRAWER */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => {
              setSelectedService(null);
              setProviders([]);
            }}
          />

          <div className="w-[420px] bg-white shadow-2xl h-full overflow-y-auto">
            <img
              src={`http://localhost:5000/uploads/${selectedService.image}`}
              alt={selectedService.name}
              className="h-48 w-full object-cover"
            />

            <div className="p-5">
              <h2 className="text-lg font-bold">
                {selectedService.name}
              </h2>

              <p className="text-sm text-gray-600 mt-3">
                {selectedService.description}
              </p>

              <div className="flex justify-between mt-4">
                <span className="text-lg font-bold text-indigo-600">
                  ₹{selectedService.price}
                </span>
                <span className="text-sm text-gray-500">
                  {selectedService.duration}
                </span>
              </div>

              <div className="mt-6">
  <h3 className="font-semibold mb-3">
    Available Providers
  </h3>

  {providers.length === 0 ? (
    <p className="text-sm text-gray-500">
      No providers available
    </p>
  ) : (
    <div className="space-y-3">

      {providers.map((provider) => (
        <div
          key={provider._id}
          className="flex items-center justify-between p-3 border rounded-xl hover:shadow-md transition bg-white"
        >

          {/* LEFT INFO */}
          <div>
            <p className="font-semibold">
              {provider.name}
            </p>

            <p className="text-xs text-gray-500">
              {provider.serviceType || "Professional Service"}
            </p>

            <p className="text-xs text-yellow-500">
              ⭐ {provider.rating || 4.2} Rating
            </p>
          </div>

          {/* RIGHT ACTION */}
          <button
            onClick={() =>
              handleSelect(provider._id, selectedService._id)
            }
            className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Select
          </button>

        </div>
      ))}

    </div>
  )}
</div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 