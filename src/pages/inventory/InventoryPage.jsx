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
      <div style={{ marginBottom: "1rem" }}></div>
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

            <button
              className="edit-button"
              onClick={() => navigate(`/inventory/edit/${product._id}`)}
              style={{
                marginTop: "0.5rem",
                padding: "0.4rem 0.8rem",
                backgroundColor: "#ffc107",
                border: "none",
                color: "#000",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
