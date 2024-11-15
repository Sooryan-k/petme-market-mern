import React, { useState, useEffect, useCallback } from "react";
import "./Wishlist.css";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UpdateListing from "../UpdateList/UpdateList";

function Wishlist() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("favourites");
  const [wishlist, setWishlist] = useState([]);
  const [userAds, setUserAds] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editListingId, setEditListingId] = useState(null);
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchWishlist = useCallback(async () => {
    if (!currentUser) {
      toast.error("Please login to see wishlist");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_APPLICATION_URL}/api/wishlist/user/${currentUser.uid}`
      );
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      } else {
        toast.error("Failed to fetch wishlist data");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Error fetching wishlist");
    }
  }, [currentUser]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleViewClick = (id) => {
    if (!currentUser) {
      toast.error("Please login to view details");
      return;
    }
    navigate(`/view/${id}`);
  };

  const handleDeleteClick = async (petId) => {
    if (!currentUser) {
      toast.error("Please login to delete items");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_APPLICATION_URL}/api/wishlist/remove`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: currentUser.uid,
            petId,
          }),
        }
      );
      if (response.ok) {
        toast.success("Wishlist item deleted successfully");
        setWishlist((wishlist) =>
          wishlist.filter((item) => item.petId && item.petId._id !== petId)
        );
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      toast.error("Error deleting wishlist item");
    }
  };

  const fetchUserAds = useCallback(async () => {
    if (!currentUser) {
      toast.error("Please login to see your ads");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_APPLICATION_URL}/api/pet-listing/userads/${currentUser.uid}`
      );
      if (response.ok) {
        const data = await response.json();
        setUserAds(data);
      } else {
        toast.error("Failed to fetch user ads");
      }
    } catch (error) {
      console.error("Error fetching user ads:", error);
      toast.error("Error fetching user ads");
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserAds();
  }, [fetchUserAds]);

  const handleDeleteList = async (_id) => {
    if (!currentUser) {
      toast.error("Please login to delete your ads");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_APPLICATION_URL}/api/pet-listing/delete/${_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: currentUser.uid,
          }),
        }
      );
      if (response.ok) {
        toast.success("Ad deleted successfully");
        setUserAds((prevAds) => prevAds.filter((item) => item._id !== _id));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete ad");
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
      toast.error("Error deleting ad");
    }
  };

  const openUpdateModal = (listingId) => {
    setEditListingId(listingId);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setEditListingId(null);
  };

  const handleUpdateSuccess = () => {
    fetchUserAds();
  };

  const renderCards = (data, isWishlist = false, isMyads = false) => {
    return data
      .filter((item) => (isWishlist ? item.petId && item.petId._id : true))
      .map((item) => (
        <div className="wishlist-card-div" key={item._id}>
          <Card
            className="wishlist-card-item"
            onClick={(e) => {
              if (
                !e.target.closest(
                  ".wishlist-delete-btn,.wishlist-edit-btn,.wishlist-delete-btn-myads"
                )
              ) {
                if (item.petId && item.petId._id) {
                  handleViewClick(item.petId._id);
                } else if (isMyads) {
                  handleViewClick(item._id);
                }
              }
            }}
          >
            <CardHeader
              title={
                <div className="wishlist-title-container">
                  <Typography
                    className="wishlist-card-title"
                    sx={{
                      fontSize: { xs: "15px", md: "17px", lg: "18px" },
                      fontWeight: "bold",
                    }}
                  >
                    {isWishlist
                      ? item.petId?.bname.length > 8
                        ? `${item.petId?.bname.slice(0, 8)}...`
                        : item.petId?.bname
                      : item.bname.length > 8
                      ? `${item.bname.slice(0, 8)}...`
                      : item.bname}
                  </Typography>
                  <Typography
                    className="wishlist-card-price"
                    sx={{
                      fontSize: { xs: "14px", md: "16px", lg: "17px" },
                      fontWeight: "bold",
                    }}
                  >
                    {`₹${
                      (isWishlist ? item.petId?.price : item.price).toString()
                        .length > 4
                        ? (isWishlist ? item.petId?.price : item.price)
                            .toString()
                            .slice(0, 4) + "..."
                        : isWishlist
                        ? item.petId?.price
                        : item.price
                    }`}
                  </Typography>
                </div>
              }
              className="wishlist-card-header"
            />

            <CardMedia
              component="img"
              height="180"
              image={isWishlist ? item.petId?.image : item.image}
              alt="Card image"
            />
            <CardContent className="wishlist-card-body">
              <Typography variant="body2" color="text.secondary">
                Category : {isWishlist ? item.petId?.category : item.category}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Ad Posted on:{" "}
                {isWishlist
                  ? new Date(item.petId?.createdDate).toLocaleDateString()
                  : new Date(item.createdDate).toLocaleDateString()}
              </Typography>

              {isWishlist && item.petId && item.petId._id && (
                <div className="wishlist-favourites-buttons wishlist-card-buttons">
                  <button
                    className="wishlist-delete-btn"
                    aria-label="delete"
                    onClick={() => handleDeleteClick(item.petId._id)}
                  >
                    Delete <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              )}

              {isMyads && (
                <div>
                  <div className="wishlist-myads-buttons wishlist-card-buttons">
                    <button
                      className="wishlist-edit-btn"
                      aria-label="edit"
                      onClick={() => openUpdateModal(item._id)}
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      className="wishlist-delete-btn-myads"
                      aria-label="delete"
                      onClick={() => handleDeleteList(item._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ));
  };

  return (
    <div className="wishlist-container">
      <div className="wishlist-tabs">
        <button
          className={`wishlist-tab-btn ${
            activeTab === "favourites" ? "active" : ""
          }`}
          onClick={() => handleTabClick("favourites")}
        >
          WISHLIST
        </button>
        <button
          className={`wishlist-tab-btn ${activeTab === "ads" ? "active" : ""}`}
          onClick={() => handleTabClick("ads")}
        >
          MY ADS
        </button>
      </div>

      <div className="wishlist-cards-container">
        {activeTab === "favourites" ? (
          wishlist.length > 0 ? (
            renderCards(wishlist, true, false)
          ) : (
            <div className="wishlist-empty-message-container">
              <p className="wishlist-empty-message">Your wishlist is empty.</p>
            </div>
          )
        ) : userAds.length > 0 ? (
          renderCards(userAds, false, true)
        ) : (
          <div className="wishlist-empty-message-container">
            <p className="wishlist-empty-message">You have no ads posted.</p>
          </div>
        )}
      </div>

      <UpdateListing
        isOpen={isUpdateModalOpen}
        toggle={closeUpdateModal}
        listingId={editListingId}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}

export default Wishlist;
