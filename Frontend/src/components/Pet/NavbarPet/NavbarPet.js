import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import List from "../List/List";
import LoginModal from "../Login/LoginModal";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { SearchContext } from "../../../context/SeachContext";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Switch from "@mui/material/Switch";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./NavbarPet.css"; 

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  display: "flex",
  alignItems: "center", 
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none", 
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  flex: 1, // makes the input take up the full width
  "& .MuiInputBase-input": {
    padding: theme.spacing(1), 
    paddingLeft: theme.spacing(1), 
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));
export default function NavbarPet() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isFoodSection, setIsFoodSection] = useState(
    location.pathname === "/food"
  );

  const isSmallScreen = useMediaQuery("(max-width:600px)");


  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // sync toggle state with URL path on component mount or location change
  useEffect(() => {
    setIsFoodSection(location.pathname === "/food");
  }, [location]);

  //for search
  const { setSearchTerm } = useContext(SearchContext);

  const { currentUser, logout } = useAuth();
  const [signupUsername, setSignupUsername] = useState(null);

  const username = signupUsername || currentUser?.displayName;
  const onSignupSuccess = (newUsername) => {
    setSignupUsername(newUsername);
  };

  const goToWishlist = () => {
    navigate("/wishlist");
  };

  const goToCart = () => {
    navigate("/cart");
  };

  //toggle between sections
  const handleToggle = () => {
    if (isFoodSection) {
      navigate("/");
    } else {
      navigate("/food");
    }
  };

  //logout
  const handleLogout = () => {
    logout()
      .then(() => {
        navigate("/")
        console.log("User logged out");
      })
      .catch((error) => {
        console.error(error);
      });

    handleMenuClose();
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <List />
      </MenuItem>
      <MenuItem onClick={goToWishlist}>
        <IconButton color="inherit">
          <i style={{ color: "#f4cc2d" }} class="fa-solid fa-star"></i>
        </IconButton>
        WISHLIST
      </MenuItem>
      <MenuItem onClick={goToCart}>
        <IconButton color="inherit">
          <ShoppingCartIcon style={{ color: "#1a9bdb" }} />
        </IconButton>
        CART
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton color="inherit">
          <AccountCircle style={{ color: "#1adb88" }} />
        </IconButton>
        ACCOUNT
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#034b94",
          maxHeight: { xs: "103px", lg: "64px", md: "100px" },
          minHeight: { xs: "103px", lg: "64px", md: "100px" },
        }}
      >
        <Toolbar
          className={
            isSmallScreen ? "navbar-small-screen" : "navbar-large-screen"
          }
        >
          {isSmallScreen ? (
            <>
              {/* small screen design */}
              <Box className="navbar-row">
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  className="logo"
                  onClick={() => navigate("/")}
                  sx={{ color: "#d4fa00" }}
                >
                  PETme
                </Typography>

                <Search
                  className="search-bar"
                  onChange={(e) => setSearchTerm(e.target.value)}
                >
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search Pets ,Foods...."
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search>

                {username && (
                  <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="open mobile menu"
                    onClick={handleMobileMenuOpen}
                    className="mobile-menu-icon"
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </Box>
              <Box className="toggle-section-box">
                <span className="toggle-label">PETS </span>
                <Switch
                  checked={isFoodSection}
                  onChange={handleToggle}
                  color="default"
                  className="toggle-switch"
                  inputProps={{ "aria-label": "toggle pet/food section" }}
                />
                <span className="toggle-label">FOOD</span>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  className="navbar-row"
                >
                  {username ? (
                    <Typography
                      variant="body1"
                      className="username"
                      sx={{ color: "#d4fa00" }}
                    >
                      [ Hey there, {username} ]
                    </Typography>
                  ) : (
                    <LoginModal onSignupSuccess={onSignupSuccess} />
                  )}
                </Box>
              </Box>
            </>
          ) : (
            <>
              {/* large and medium screen design */}
              <Typography
                variant="h6"
                noWrap
                component="div"
                className="large-screen-logo"
                onClick={() => navigate("/")}
                sx={{ color: "#d4fa00" }}
              >
                PETme
              </Typography>
              <Search
                className="large-screen-search-bar"
                onChange={(e) => setSearchTerm(e.target.value)}
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search Pets, Foods, Accessories ...."
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
              <Box className="toggle-section-box">
                <span className="toggle-label">PETS MARKETPLACE </span>
                <Switch
                  checked={isFoodSection}
                  onChange={handleToggle}
                  color="default"
                  className="toggle-switch"
                />
                <span className="toggle-label">FOOD & ACCESSORIES</span>
              </Box>
              <Box className="large-screen-actions">
                {username ? (
                  <>
                    <Typography variant="body1" sx={{ color: "#d4fa00" }}>
                      [ Hey there, {username} ]
                    </Typography>
                    <MenuItem>
                      <List />
                    </MenuItem>
                    <IconButton color="inherit" onClick={goToWishlist}>
                      <i
                        style={{ color: "#f4cc2d" }}
                        class="fa-solid fa-star"
                      ></i>
                    </IconButton>
                    <IconButton color="inherit" onClick={goToCart}>
                      <ShoppingCartIcon style={{ color: "#c7c6ad" }} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="account"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <AccountCircle style={{ color: "#1adb88" }} />
                    </IconButton>
                  </>
                ) : (
                  <span className="loginmodal">
                    <LoginModal onSignupSuccess={onSignupSuccess} />
                  </span>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
