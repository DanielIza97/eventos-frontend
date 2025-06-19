import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./InventoryPage.css";

const InventoryPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/productos");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="inventory-page">
      <h2>Inventario</h2>
      <button className="add-button" onClick={() => navigate("/inventory/add")}>
        Agregar nuevo producto
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
              <strong>Disponible:</strong> {product.cantidadDisponible}
            </p>
            <p>
              <strong>Precio:</strong> ${product.precioUnitario.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
