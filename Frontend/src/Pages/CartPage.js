import React, { useLayoutEffect } from "react";
import NavbarPet from "../components/Pet/NavbarPet/NavbarPet";
import Cart from "../components/Food/Cart/Cart";
import Footer from "../components/Food/Footer/Footer";

function CartPage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });
  const appStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    padding: 0,
  };

  const contentWrapperStyle = {
    flex: 1,
    padding: 0,
    margin: 0,
  };
  return (
    <div style={appStyle}>
      <NavbarPet />

      <div style={contentWrapperStyle}>
        <Cart />
      </div>

      <Footer />
    </div>
  );
}

export default CartPage;
