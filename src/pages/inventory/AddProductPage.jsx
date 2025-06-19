// src/pages/inventory/AddProductPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProductPage.css";

const AddProductPage = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadDisponible, setCantidadDisponible] = useState(0);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [imagenes, setImagenes] = useState([]);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenes(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("cantidadDisponible", cantidadDisponible);
      formData.append("precioUnitario", precioUnitario);
      imagenes.forEach((img) => formData.append("imagenes", img));

      await axios.post(`${process.env.REACT_APP_API_URL}/productos`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Producto creado con éxito");
      navigate("/inventory");
    } catch (err) {
      console.error("Error al crear producto:", err);
      alert("Error al crear producto");
    }
  };

  return (
    <div className="add-product-page">
      <h2>Agregar nuevo producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Cantidad disponible"
          value={cantidadDisponible}
          onChange={(e) => setCantidadDisponible(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Precio unitario"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(e.target.value)}
          required
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit">Guardar producto</button>
      </form>
    </div>
  );
};

export default AddProductPage;
