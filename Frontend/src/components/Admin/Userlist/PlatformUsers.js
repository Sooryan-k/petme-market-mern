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
import toast from "react-hot-toast";

export default function PlatformUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          const response = await fetch(
            `${process.env.REACT_APP_APPLICATION_URL}/api/admin/users`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setUsers(data);
          } else {
            toast.error("Failed to fetch users");
            console.error("Failed to fetch users:", response.statusText);
          }
        } catch (error) {
          toast.error("Error fetching users");
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [currentUser]);

  const handleDelete = async (uid) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(
        `${process.env.REACT_APP_APPLICATION_URL}/api/admin/delete-user/${uid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.uid !== uid));
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
        console.error("Failed to delete user");
      }
    } catch (error) {
      toast.erro("Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };

  const handleMakeAdmin = async (uid) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(
        `${process.env.REACT_APP_APPLICATION_URL}/api/admin/make-admin/${uid}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.uid === uid ? { ...user, isAdmin: true } : user
          )
        );
        toast.success("User granted admin privileges");
      } else {
        toast.success("Failed to grant admin privileges");
        console.error("Failed to grant admin privileges");
      }
    } catch (error) {
      toast.success("Erro granting admin privileges");
      console.error("Error granting admin privileges:", error);
    }
  };

  const handleRemoveAdmin = async (uid) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(
        `${process.env.REACT_APP_APPLICATION_URL}/api/admin/remove-admin/${uid}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.uid === uid ? { ...user, isAdmin: false } : user
          )
        );
        toast.success("Admin privileges removed");
      } else {
        toast.error("Failed to remove admin privileges");
        console.error("Failed to remove admin privileges");
      }
    } catch (error) {
      toast.error("Error removing admin privileges");
      console.error("Error removing admin privileges:", error);
    }
  };

  if (loading) return <Typography>Loading users...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Platform Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    color="secondary"
                    size="small"
                    onClick={() => handleDelete(user.uid)}
                  >
                    Delete
                  </Button>
                  {user.isAdmin ? (
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleRemoveAdmin(user.uid)}
                    >
                      Remove Admin
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      size="small"
                      onClick={() => handleMakeAdmin(user.uid)}
                    >
                      Make Admin
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
