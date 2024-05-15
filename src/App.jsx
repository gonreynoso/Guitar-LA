import "./index.css";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import { db } from "./dataBase/db";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  //aqui verifica si el carrito esta vacio y sino lo convierte en arreglo vacio
  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data, setData] = useState(db);
  const [cart, setCart] = useState([initialCart]);
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
      0,
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

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        showMaxMessage={showMaxMessage}
        decreaseQuantity={decreaseQuantity}
        emptyCart={clearCart}
      />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>
        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar key={guitar.id} guitar={guitar} addToCart={addToCart} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
