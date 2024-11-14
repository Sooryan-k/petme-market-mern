import React, { useState, useEffect } from "react";
import "./Cart.css";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";

function Cart() {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    houseNumber: "",
    streetName: "",
    pincode: "",
    state: "",
  });

  useEffect(() => {
    if (currentUser) {
      fetchCartItems(currentUser.uid);
    }
  }, [currentUser]);

  const fetchCartItems = async (uid) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/cart/user/${uid}`
      );
      if (!response.ok) throw new Error("Failed to fetch cart items");
      const data = await response.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to fetch cart items");
    }
  };

  const handleQuantityChange = (id, increment) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id
          ? { ...item, quantity: (item.quantity || 1) + increment }
          : item
      )
    );
  };

  const handleRemove = async (id) => {
    if (!currentUser) {
      toast.error("Please login first");
    } else {
      try {
        await fetch(`http://localhost:5001/api/cart/remove`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: currentUser.uid, itemId: id }),
        });
        setCartItems(cartItems.filter((item) => item._id !== id));
        fetchCartItems(currentUser.uid);
        toast.success("Item removed from cart");
      } catch (error) {
        console.error("Failed to remove item:", error);
        toast.error("Failed to remove item from cart");
      }
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const itemPrice = item.itemId?.price || 0;
        const itemQuantity = item.quantity || 1;
        return total + itemPrice * itemQuantity;
      }, 0)
      .toFixed(2);
  };

  const toggleCheckout = () => {
    if(!currentUser){
      toast.error("Please log in to checkout")
    }else{
      setShowCheckout(!showCheckout);
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    const amount = calculateTotal();

    if (typeof window.Razorpay === "undefined") {
      toast.error("Razorpay is not available. Please try again later.");
      return;
    }

    fetch("http://localhost:5001/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: "INR" }),
    })
      .then((res) => res.json())
      .then((data) => {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: "INR",
          name: "PETme",
          description: "Test Transaction",
          order_id: data.orderId,
          handler: (response) => {
            toast.success("Payment successful!");
            setShowCheckout(false);
          },
          prefill: {
            name: formData.username,
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      })
      .catch((error) => {
        console.error("Payment initiation failed:", error);
        toast.error("Payment initiation failed.");
      });
  };

  return (
    <div className="cart-container">
      <div className="cart-table-wrapper">
        <table className="cart-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.itemId?.fname || "Unknown Item"}</td>
                  <td>
                    <img
                      src={item.itemId?.image || "/default-image.jpg"}
                      alt="product"
                      className="product-image"
                    />
                  </td>
                  <td>
                    <button
                      className="quantity-btn"
                      onClick={() => {
                        if (item.quantity > 1) {
                          handleQuantityChange(item._id, -1);
                        }
                      }}
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">
                      {item.quantity || 1}
                    </span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item._id, 1)}
                    >
                      +
                    </button>
                  </td>
                  <td>
                    ₹{(item.itemId?.price * (item.quantity || 1)).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.itemId._id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Your cart is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="checkout-section">
        <h3>Subtotal: ₹{calculateTotal()}</h3>
        <Button color="success" onClick={toggleCheckout}>
          Check out
        </Button>
      </div>

      <Modal centered isOpen={showCheckout} toggle={toggleCheckout}>
        <ModalHeader toggle={toggleCheckout}>
          Check out details
          <button
            onClick={toggleCheckout}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#000",
            }}
          >
            &times;
          </button>
        </ModalHeader>
        <ModalBody>
          <div className="checkout-modal">
            <h3>Enter your details</h3>
            <form className="checkout-modal-form">
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="houseNumber"
                placeholder="House number"
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="streetName"
                placeholder="Street name"
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="pincode"
                placeholder="PIN CODE"
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="proceed-btn"
                onClick={handlePayment}
              >
                Proceed to pay
              </button>
              <p className="total-amount">Total Amount: ₹{calculateTotal()}</p>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default Cart;
