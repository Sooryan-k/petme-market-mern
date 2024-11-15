import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import UpdateItem from "../UpdateItem/UpdateItem";
import toast from "react-hot-toast";

export default function ManageFoodItems() {
  const [foodItems, setFoodItems] = useState([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editListingId, setEditListingId] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          const response = await fetch(
            `${process.env.REACT_APP_APPLICATION_URL}/api/admin/food`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setFoodItems(data);
          } else {
            console.error("Failed to fetch food items:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching food items:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFoodItems();
  }, [currentUser]);

  const handleDelete = async (id) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(
        `${process.env.REACT_APP_APPLICATION_URL}/api/admin/food/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setFoodItems((prevItems) =>
          prevItems.filter((item) => item._id !== id)
        );
        toast.success("Food item deleted successfully");
      } else {
        const errorText = await response.text();
        console.error("Failed to delete item:", errorText);
        toast.error("Failed to delete food item");
      }
    } catch (error) {
      console.error("Error deleting food item:", error);
      toast.error("Error deleting food item");
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

  // callback to refresh list after updating item
  const handleUpdateSuccess = async () => {
    closeUpdateModal();
    const token = await currentUser.getIdToken();
    const response = await fetch(
      `${process.env.REACT_APP_APPLICATION_URL}/api/admin/food`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const updatedData = await response.json();
      setFoodItems(updatedData);
    }
  };

  if (loading) return <Typography>Loading food items...</Typography>;

  return (
    <Box sx={{ padding: "0" }}>
      <Typography variant="h4" gutterBottom>
        Manage Food Items
      </Typography>
      <TableContainer sx={{ padding: "10px" }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Food Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Seller</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foodItems.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.fname}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.sname}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => openUpdateModal(item._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="secondary"
                    size="small"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UpdateItem
        isOpen={isUpdateModalOpen}
        toggle={closeUpdateModal}
        listingId={editListingId}
        onUpdateSuccess={handleUpdateSuccess} // callback to refresh list after edit
      />
    </Box>
  );
}
