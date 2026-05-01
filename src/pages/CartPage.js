import React, { useState, useEffect } from "react";
import { getCart, removeFromCart } from "../utils/cart";

function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const removeItem = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Cart 🛒</h2>

      {cart.length === 0 && (
        <p>No items in cart</p>
      )}

      {cart.map((item) => (
        <div
          key={item._id}
          className="flex justify-between p-4 border mb-2 rounded"
        >
          <div>
            <h3 className="font-bold">{item.name}</h3>
            <p>₹{item.price}</p>
          </div>

          <button
            onClick={() => removeItem(item._id)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <h3 className="mt-4 font-bold text-xl">
        Total: ₹{total}
      </h3>
    </div>
  );
}

export default CartPage;