import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";

const ProviderBookingPage = () => {
  const { providerId, serviceId } = useParams();

  const [provider, setProvider] = useState(null);
  const [service, setService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showModal, setShowModal] = useState(false);
const navigate = useNavigate();

const handleClose = () => {
  setShowModal(false);
  navigate("/my-booking-history");
};


  useEffect(() => {
    fetchProvider();
    fetchService();
  }, []);

  const token = localStorage.getItem("token");

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

  const fetchProvider = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/providers/${providerId}`
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
      `http://localhost:5000/api/provider-availability/${providerId}/${date}`,
      axiosConfig
    );

    setAvailableSlots(res.data.timeSlots || []);
  } catch (err) {
    setAvailableSlots([]);
  }
};
  
const handleBooking = async () => {
  try {
    if (!selectedDate || !selectedTime) {
      alert("Select date and time");
      return;
    }

    if (service.price > 1000 && paymentMethod === "cod") {
      alert("COD not allowed above ₹1000");
      return;
    }

    await axios.post("/api/bookings/create", {
      providerId,
      serviceId,
      date: selectedDate,
      timeSlot: selectedTime,
      paymentMethod
    });

    setShowModal(true); // ✅ IMPORTANT FIX

  } catch (err) {
    alert(err.response?.data?.message);
  }
};

  if (!provider || !service) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  const advanceAmount =
    service.price > 1000 ? Math.round(service.price * 0.3) : 0;

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Provider Image */}
        <img
          src={
            provider.profilePhoto
              ? `http://localhost:5000/uploads/providers/profile/${provider.profilePhoto}`
              : "https://via.placeholder.com/100"
          }
          alt="provider"
          style={styles.image}
        />

        <h2>{provider.name}</h2>

        {/* Rating Stars */}
        <div style={styles.stars}>
          {"★".repeat(Math.round(provider.rating || 0))}
          {"☆".repeat(5 - Math.round(provider.rating || 0))}
        </div>

        <p style={styles.service}>{service.name}</p>
        <p style={styles.price}>₹{service.price}</p>

        {/* Advance Info */}
        {advanceAmount > 0 && (
          <p style={styles.advance}>
            Advance to Pay: ₹{advanceAmount} (30%)
          </p>
        )}

        {/* Date */}
        <div style={styles.section}>
          <label>Select Date</label>
          <input
  type="date"
  style={styles.input}
  onChange={(e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchAvailability(date);
  }}
/>
        </div>

        {/* Slots */}
        <div style={styles.section}>
          <label>Select Time Slot</label>
          <div style={styles.slots}>
            {availableSlots.length === 0 && (
              <p style={{ color: "red" }}>No slots available</p>
            )}
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                style={
                  selectedTime === slot
                    ? { ...styles.slot, ...styles.selected }
                    : styles.slot
                }
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div style={styles.section}>
          <label>Payment Method</label>
          <select
            style={styles.input}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cod">Cash on Delivery</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>
        </div>

        <button
          style={styles.bookBtn}
          disabled={!selectedDate || !selectedTime}
          onClick={handleBooking}
        >
          Confirm Booking
        </button>
      </div>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>🎉 Booking Successful!</h2>
            <p>Your service has been booked successfully. Wait For Provider to accept your Booking</p>
            <button
              style={styles.closeBtn}
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* =================== STYLES =================== */

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    padding: "20px",
  },

  card: {
    background: "white",
    padding: "30px",
    width: "420px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
    animation: "fadeIn 0.6s ease-in-out",
  },

  image: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
    border: "3px solid #667eea",
  },

  stars: {
    color: "#f1c40f",
    fontSize: "20px",
    marginBottom: "10px",
  },

  service: {
    color: "#555",
  },

  price: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#27ae60",
  },

  advance: {
    color: "#e67e22",
    fontWeight: "600",
  },

  section: {
    marginTop: "15px",
    textAlign: "left",
  },

  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },

  slots: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "8px",
  },

  slot: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #667eea",
    cursor: "pointer",
    background: "white",
  },

  selected: {
    background: "#667eea",
    color: "white",
  },

  bookBtn: {
    width: "100%",
    marginTop: "20px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#28a745",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    animation: "fadeIn 0.4s ease-in-out",
  },

  closeBtn: {
    marginTop: "15px",
    padding: "8px 15px",
    borderRadius: "6px",
    border: "none",
    background: "#667eea",
    color: "white",
    cursor: "pointer",
  },
};

export default ProviderBookingPage;