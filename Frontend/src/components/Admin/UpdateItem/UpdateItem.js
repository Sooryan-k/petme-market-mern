import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from "mdb-react-ui-kit";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

function UpdateItem({ isOpen, toggle, listingId, onUpdateSuccess }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    uid: "",
    fname: "",
    sname: "",
    price: "",
    category: "cat",
    itemType: "food",
    about: "",
    image: null,
  });
  const [imageUploadStatus, setImageUploadStatus] = useState("");

  // fecthing existing data
  useEffect(() => {
    const loadListing = async () => {
      if (currentUser && listingId) {
        try {
          const token = await currentUser.getIdToken();
          const response = await fetch(
            `${process.env.REACT_APP_APPLICATION_URL}/api/admin/food/view/${listingId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setFormData({
              uid: data.uid,
              fname: data.fname,
              sname: data.sname,
              price: data.price,
              category: data.category,
              itemType: data.itemType,
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
      }
    };

    if (listingId) {
      loadListing();
    }
  }, [currentUser, listingId]);

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
    e.preventDefault();
    setLoading(true);

    if (currentUser) {
      const data = new FormData();
      data.append("uid", formData.uid);
      data.append("fname", formData.fname);
      data.append("sname", formData.sname);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("itemType", formData.itemType);
      data.append("about", formData.about);
      if (formData.image) data.append("image", formData.image);

      try {
        const token = await currentUser.getIdToken();
        const response = await fetch(
          `${process.env.REACT_APP_APPLICATION_URL}/api/admin/food/edit/${listingId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: data,
          }
        );

        if (response.ok) {
          toast.success("Listing updated successfully!");
          onUpdateSuccess();
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
          <MDBModalDialog>
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

                    <label htmlFor="fname">Food name</label>
                    <input
                      type="text"
                      id="fname"
                      name="fname"
                      value={formData.fname}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="sname">Seller name</label>
                    <input
                      type="text"
                      id="sname"
                      name="sname"
                      value={formData.sname}
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
                    <label htmlFor="itemType">Type</label>
                    <select
                      id="itemType"
                      name="itemType"
                      value={formData.itemType}
                      onChange={handleChange}
                    >
                      <option value="food">Food</option>
                      <option value="accessories">Accessories</option>
                    </select>

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

                    <label htmlFor="about">About item</label>
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

export default UpdateItem;
