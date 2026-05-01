import React, { useEffect, useState } from "react";
import { getCart } from "../utils/cart";
import { useNavigate } from "react-router-dom";

function CartIcon() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCart = () => {
      setCount(getCart().length);
    };

    updateCart();

    window.addEventListener("storage", updateCart);

    return () => window.removeEventListener("storage", updateCart);
  }, []);

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => navigate("/cart")}
    >
      🛒

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}

export default CartIcon;