import React, { useState } from "react";
import {
  MDBBtn,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from "mdb-react-ui-kit";
import "./List.css";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

function List() {
  const [staticModal, setStaticModal] = useState(false);

  const toggleOpen = () => setStaticModal(!staticModal);

  const [imageUploadStatus, setImageUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);

  //TO GET UID

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      setFormData((prevData) => ({ ...prevData, uid: currentUser.uid }));
    }
  }, [currentUser]);

  // lisitng
  const [formData, setFormData] = useState({
    uid: "", // user id from your authentication system
    name: "",
    phone: "",
    location: "",
    category: "cat", // default or select value
    bname: "",
    price: "",
    about: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    if (currentUser && !formData.uid) {
      setFormData((prevData) => ({ ...prevData, uid: currentUser.uid }));
    }

    setLoading(true);

    const data = new FormData();
    data.append("uid", formData.uid || currentUser?.uid);
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("location", formData.location);
    data.append("category", formData.category);
    data.append("bname", formData.bname);
    data.append("price", formData.price);
    data.append("about", formData.about);
    data.append("image", formData.image);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_APPLICATION_URL}/api/pet-listing/create`,
        {
          method: "POST",
          body: data,
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log("Pet listed successfully:", result);
        toast.success("Pet listed successfully!");
        toggleOpen();
      } else {
        console.error("Error listing pet:", await response.text());
        toast.error("Error listing pet. Please try again.");
      }
    } catch (error) {
      console.error("Error listing pet:", error);
      toast.error("Error listing pet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MDBBtn
        style={{
          backgroundColor: "green",
          width: "130px",
          height: "40px",
          border: "none",
          borderRadius: "5px",
        }}
        onClick={toggleOpen}
      >
        <i class="fa-solid fa-plus"></i> List a pet
      </MDBBtn>

      {staticModal && (
        <div className="modal-container">
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalBody>
                <div className="form-container">
                  <MDBBtn
                    className="btn-close"
                    color="none"
                    onClick={toggleOpen}
                  >
                    ✖
                  </MDBBtn>
                  <form className="submission-form" onSubmit={handleSubmit}>
                    <h2>Enter Details</h2>

                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter name"
                      required
                      onChange={handleChange}
                    />

                    <label htmlFor="phone">Phone number</label>
                    <input
                      type="number"
                      id="phone"
                      name="phone"
                      placeholder="Enter phone number"
                      required
                      onChange={handleChange}
                    />

                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="Enter your location"
                      required
                      onChange={handleChange}
                    />

                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
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
                      placeholder="Enter Breed name"
                      required
                      onChange={handleChange}
                    />

                    <label htmlFor="price">Price</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      placeholder="Enter price"
                      required
                      onChange={handleChange}
                    />

                    <label htmlFor="file">Upload Image</label>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      accept="image/*"
                      required
                      onChange={handleImageChange}
                    />
                    {imageUploadStatus && (
                      <p style={{ color: "green" }}>{imageUploadStatus}</p>
                    )}

                    <label htmlFor="about">About pet</label>
                    <textarea
                      id="about"
                      name="about"
                      placeholder="Tell more about your pet"
                      required
                      onChange={handleChange}
                    />
                    <div>
                      <button
                        onClick={handleSubmit}
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                      >
                        {loading ? "Listing your pet..." : "List your pet"}
                      </button>
                    </div>
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

export default List;
