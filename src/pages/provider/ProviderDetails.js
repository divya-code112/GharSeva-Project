import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProviderDetails = () => {
  const { providerId, serviceId } = useParams();

  const [provider, setProvider] = useState(null);
  const [service, setService] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    fetchProvider();
    fetchService();
  }, []);

  const fetchProvider = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/provider/profile/${providerId}`
    );
    setProvider(res.data);
  };

  const fetchService = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/services/${serviceId}`
    );
    setService(res.data);
  };

  const fetchAvailability = async (date) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/provider-availability/${providerId}/${date}`
      );
      setAvailability(res.data.timeSlots || []);
    } catch {
      setAvailability([]);
    }
  };

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/bookings/create",
        {
          providerId,
          serviceId,
          date: selectedDate,
          timeSlot: selectedTime,
          totalAmount: service.price,
          paymentMethod
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Booking Successful 🎉");
    } catch (err) {
      alert("Booking failed");
    }
  };

  if (!provider || !service) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-10">

      <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto">

        <div className="flex gap-6">
          <img
            src={`http://localhost:5000/uploads/providers/profile/${provider.profilePhoto}`}
            alt=""
            className="w-32 h-32 rounded-full object-cover"
          />

          <div>
            <h2 className="text-2xl font-bold">{provider.name}</h2>
            <p className="text-gray-500 mt-1">
              ⭐ {provider.rating || 0} ({provider.totalReviews || 0} reviews)
            </p>
            <p className="mt-3 text-sm">{provider.serviceType}</p>
          </div>
        </div>

        <hr className="my-6" />

        <h3 className="font-semibold text-lg">{service.name}</h3>
        <p className="text-sm text-gray-600 mt-2">{service.description}</p>

        <div className="mt-4 flex justify-between">
          <span className="font-bold text-indigo-600">
            ₹{service.price}
          </span>
          <span>{service.duration}</span>
        </div>

        <div className="mt-6">
          <input
            type="date"
            className="border p-2 rounded w-full mb-3"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              fetchAvailability(e.target.value);
            }}
          />

          <select
            className="border p-2 rounded w-full mb-3"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="">Select Time Slot</option>
            {availability.map((slot, i) => (
              <option key={i} value={slot}>
                {slot}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded w-full mb-4"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cod">Cash on Delivery</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          <button
            onClick={handleBooking}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            Book Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProviderDetails;