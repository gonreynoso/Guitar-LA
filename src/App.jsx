import "./index.css";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import { db } from "./dataBase/db";
import { useState } from "react";

function App() {
  const [data, setData] = useState(db);
  const [cart, setCart] = useState([]);

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
      if (item.id === id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }
  return (
    <>
      <Header cart={cart} removeFromCart={removeFromCart} />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>
        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              addToCart={addToCart}
              increaseQuantity={increaseQuantity}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
