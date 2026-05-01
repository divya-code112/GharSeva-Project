import React, { useEffect, useState } from "react";
import axios from "axios";

function ProviderTransactions() {

  const providerId = localStorage.getItem("userId");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/provider/transactions/${providerId}`)
      .then(res => setTransactions(res.data));
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        Transaction History
      </h2>

      {transactions.map(t => (
        <div
          key={t._id}
          className="flex justify-between border-b py-2"
        >
          <span>{t.description}</span>
          <span className={
            t.type === "credit" ? "text-green-600" : "text-red-600"
          }>
            ₹ {t.amount}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ProviderTransactions;