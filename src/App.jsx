import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import CreateEventPage from "./pages/orders/CreateOrderPage";
import OrdersPage from "./pages/orders/OrdersPage";
import PrivateRoute from "./components/common/PrivateRoute";
import InventoryPage from "./pages/inventory/InventoryPage";
import AddProductPage from "./pages/inventory/AddProductPage";
import EditProductPage from "./pages/inventory/EditProductPage";
import EditOrderPage from "./pages/orders/EditOrderPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/crear-evento"
          element={
            <PrivateRoute>
              <CreateEventPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <InventoryPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/inventory/add"
          element={
            <PrivateRoute>
              <AddProductPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/inventory/edit/:id"
          element={
            <PrivateRoute>
              <EditProductPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/editar-evento/:id"
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
