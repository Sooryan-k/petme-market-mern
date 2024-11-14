import React, { useLayoutEffect, useState, useEffect } from "react";
import NavbarPet from "../components/Pet/NavbarPet/NavbarPet";
import Home from "../components/Pet/Home/Home";
import Footer from "../components/Pet/Footer/Footer";
import Banner from "../components/Pet/BannerPet/Banner";

function HomePage() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 992);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const appStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const contentWrapperStyle = {
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: "#f8f9fa",
  };

  const bannerStyle = {
    height: isLargeScreen ? "500px" : "200px",
    overflow: "hidden",
  };

  return (
    <div style={appStyle}>
      <NavbarPet />
      <div style={bannerStyle}>
        <Banner />
      </div>
      <div style={contentWrapperStyle}>
        <Home />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
