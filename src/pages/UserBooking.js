import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UserBooking() {
  const { providerId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  /* ================= DATA ================= */
  const [provider, setProvider] = useState({});
  const [services, setServices] = useState([]);

  const [availability, setAvailability] = useState({ timeSlots: [] });

  /* ================= STEP CONTROL ================= */
  const [step, setStep] = useState(1);

  /* ================= FORM DATA ================= */
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= FETCH PROVIDER ================= */
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/providers/profile/${providerId}`,
          axiosConfig
        );

        setProvider(res.data);
        setServices(res.data.services || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProvider();
  }, [providerId]);

  /* ================= AVAILABILITY ================= */
  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailability = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/provider-availability/${providerId}/${selectedDate}`,
          axiosConfig
        );

        setAvailability(res.data);
      } catch (err) {
        setAvailability({ timeSlots: [] });
      }
    };

    fetchAvailability();
  }, [selectedDate]);

  /* ================= BOOKING ================= */
  const handleBooking = async () => {
    if (!customerName || !customerAddress) {
      return alert("Enter name and address");
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardCvv) {
        return alert("Fill card details");
      }
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/bookings/create",
        {
          providerId,
          serviceId: selectedServiceId,
          date: selectedDate,
          timeSlot: selectedSlot,
          paymentMethod
        },
        axiosConfig
      );

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate("/my-booking-history");
      }, 2000);

    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 max-w-xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">
        Book {provider.name}
      </h2>

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <div>
          <h3>Select Service</h3>

          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
          >
            <option value="">Select Service</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (!selectedServiceId) return alert("Select service");
              setStep(2);
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <div>
          <h3>Select Date & Slot</h3>

          <input
            type="date"
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <div>
            {availability.timeSlots?.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                style={{
                  margin: "5px",
                  background: selectedSlot === slot ? "green" : "gray",
                  color: "white"
                }}
              >
                {slot}
              </button>
            ))}
          </div>

          <button onClick={() => setStep(1)}>Back</button>

          <button
            onClick={() => {
              if (!selectedDate || !selectedSlot)
                return alert("Select date & slot");
              setStep(3);
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 3 && (
        <div>
          <h3>Address Details</h3>

          <input
            placeholder="Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <textarea
            placeholder="Address"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
          />

          <button onClick={() => setStep(2)}>Back</button>

          <button
            onClick={() => {
              if (!customerName || !customerAddress)
                return alert("Fill details");
              setStep(4);
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* ================= STEP 4 ================= */}
      {step === 4 && (
        <div>
          <h3>Payment</h3>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select Payment</option>
            <option value="cash">Cash on Delivery</option>
            <option value="card">Card</option>
          </select>

          {paymentMethod === "card" && (
            <div>
              <input
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <input
                placeholder="Card Holder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
              <input
                placeholder="CVV"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
              />
            </div>
          )}

          <button onClick={() => setStep(3)}>Back</button>

          <button
            onClick={() => {
              if (!paymentMethod) return alert("Select payment");
              setStep(5);
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* ================= STEP 5 ================= */}
      {step === 5 && (
        <div>
          <h3>Confirm Booking</h3>

          <p>Service: {selectedServiceId}</p>
          <p>Date: {selectedDate}</p>
          <p>Slot: {selectedSlot}</p>

          <button onClick={() => setStep(4)}>Back</button>

          <button onClick={handleBooking}>
            Confirm Booking
          </button>
        </div>
      )}

      {/* ================= LOADING ================= */}
      {loading && <h3>Processing...</h3>}

      {/* ================= SUCCESS ================= */}
      {success && (
        <div>
          <h2>🎉 Booking Successful</h2>
        </div>
      )}
    </div>
  );
}

export default UserBooking;