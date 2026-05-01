import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function ViewOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/offers");
      setOffers(res.data);
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/offers/${id}`);
      fetchOffers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl shadow-xl"
    >
      <h2 className="text-3xl font-bold mb-8 text-indigo-700">
        All Offers
      </h2>

      {offers.length === 0 ? (
        <p className="text-gray-500">No offers available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-indigo-800">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Discount</th>
                <th className="p-3 text-left">Applicable To</th>
                <th className="p-3 text-left">Valid Till</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {offers.map((offer) => (
                <tr key={offer._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{offer.title}</td>

                  <td className="p-3 capitalize">
                    {offer.discountType}
                  </td>

                  <td className="p-3">
                    {offer.discountType === "percentage"
                      ? `${offer.discountValue}%`
                      : `₹${offer.discountValue}`}
                  </td>

                  <td className="p-3">
                    {offer.applicableTo === "service"
                      ? offer.serviceId?.name
                      : offer.packageId?.name}
                  </td>

                  <td className="p-3">
                    {new Date(offer.validTill).toLocaleDateString()}
                  </td>

                  <td className="p-3">
  {offer.isActive ? (
    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
      Active
    </span>
  ) : (
    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
      Expired
    </span>
  )}
</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(offer._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

export default ViewOffers;