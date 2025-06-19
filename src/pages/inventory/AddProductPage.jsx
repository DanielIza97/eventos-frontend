import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProductPage.css";
import API from "../../services/api";

const AddProductPage = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadDisponible, setCantidadDisponible] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
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
      formData.append("cantidadDisponible", Number(cantidadDisponible));
      formData.append("precioUnitario", Number(precioUnitario));
      imagenes.forEach((img) => formData.append("imagenes", img));

      await API.post("/productos", formData, {
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
          min="0"
        />
        <input
          type="number"
          placeholder="Precio unitario"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(e.target.value)}
          required
          min="0"
          step="0.01"
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
