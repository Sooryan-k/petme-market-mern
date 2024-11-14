import React, { useState, useEffect } from "react";
import "./ListFood.css";
import {
  MDBBtn,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from "mdb-react-ui-kit";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

function ListFood() {
  const [staticModal, setStaticModal] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const toggleOpen = () => setStaticModal(!staticModal);

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

  useEffect(() => {
    if (currentUser) {
      setFormData((prevData) => ({ ...prevData, uid: currentUser.uid }));
    }
  }, [currentUser]);

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
    if (!currentUser) {
      toast.error("No user is currently signed in.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("uid", formData.uid || currentUser.uid);
    data.append("fname", formData.fname);
    data.append("sname", formData.sname);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("itemType", formData.itemType);
    data.append("about", formData.about);
    data.append("image", formData.image);

    try {
      const token = await currentUser.getIdToken();
      console.log("ID Token:", token);

      const response = await fetch(
        `${process.env.REACT_APP_APPLICATION_URL}/api/admin/food`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Item listed successfully:", result);
        toast.success("Item listed successfully!");
        toggleOpen();
      } else {
        console.error("Error listing item:", await response.text());
        toast.error("You are not authorized ");
      }
    } catch (error) {
      console.error("Error listing item:", error);
      toast.error("Error listing item. Please try again.");
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
        <i className="fa-solid fa-plus"></i> List a item
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

                    <label htmlFor="name">Food Name</label>
                    <input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter Food/Item name"
                      required
                      onChange={handleChange}
                    />

                    <label htmlFor="phone">Seller name</label>
                    <input
                      type="text"
                      id="sname"
                      name="sname"
                      placeholder="Enter seller name"
                      required
                      onChange={handleChange}
                    />

                    <label htmlFor="location">Price</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      placeholder="Enter price"
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

                    <label htmlFor="itemType">Type</label>
                    <select
                      id="itemType"
                      name="itemType"
                      onChange={handleChange}
                    >
                      <option value="food">Food</option>
                      <option value="accessories">Accessories</option>
                    </select>

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

                    <label htmlFor="about">About </label>
                    <textarea
                      id="about"
                      name="about"
                      placeholder="Tell more about Food/item"
                      required
                      onChange={handleChange}
                    />
                    <div>
                      <button
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

export default ListFood;
