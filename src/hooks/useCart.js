import { useEffect, useState } from "react";
import { db } from "../dataBase/db";

export const useCart = () => {
  //aqui verifica si el carrito esta vacio y sino lo convierte en arreglo vacio
  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart());
  const [showMaxMessage, setShowMaxMessage] = useState(false);

  const MAX_ITEMS = 5;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item) {
    const itemExist = cart.findIndex((guitar) => item.id === guitar.id);
    if (itemExist >= 0) {
      //existe en el carrito
      if (cart[itemExist].quantity >= MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemExist].quantity++;
      setCart(updatedCart);
    } else {
      item.quantity = 1;
      setCart([...cart, item]);
    }
  }

  function removeFromCart(id) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });

    const totalQuantity = updatedCart.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    // Verificar si se alcanza el máximo de unidades
    if (totalQuantity >= MAX_ITEMS) {
      // Aquí puedes manejar la visibilidad del mensaje
      // por ejemplo, mediante un estado
      setShowMaxMessage(true);
    } else if (totalQuantity > MAX_ITEMS && showMaxMessage) {
      setShowMaxMessage(false);
    }

    // Actualizar el estado del carrito
    setCart(updatedCart);
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    // Actualizar el estado del carrito
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  return {
    data,
    cart,
    showMaxMessage,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };
};
