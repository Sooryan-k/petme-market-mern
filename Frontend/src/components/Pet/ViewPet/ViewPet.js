import React from "react";
import "./ViewPet.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

function ViewPet() {
  const { currentUser } = useAuth();
  const { petId } = useParams();
  const [petDetails, setPetDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/pet-listing/view/${petId}`
        );
        const data = await response.json();
        setPetDetails(data);
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };
    fetchPetDetails();
  }, [petId]);

  if (!petDetails) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  const handleBacktoHome = () => {
    navigate("/");
  };

  const handleAddToWishlist = async (petId) => {
    if (!currentUser) {
      toast.error("Please log in to add to wishlist");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: currentUser.uid,
          petId,
        }),
      });

      if (response.status === 201) {
        toast.success("Pet added to wishlist");
      } else if (response.status === 409) {
        toast.error("Already in wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  return (
    <div className="petView-container">
      <div className="petView-row">
        {/* image Section */}
        <div className="petView-image-div col-md-6">
          <img src={petDetails.image} alt={petDetails.category} />
        </div>

        {/* details section */}
        <div className="col-md-6 petView-details-container">
          <div className="petView-price-and-buttons">
            <h3 className="petView-price">₹{petDetails.price}</h3>
            <div className="petView-buttons-row">
              <button
                className="petView-fav-btn"
                onClick={() => handleAddToWishlist(petDetails._id)}
              >
                <i style={{ color: "#f4cc2d" }} class="fa-solid fa-star"></i>
              </button>
              <button className="petView-back-btn" onClick={handleBacktoHome}>
                <i className="fa-solid fa-house"></i>
              </button>
            </div>
          </div>

          <span className="petView-breed-name">
            Breed name : {petDetails.bname}
          </span>
          <span className="petView-category">
            Category: {petDetails.category}
          </span>

          <div className="petView-description-box">
            More info: {petDetails.about}
          </div>

          <div className="petView-seller-details">
            <h5>Seller Details</h5>
            <span>Name: {petDetails.name}</span>
            <span>Phone: {petDetails.phone}</span>
          </div>

          <div
            className="petView-location"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <span>
              <i className="fa-solid fa-location-dot"></i> {petDetails.location}
            </span>
            <span>
              Ad posted on:{" "}
              {new Date(petDetails.createdDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPet;
