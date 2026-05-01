import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function MyBookingHistory() {
  const token = localStorage.getItem("token");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const canCancel = (b) => {
  if (b.status !== "pending") return false;

  const createdTime = new Date(b.createdAt).getTime();
  const now = new Date().getTime();

  const diffMinutes = (now - createdTime) / (1000 * 60);

  return diffMinutes <= 30;
};

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/bookings/my-bookings",
        axiosConfig
      );

      setBookings(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ================= CANCEL ================= */
  const cancelBooking = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/cancel/${id}`,
        {},
        axiosConfig
      );

      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  /* ================= RATING ================= */
  const rateBooking = async (id, rating) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/rate/${id}`,
        { rating },
        axiosConfig
      );

      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= INVOICE ================= */
  const downloadInvoice = (b) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("INVOICE", 90, 20);

  doc.setFontSize(12);

  doc.text(`Booking ID: ${b._id}`, 20, 40);
  doc.text(`Service: ${b.service?.name}`, 20, 50);
  doc.text(`Provider: ${b.provider?.name}`, 20, 60);
  doc.text(`Date: ${b.bookingDate}`, 20, 70);
  doc.text(`Time: ${b.timeSlot}`, 20, 80);

  doc.text(`Subtotal: ₹${b.totalAmount}`, 20, 100);
  doc.text(`Final Amount: ₹${b.finalAmount}`, 20, 110);

  doc.text(`Status: ${b.status}`, 20, 130);

  doc.setFontSize(14);
  doc.text("Thank you for using our service!", 40, 150);

  doc.save(`invoice_${b._id}.pdf`);
};

  /* ================= FILTER LOGIC ================= */
  const filtered = bookings
    .filter((b) => {
      if (activeTab === "all") return true;
      if (activeTab === "completed") return b.status === "completed";
      if (activeTab === "cancelled") return b.status === "cancelled";
      if (activeTab === "upcoming")
        return b.status === "pending" || b.status === "confirmed";
      return true;
    })
    .filter((b) => {
      const q = search.toLowerCase();
      return (
        b.provider?.name?.toLowerCase().includes(q) ||
        b.service?.name?.toLowerCase().includes(q)
      );
    });

  /* ================= LOADING ================= */
  if (loading) {
    return <p className="text-center mt-10">Loading bookings...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-4">
        My Bookings
      </h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search provider or service..."
        className="border p-2 w-full mb-4 rounded"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ================= TABS ================= */}
      <div className="flex gap-3 mb-6">

        {["all", "upcoming", "completed", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded transition-all ${
              activeTab === tab
                ? "bg-black text-white"
                : "bg-white border"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}

      </div>

      {/* ================= EMPTY STATE ================= */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-500">
          No bookings found
        </p>
      )}

      {/* ================= BOOKING CARDS ================= */}
      <div className="grid gap-4">

        {filtered.map((b) => (
          <div
            key={b._id}
            className="bg-white shadow-md p-5 rounded-xl flex justify-between items-center hover:shadow-xl transition-all"
          >

            {/* LEFT */}
            <div>
              <h3 className="text-lg font-bold">
                {b.service?.name}
              </h3>

              <p className="text-gray-500">
                👤 {b.provider?.name}
              </p>

              <p>📅 {b.bookingDate}</p>
              <p>⏰ {b.timeSlot}</p>

              {/* STATUS BADGE */}
              <span
                className={`px-2 py-1 text-white rounded text-sm ${
                  b.status === "completed"
                    ? "bg-green-500"
                    : b.status === "cancelled"
                    ? "bg-red-500"
                    : "bg-orange-500"
                }`}
              >
                {b.status}
              </span>

              <p className="font-bold mt-2">
                ₹{b.finalAmount}
              </p>

              {/* RATING DISPLAY */}
              {b.rating > 0 && (
                <p className="text-yellow-500">
                  ⭐ {b.rating}/5
                </p>
              )}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex flex-col gap-2">

              {/* INVOICE */}
              <button
                onClick={() => downloadInvoice(b)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Invoice
              </button>

              {/* CANCEL */}
              {b.status === "pending" && (
  <button
    onClick={() => cancelBooking(b._id)}
    disabled={!canCancel(b)}
    className={`px-3 py-1 rounded text-white ${
      canCancel(b)
        ? "bg-red-500 hover:bg-red-600"
        : "bg-gray-400 cursor-not-allowed"
    }`}
  >
    Cancel
  </button>
)}

              {/* RATING */}
              {b.status === "completed" && (
                <select
                  className="border p-1 rounded"
                  onChange={(e) =>
                    rateBooking(b._id, e.target.value)
                  }
                >
                  <option>Rate ⭐</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="1">⭐</option>
                </select>
              )}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default MyBookingHistory;