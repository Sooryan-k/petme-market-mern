import React,{useLayoutEffect} from "react";
import NavbarPet from "../components/Pet/NavbarPet/NavbarPet";
import ViewPet from "../components/Pet/ViewPet/ViewPet";
import Footer from "../components/Pet/Footer/Footer";

function ViewPetPage() {
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
        <ViewPet />
      </div>
      <Footer />
    </div>
  );
}

export default ViewPetPage;
