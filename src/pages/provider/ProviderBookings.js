import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function ProviderBookings() {
const providerId =
  localStorage.getItem("userId") ||
  localStorage.getItem("providerId");
    const token = localStorage.getItem("token");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // 🔥 REAL-TIME POLLING
  useEffect(() => {
    fetchBookings();

    const interval = setInterval(() => {
      fetchBookings();
    }, 4000); // every 5 sec

    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/provider/${providerId}`,
        axiosConfig
      );
      setBookings(res.data);
    } catch (err) {
      console.log("Fetch Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
  try {
    await axios.put(
  `http://localhost:5000/api/bookings/update-status/${id}`,
  { status },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

    // instant UI update
    setBookings(prev =>
      prev.map(b =>
        b._id === id ? { ...b, status } : b
      )
    );

  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};
  if (loading) return <p className="text-center mt-10">Loading bookings...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">🔥 Live Bookings</h2>

      {bookings.length === 0 && (
        <p className="text-center text-gray-500">No bookings found</p>
      )}

      <div className="grid gap-5">
        <AnimatePresence>
          {bookings.map((b) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500"
            >
              {/* TOP INFO */}
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {b.service?.name}
                  </h3>

                  <p className="text-gray-500">
                    Client: {b.client?.name}
                  </p>

                  <p className="text-gray-500">
                    Date: {b.bookingDate} | {b.timeSlot}
                  </p>

                  <p className="font-semibold">
                    ₹{b.totalAmount}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      b.status === "pending"
                        ? "bg-yellow-500"
                        : b.status === "accepted"
                        ? "bg-green-500"
                        : b.status === "completed"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex gap-2">
                {b.status === "pending" && (
                  <button
                    onClick={() => updateStatus(b._id, "accepted")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                )}

                {b.status === "accepted" && (
                  <button
                    onClick={() => updateStatus(b._id, "completed")}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Complete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ProviderBookings;