import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import CreateEventPage from "./pages/orders/CreateOrderPage";
import OrderPage from "./pages/orders/OrderPage";
import PrivateRoute from "./components/common/PrivateRoute";
import ProductPage from "./pages/products/ProductPage";
import AddProductPage from "./pages/products/AddProductPage";
import EditProductPage from "./pages/products/EditProductPage";
import EditOrderPage from "./pages/orders/EditOrderPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/products/add"
          element={
            <PrivateRoute>
              <AddProductPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/products/edit/:id"
          element={
            <PrivateRoute>
              <EditProductPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrderPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders/add"
          element={
            <PrivateRoute>
              <CreateEventPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders/edit/:id"
          element={
            <PrivateRoute>
              <EditOrderPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
