import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from "mdb-react-ui-kit";
import "./UpdateList.css";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

function UpdateListing({ isOpen, toggle, listingId, onUpdateSuccess }) {
  const {currentUser} = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    uid: "",
    name: "",
    phone: "",
    location: "",
    category: "cat",
    bname: "",
    price: "",
    about: "",
    image: null,
  });
  const [imageUploadStatus, setImageUploadStatus] = useState("");

  // load listing data on listing form
  useEffect(() => {
    const loadListing = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/pet-listing/view/${listingId}`,
        );
        if (response.ok) {
          const data = await response.json();
          setFormData({
            uid: data.uid,
            name: data.name,
            phone: data.phone,
            location: data.location,
            category: data.category,
            bname: data.bname,
            price: data.price,
            about: data.about,
            image: null,
          });
        } else {
          toast.error("Failed to load listing data");
        }
      } catch (error) {
        console.error("Error loading listing:", error);
        toast.error("Error loading listing");
      }
    };

    if (listingId) {
      loadListing();
    }
  }, [listingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
    if (e.target.files[0]) {
      setImageUploadStatus("Image selected: " + e.target.files[0].name);
    } else {
      setImageUploadStatus("");
    }
  };

  const handleSubmit = async (e) => {
    if (!currentUser) {
      toast.error("Please login to edit items");
      return;
    }
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("uid", formData.uid);
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("location", formData.location);
    data.append("category", formData.category);
    data.append("bname", formData.bname);
    data.append("price", formData.price);
    data.append("about", formData.about);
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await fetch(
        `http://localhost:5001/api/pet-listing/update/${listingId}`,
        {
          method: "PUT",
          body: data,
        },
      );
      if (response.ok) {
        toast.success("Listing updated successfully!");
        onUpdateSuccess(); // callback to refresh parent component data
        toggle();
      } else {
        toast.error("Error updating listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Error updating listing");
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    if (toggle) {
      toggle();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal-container" style={{ zIndex: "9999" }}>
          <MDBModalDialog centered>
            <MDBModalContent>
              <MDBModalBody>
                <div className="form-container">
                  <MDBBtn
                    className="btn-close"
                    color="none"
                    onClick={handleClose}
                  >
                    ✖
                  </MDBBtn>
                  <form className="submission-form" onSubmit={handleSubmit}>
                    <h2>Edit your Listing</h2>

                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="phone">Phone number</label>
                    <input
                      type="number"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="cat">Cat</option>
                      <option value="dog">Dog</option>
                      <option value="fish">Fish</option>
                      <option value="rabbit">Rabbit</option>
                      <option value="birds">Birds</option>
                      <option value="others">Others</option>
                    </select>

                    <label htmlFor="bname">Breed Name</label>
                    <input
                      type="text"
                      id="bname"
                      name="bname"
                      value={formData.bname}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="price">Price</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="file">Upload New Image</label>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imageUploadStatus && (
                      <p style={{ color: "green" }}>{imageUploadStatus}</p>
                    )}

                    <label htmlFor="about">About pet</label>
                    <textarea
                      id="about"
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Listing"}
                    </button>
                  </form>
                </div>
              </MDBModalBody>
            </MDBModalContent>
          </MDBModalDialog>
        </div>
      )}
    </>
  );
}

export default UpdateListing;
