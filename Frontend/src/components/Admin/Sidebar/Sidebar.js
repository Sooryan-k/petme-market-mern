import React from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import {
  ListAlt,
  Group,
} from "@mui/icons-material";

const drawerWidth = 240;

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#f4f6f8",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem button component={Link} to="/admin/foods/manage">
            <ListAlt style={{ marginRight: 8 }} />
            <ListItemText primary="Manage Food Items" />
          </ListItem>
          <ListItem button component={Link} to="/admin/users">
            <Group style={{ marginRight: 8 }} />
            <ListItemText primary="Platform Users" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
