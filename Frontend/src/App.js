//pet
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ViewPetPage from "./Pages/ViewPetPage";
import WishlistPage from "./Pages/WishlistPage";
import Page404 from "./components/Pet/PageNotFound/Page404";
import { Toaster } from "react-hot-toast";
import "./App.css";

//food
import FoodPage from "./Pages/FoodPage";
import ViewFoodPage from "./Pages/ViewFood";
import CartPage from "./Pages/CartPage";

// Admin
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoute/ProtectedAdminRoute";
import AdminLayout from "./components/Admin/Layout/AdminLayout";
import ManageFoodItems from "./components/Admin/Manageitems/ManageFoodItems";
import PlatformUsers from "./components/Admin/Userlist/PlatformUsers";

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" autoClose={3000} reverseOrder={false} />
      <Routes>
        {/* Public routes */}
        {/* pet  */}
        <Route path="/" element={<HomePage />} />
        <Route path="/view/:petId" element={<ViewPetPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="*" element={<Page404 />} />

        {/* food */}
        <Route path="/food" element={<FoodPage />} />
        <Route path="/viewfood/:itemId" element={<ViewFoodPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            //to access admin routes only for admins
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="foods/manage" element={<ManageFoodItems />} />
          <Route path="users" element={<PlatformUsers />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
