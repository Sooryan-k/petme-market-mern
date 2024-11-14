import React,{useLayoutEffect} from "react";
import NavbarPet from "../components/Pet/NavbarPet/NavbarPet";
import Wishlist from "../components/Pet/Wishlist/Wishlist";
import Footer from "../components/Pet/Footer/Footer";

function WishlistPage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });
  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  const contentWrapperStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  };

  return (
    <div style={pageStyle}>
      <NavbarPet />
      <div style={contentWrapperStyle}>
        <Wishlist />
      </div>
      <Footer />
    </div>
  );
}

export default WishlistPage;
