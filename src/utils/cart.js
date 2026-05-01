export const addToCart = (item) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const exists = cart.find((c) => c._id === item._id);

  if (exists) {
    return;
  }

  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const removeFromCart = (id) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((c) => c._id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
};