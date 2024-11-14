import React, { useLayoutEffect } from "react";
import NavbarFood from "../components/Pet/NavbarPet/NavbarPet";
import ViewFood from "../components/Food/ViewFood/ViewFood";
import Footer from "../components/Food/Footer/Footer";

function ViewFoodPage() {
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
      <NavbarFood />
      <div style={contentWrapperStyle}>
        <ViewFood />
      </div>
      <Footer />
    </div>
  );
}

export default ViewFoodPage;
