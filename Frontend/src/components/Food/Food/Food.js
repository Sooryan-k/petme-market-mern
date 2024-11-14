import React, { useState, useEffect, useContext } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./Food.css";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../../context/SeachContext";

function Food() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [itemListings, setItemListings] = useState([]);
  const { searchTerm } = useContext(SearchContext);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APPLICATION_URL}/api/food-items/listed-items`
        );
        const data = await response.json();
        setItemListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  // define filters and handle filter change
  const filters = ["All", "Food", "Accessories"];
  const catFilter = itemListings.filter((item) => item.category === "cat");
  const dogFilter = itemListings.filter((item) => item.category === "dog");
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };
  const applyFilters = () => {
    let filtered = itemListings;

    if (selectedFilter !== "All") {
      filtered = filtered.filter(
        (item) => item.itemType.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.fname.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const filteredItems = applyFilters();

  // view
  const handleViewClick = (itemId) => {
    if (!currentUser) {
      toast.error("Please login to view details");
      return;
    }
    navigate(`/viewfood/${itemId}`);
  };
  //add to cart
  const handleAddToCart = async (itemId, event) => {
    event.stopPropagation();

    if (!currentUser) {
      console.log("please login first to add to cart");
      toast.error("Please log in to add to cart");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_APPLICATION_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: currentUser.uid,
            itemId,
          }),
        }
      );

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
    <div className="food-container">
      <div className="food-section-header">
        <div className="food-filter-container">
          <h3 className="food-filter-title">Quick Filter:</h3>
          <div className="food-filter-buttons">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleFilterChange(filter)}
                className="food-filter-button"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
        <h2 className="food-section-title">QUICK RECOMMENDATIONS</h2>
      </div>

      <div className="food-card-grid">
        {filteredItems.map((item) => (
          <Card
            className="food-card"
            key={item._id}
            onClick={() => handleViewClick(item._id)}
          >
            <div className="food-image-container">
              <CardMedia
                component="img"
                height="140"
                image={item.image || "/static/images/cards/default.jpg"}
                alt={item.fname}
                className="food-card-image"
              />
              <div className="food-image-overlay">
                <Typography variant="h6" className="food-title">
                  {item.fname}
                </Typography>
                <Typography variant="h6" className="food-price">
                  ₹{item.price || "Unknown"}
                </Typography>
              </div>
            </div>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Category: {item.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Seller: {item.sname || "Unknown"}
              </Typography>
            </CardContent>
            <div className="food-card-actions">
              <button
                className="food-action-button"
                onClick={(event) => handleAddToCart(item._id, event)}
                aria-label="add to cart"
              >
                Add to <i className="cart fa-solid fa-cart-plus"></i>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Cat Section */}
      <div className="food-section">
        <h2 className="food-section-title">CAT MARKETPLACE</h2>
        <div className="food-card-grid">
          {catFilter.map((item) => (
            <Card
              className="food-card"
              key={item._id}
              onClick={() => handleViewClick(item._id)}
            >
              <div className="food-image-container">
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image || "pet image"}
                  alt={item.fname}
                  className="food-card-image"
                />
                <div className="food-image-overlay">
                  <Typography variant="h6" className="food-title">
                    {item.fname}
                  </Typography>
                  <Typography variant="h6" className="food-price">
                    ₹{item.price || "Unknown"}
                  </Typography>
                </div>
              </div>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Type: {item.itemType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seller: {item.sname || "Unknown"}
                </Typography>
              </CardContent>
              <div className="food-card-actions">
                <button
                  className="food-action-button"
                  onClick={(event) => handleAddToCart(item._id, event)}
                  aria-label="add to cart"
                >
                  Add to <i className="cart fa-solid fa-cart-plus"></i>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Dog Section */}
      <div className="food-section">
        <h2 className="food-section-title">DOG MARKETPLACE</h2>
        <div className="food-card-grid">
          {dogFilter.map((item) => (
            <Card
              className="food-card"
              key={item._id}
              onClick={() => handleViewClick(item._id)}
            >
              <div className="food-image-container">
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image || "pet image"}
                  alt={item.fname}
                  className="food-card-image"
                />
                <div className="food-image-overlay">
                  <Typography variant="h6" className="food-title">
                    {item.fname}
                  </Typography>
                  <Typography variant="h6" className="food-price">
                    ₹{item.price || "Unknown"}
                  </Typography>
                </div>
              </div>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Type: {item.itemType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seller: {item.sname || "Unknown"}
                </Typography>
              </CardContent>
              <div className="food-card-actions">
                <button
                  className="food-action-button"
                  onClick={(event) => handleAddToCart(item._id, event)}
                  aria-label="add to cart"
                >
                  Add to <i className="cart fa-solid fa-cart-plus"></i>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Food;
