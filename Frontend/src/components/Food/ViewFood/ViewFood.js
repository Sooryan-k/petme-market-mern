import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./ViewFood.css";
import toast from "react-hot-toast";

function ViewFood() {
  const { currentUser } = useAuth();
  const { itemId } = useParams();
  const [itemDetails, setItemDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/food-items/view/${itemId}`
        );
        const data = await response.json();
        setItemDetails(data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };
    fetchItemDetails();
  }, [itemId]);

  if (!itemDetails) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  const handleBacktoHome = () => {
    navigate("/food");
  };

  //add to cart
  const handleAddToCart = async (itemId) => {

    if (!currentUser) {
      console.log("please login first to add to cart");
      toast.error("Please log in to add to cart");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: currentUser.uid,
          itemId,
        }),
      });

      if (response.status === 201) {
        console.log("Success response received");
        toast.success("Item added to cart");
      } else if (response.status === 409) {
        console.log("already in cart");
        toast.error("Already in cart");
      } else {
        console.log("failed to add");
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="foodview-view-container">
      <div className="foodview-view-content">
        <div className="foodview-image-container">
          <img
            src={itemDetails.image}
            alt={itemDetails.category}
            className="foodview-image"
          />
        </div>
        <div className="foodview-info-container">
          <div className="foodview-price-section">
            <h2 className="foodview-price">₹{itemDetails.price}</h2>
            <button
              className="view-cart-btn"
              onClick={() => handleAddToCart(itemDetails._id)}
            >
              <i class="fa-solid fa-cart-plus"></i>
            </button>
            <button className="backview-home-btn" onClick={handleBacktoHome}>
              <i className="fa-solid fa-house"></i>
            </button>
          </div>
          <h3 className="foodview-name">{itemDetails.fname}</h3>
          <span className="food-category">
            Category: {itemDetails.category}
          </span>

          <div className="foodview-description-box">
            <h4>More Info</h4>
            <p>{itemDetails.about}</p>
          </div>

          <div className="foodview-seller-details">
            <h4>Seller Details</h4>
            <p>Name: {itemDetails.sname}</p>
            <p>Phone: 1234567890</p>
          </div>

          <div className="foodview-location">
            <i className="fa-solid fa-location-dot"></i> Location : Kerala
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewFood;
