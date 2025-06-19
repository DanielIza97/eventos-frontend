import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./InventoryPage.css";

const InventoryPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/productos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="inventory-page">
      <h2>Inventory</h2>
      <button onClick={() => navigate("/inventory/add")}>
        Add New Product
      </button>
      <div className="inventory-grid">
        {products.map((product) => (
          <div key={product._id} className="inventory-card">
            {product.imagenes && product.imagenes.length > 0 && (
              <img
                src={`${process.env.REACT_APP_UPLOADS_URL}/${product.imagenes[0]}`}
                alt={product.nombre}
              />
            )}
            <h3>{product.nombre}</h3>
            <p>{product.descripcion}</p>
            <p>
              <strong>Available:</strong> {product.cantidadDisponible}
            </p>
            <p>
              <strong>Price:</strong> ${product.precioUnitario.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
