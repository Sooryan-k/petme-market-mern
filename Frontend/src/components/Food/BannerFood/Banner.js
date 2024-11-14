import React from "react";
import "./Banner.css";

function FoodBanner() {

  return (
    <div className="foodBanner-container-fluid" >
      <div className="foodBanner-row">
        <div className="foodBanner-col">
          <img
            className="foodBanner-image"
            src="/images/bannerfood.png"
            alt="banner"
          />
        </div>
      </div>
    </div>
  );
}

export default FoodBanner;
