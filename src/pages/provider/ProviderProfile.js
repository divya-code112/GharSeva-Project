import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Camera } from "lucide-react";
import { formatDate } from "../../utils/formatDate";

function ProviderProfile() {
  const providerId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({});
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [wallet, setWallet] = useState({ walletBalance: 0, rating: 0, totalReviews: 0 });
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");

  // Availability state
  const [selectedDate, setSelectedDate] = useState("");

  const [timeSlot, setTimeSlot] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [availabilitySlots, setAvailabilitySlots] = useState([]); // existing slots for selected date
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProfile();
    fetchWallet();
    fetchBookings();
    fetchNotifications();
  }, []);

  // ---------------- FETCH EXISTING AVAILABILITY ----------------
  useEffect(() => {
    if (!selectedDate) return setAvailabilitySlots([]);
    const fetchAvailability = async () => {
      try {
        const res = await axios.get(
  `http://localhost:5000/api/provider-availability/${providerId}/${selectedDate}`, axiosConfig
);
        setAvailabilitySlots(res.data.timeSlots || []);
      } catch (err) {
        console.error("Failed to fetch availability:", err);
        setAvailabilitySlots([]);
      }
    };
    fetchAvailability();
  }, [selectedDate]);

  // ---------------- FETCH DATA ----------------
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/providers/profile/${providerId}`, axiosConfig);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load profile. Please login again.");
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/providers/wallet/${providerId}`, axiosConfig);
      setWallet(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/provider/${providerId}`, axiosConfig);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/providers/notifications/${providerId}`, axiosConfig);
      setNotifications(res.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- PHOTO HANDLER ----------------
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // ---------------- SAVE PROFILE + PHOTO ----------------
  const saveAll = async () => {
    setMessage("");
    try {
      const profileRes = await axios.put(
        `http://localhost:5000/api/providers/update-profile/${providerId}`,
        profile,
        axiosConfig
      );

      let updatedProfile = profileRes.data;

      if (photo) {
        const formData = new FormData();
        formData.append("profilePhoto", photo);

        const photoRes = await axios.put(
          `http://localhost:5000/api/providers/update-photo/${providerId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
        );

        updatedProfile = photoRes.data;
        setPhoto(null);
        setPhotoPreview(null);
      }

      setProfile(updatedProfile);
      setMessage("Profile and photo updated successfully!");
    } catch (err) {
      console.error("Failed to update profile/photo:", err);
      setMessage("Failed to update profile or photo. Please try again.");
    }
  };

  // ---------------- AVAILABILITY HANDLERS ----------------
  const addSlot = () => {
    if (timeSlot && !timeSlots.includes(timeSlot)) {
      setTimeSlots([...timeSlots, timeSlot]);
      setTimeSlot("");
    }
  };

  const removeSlot = (slot) => {
    setTimeSlots(timeSlots.filter((s) => s !== slot));
    setAvailabilitySlots(availabilitySlots.filter((s) => s !== slot));
  };

  const saveAvailability = async () => {
    if (!selectedDate) return setAvailabilityMessage("Please select a date");
    if (timeSlots.length === 0) return setAvailabilityMessage("Add at least one time slot");

    try {
      await axios.post(
        `http://localhost:5000/api/provider-availability/${providerId}`,
        { date: selectedDate, timeSlots },
        axiosConfig
      );

      setAvailabilityMessage("Availability saved!");
      setAvailabilitySlots([...availabilitySlots, ...timeSlots]);
      setTimeSlots([]);
    } catch (err) {
      console.error("Failed to save availability:", err.response || err);
      if (err.response?.status === 401) setAvailabilityMessage("Unauthorized! Please login again.");
      else setAvailabilityMessage("Failed to save availability. Check server.");
    }
  };

  const completedBookings = bookings.filter((b) => b.status === "completed");
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.providerEarning || 0), 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Provider Dashboard</h1>
      {message && <p className="text-red-500">{message}</p>}

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="relative flex flex-col items-center">
          <img
            src={photoPreview || (profile.profilePhoto ? `http://localhost:5000/uploads/providers/profile/${profile.profilePhoto}` : "https://via.placeholder.com/150")}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 mb-3"
          />
          <input type="file" onChange={handlePhotoChange} className="mb-2" />
        </div>
        <div className="flex-1 space-y-4 w-full">
          <h2 className="text-2xl font-semibold text-gray-700">Profile Details</h2>
          <input type="text" value={profile.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Name" className="w-full border p-3 rounded-lg" />
          <input type="email" value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="Email" className="w-full border p-3 rounded-lg" />
          <input type="text" value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" className="w-full border p-3 rounded-lg" />
          <button onClick={saveAll} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg mt-2">
            Save All Changes
          </button>
        </div>
      </div>

      {/* ================= AVAILABILITY ================= */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Set Availability</h2>
        {availabilityMessage && <p className="text-green-500 mb-2">{availabilityMessage}</p>}

        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="border p-2 rounded mb-2 w-full" />

        <div className="flex mb-2">
          <input type="text" placeholder="10:00-12:00" value={timeSlot} onChange={e => setTimeSlot(e.target.value)} className="border p-2 rounded flex-1 mr-2" />
          <button onClick={addSlot} className="bg-blue-500 text-white px-4 rounded">Add Slot</button>
        </div>

        <div className="flex flex-wrap mb-2">
          {availabilitySlots.concat(timeSlots).map(slot => (
            <div key={slot} className="bg-gray-200 rounded-full px-3 py-1 m-1 flex items-center">
              {slot} <span onClick={() => removeSlot(slot)} className="ml-2 cursor-pointer text-red-500">x</span>
            </div>
          ))}
        </div>

        <button onClick={saveAvailability} className="bg-green-500 text-white px-6 py-2 rounded">
          Save Availability
        </button>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-gray-500 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-blue-600"><CountUp end={bookings.length} duration={1.5} /></p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-gray-500 mb-2">Completed Jobs</h3>
          <p className="text-3xl font-bold text-green-600"><CountUp end={completedBookings.length} duration={1.5} /></p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-gray-500 mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold text-purple-600">₹<CountUp end={totalEarnings} duration={1.5} /></p>
        </div>
      </div>

      {/* ================= WALLET SUMMARY ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-gray-500 mb-2">Wallet Balance</h3>
          <p className="text-3xl font-bold text-blue-600">₹<CountUp end={wallet.walletBalance} duration={1.5} /></p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-gray-500 mb-2">Rating</h3>
          <p className="text-3xl font-bold text-yellow-500"><CountUp end={wallet.rating} decimals={1} duration={1.5} /> ⭐</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-gray-500 mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold text-green-500"><CountUp end={wallet.totalReviews} duration={1.5} /></p>
        </div>
      </div>

      {/* ================= RECENT NOTIFICATIONS ================= */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Notifications</h2>
        {notifications.length === 0 ? <p className="text-gray-400">No notifications yet.</p> :
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li key={n._id} className={`p-3 rounded-lg ${n.isRead ? "bg-gray-100" : "bg-yellow-100"}`}>{n.message}</li>
            ))}
          </ul>}
      </div>

    </motion.div>
  );
}

export default ProviderProfile;