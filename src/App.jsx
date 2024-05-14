import "./index.css";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import { db } from "./dataBase/db";
import { useState } from "react";

function App() {
  const [data, setData] = useState(db);
  const [cart, setCart] = useState([]);
  const [showMaxMessage, setShowMaxMessage] = useState(false);

  const MAX_ITEMS = 5;

  function addToCart(item) {
    const itemExist = cart.findIndex((guitar) => item.id === guitar.id);
    if (itemExist >= 0) {
      //existe en el carrito
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
    }

    // Actualizar el estado del carrito
    setCart(updatedCart);
  }


  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        showMaxMessage={showMaxMessage}
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
