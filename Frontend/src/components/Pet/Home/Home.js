import React, { useState, useEffect, useContext } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./Home.css";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../../context/SeachContext";

function Home() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [petListings, setPetListings] = useState([]);
  const { searchTerm } = useContext(SearchContext);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/pet-listing/listed-pets"
        );
        const data = await response.json();
        setPetListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching pet lists:", error);
      }
    };
    fetchPets();
  }, [selectedFilter]);

  const filters = ["All", "cat", "dog", "fish", "birds", "rabbit"];
  const handleFilterChange = (filter) => setSelectedFilter(filter);

  const applyMainFilters = () => {
    let filtered = petListings;
    if (selectedFilter !== "All") {
      filtered = filtered.filter(
        (pet) => pet.category.toLowerCase() === selectedFilter.toLowerCase()
      );
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (pet) =>
          pet.location.toLowerCase().includes(searchLower) ||
          pet.bname.toLowerCase().includes(searchLower) ||
          pet.category.toLowerCase().includes(searchLower)
      );
    }
    return filtered;
  };

  const applyFilters = (category) => {
    let filtered = petListings;
    if (selectedFilter !== "All") {
      filtered = filtered.filter(
        (pet) => pet.category.toLowerCase() === selectedFilter.toLowerCase()
      );
    }
    if (category) {
      filtered = filtered.filter(
        (pet) => pet.category.toLowerCase() === category.toLowerCase()
      );
    }
    return filtered;
  };

  const handleViewClick = (petId) => {
    if (!currentUser) {
      toast.error("Please login to view details");
      return;
    }
    navigate(`/view/${petId}`);
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
      toast.error("Failed to add to wishlist");
    }
  };

  return (
    <div className="home-container">
      <div className="section">
        <div className="section-header">
          <div className="filter-buttons">
            <h3 className="filter-title">Quick Filter:</h3>
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleFilterChange(filter)}
                className="filter-button"
              >
                {filter}
              </Button>
            ))}
          </div>
          <h2 className="section-title">RECOMMENDATIONS</h2>
        </div>

        <div className="card-row-wrapper">
          {[0, 1].map((rowIndex) => (
            <div className="card-row" key={`row-${rowIndex}`}>
              {applyMainFilters()
                .filter((_, index) => index % 2 === rowIndex)
                .map((pet) => (
                  <Card
                    className="custom-card"
                    key={pet._id}
                    onClick={(e) => {
                      if (!e.target.closest(".fav-icon")) {
                        handleViewClick(pet._id);
                      }
                    }}
                  >
                    <CardHeader
                      title={
                        <div className="title-with-price">
                          <span className="pet-title">
                            {pet.bname.length > 10
                              ? `${pet.bname.slice(0, 10)}...`
                              : pet.bname}
                          </span>
                          <span className="pet-price">
                            {`₹${
                              pet.price.toString().length > 6
                                ? pet.price.toString().slice(0, 6) + "..."
                                : pet.price
                            }`}
                          </span>
                        </div>
                      }
                    />

                    <CardMedia
                      component="img"
                      height="130"
                      image={pet.image || "pet image"}
                      alt={pet.bname}
                    />
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Category :{pet.category || "No description available."}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        <i className="fa-solid fa-location-dot"></i>{" "}
                        {pet.location || "No location available."}
                      </Typography>
                      <Typography>
                        Ad Posted on :
                        {new Date(pet.createdDate).toLocaleDateString()}
                      </Typography>
                      <button
                        className="fav-icon"
                        aria-label="add to favorites"
                        onClick={() => handleAddToWishlist(pet._id)}
                      >
                        Add to wishlist{" "}
                        <i className="heart fa-solid fa-star"></i>
                      </button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Additional sections for categories */}
      {["cat", "dog", "birds", "fish", "rabbit"].map((category) => (
        <div className="section" key={category}>
          <h2 className="section-title">
            {category.toUpperCase()} MARKETPLACE
          </h2>
          <div className="card-row-wrapper">
            {[0, 1].map((rowIndex) => (
              <div className="card-row" key={`${category}-${rowIndex}`}>
                {applyFilters(category)
                  .filter((_, index) => index % 2 === rowIndex)
                  .map((pet) => (
                    <Card
                      className="custom-card"
                      key={pet._id}
                      onClick={(e) => {
                        if (!e.target.closest(".fav-icon")) {
                          handleViewClick(pet._id);
                        }
                      }}
                    >
                      <CardHeader
                        title={
                          <div className="title-with-price">
                            <span className="pet-title">
                              {pet.bname.length > 15
                                ? `${pet.bname.slice(0, 15)}...`
                                : pet.bname}
                            </span>
                            <span className="pet-price">
                              {`₹${
                                pet.price.toString().length > 6
                                  ? pet.price.toString().slice(0, 6) + "..."
                                  : pet.price
                              }`}
                            </span>
                          </div>
                        }
                      />

                      <CardMedia
                        component="img"
                        height="130"
                        image={pet.image || "pet image"}
                        alt={pet.bname}
                      />
                      <CardContent>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          <i className="fa-solid fa-location-dot"></i>{" "}
                          {pet.location || "No location available."}
                        </Typography>
                        <Typography>
                          Ad Posted on :
                          {new Date(pet.createdDate).toLocaleDateString()}
                        </Typography>
                        <button
                          className="fav-icon"
                          aria-label="add to favorites"
                          onClick={() => handleAddToWishlist(pet._id)}
                        >
                          Add to wishlist{" "}
                          <i className="heart fa-solid fa-star"></i>
                        </button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
