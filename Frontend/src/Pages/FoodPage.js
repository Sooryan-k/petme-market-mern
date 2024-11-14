import React, { useLayoutEffect, useState, useEffect } from "react";
import NavbarFood from "../components/Pet/NavbarPet/NavbarPet";
import Banner from "../components/Food/BannerFood/Banner";
import Food from "../components/Food/Food/Food";
import Footer from "../components/Food/Footer/Footer";
import "./FoodPage.css";

function FoodPage() {
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

  const bannerStyle = {
    height: isLargeScreen ? "500px" : "200px",
    overflow: "hidden",
  };

  return (
    <div className="food-page-layout">
      <header className="navbar-container">
        <NavbarFood />
      </header>
      <section className="banner-container" style={bannerStyle}>
        <Banner />
      </section>
      <main className="content-wrapper">
        <Food />
      </main>
      <footer className="footer-container">
        <Footer />
      </footer>
    </div>
  );
}

export default FoodPage;
