import React from "react";
import { useMediaQuery } from "@mui/material";
import "./Banner.css";

function Banner() {
  // check if the screen width is greater than or equal to 768px (medium and larger)
  const isMdOrLarger = useMediaQuery("(min-width:768px)");

  return (
    <div className="petBanner-container-fluid">
      <div className="petBanner-row">
        <div className="petBanner-col">
          <img
            className="petBanner-image"
            src={
              isMdOrLarger
                ? "/images/banner1.png"
                : "/images/banner2.png"
            }
            alt="banner"
          />
        </div>
      </div>
    </div>
  );
}

export default Banner;
