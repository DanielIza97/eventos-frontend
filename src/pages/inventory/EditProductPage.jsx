import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./EditProductPage.css";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    nombre: "",
    descripcion: "",
    cantidadDisponible: 0,
    precioUnitario: 0,
    imagenes: [],
  });

  const [newImages, setNewImages] = useState([]); // nuevas imágenes a subir
  const [imagenesParaEliminar, setImagenesParaEliminar] = useState([]); // imágenes seleccionadas para borrar

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/productos/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error al cargar el producto:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const toggleEliminarImagen = (imgName) => {
    setImagenesParaEliminar((prev) =>
      prev.includes(imgName)
        ? prev.filter((img) => img !== imgName)
        : [...prev, imgName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Agregar campos de texto
      formData.append("nombre", product.nombre);
      formData.append("descripcion", product.descripcion);
      formData.append("cantidadDisponible", product.cantidadDisponible);
      formData.append("precioUnitario", product.precioUnitario);

      // Agregar nuevas imágenes
      newImages.forEach((img) => {
        formData.append("imagenes", img);
      });

      // Agregar imágenes marcadas para eliminar
      formData.append(
        "imagenesParaEliminar",
        JSON.stringify(imagenesParaEliminar)
      );

      await API.put(`/productos/${id}`, formData);

      alert("Producto actualizado correctamente");
      navigate("/inventory");
    } catch (err) {
      console.error("Error actualizando producto:", err);
      alert("Error al actualizar el producto");
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Editar Producto</h2>
      <form
        className="edit-product-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label htmlFor="nombre">Nombre:</label>
        <input
          id="nombre"
          name="nombre"
          value={product.nombre}
          onChange={handleChange}
          required
        />

        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={product.descripcion}
          onChange={handleChange}
        />

        <label htmlFor="cantidadDisponible">Cantidad Disponible:</label>
        <input
          id="cantidadDisponible"
          name="cantidadDisponible"
          type="number"
          value={product.cantidadDisponible}
          onChange={handleChange}
          min="0"
        />

        <label htmlFor="precioUnitario">Precio Unitario:</label>
        <input
          id="precioUnitario"
          name="precioUnitario"
          type="number"
          step="0.01"
          value={product.precioUnitario}
          onChange={handleChange}
          min="0"
        />

        <label>Imágenes actuales:</label>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          {product.imagenes &&
            product.imagenes.map((img, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img
                  src={`${process.env.REACT_APP_UPLOADS_URL}/${img}`}
                  alt={`Imagen ${i + 1}`}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 5,
                    opacity: imagenesParaEliminar.includes(img) ? 0.5 : 1,
                  }}
                />
                <button
                  type="button"
                  onClick={() => toggleEliminarImagen(img)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: imagenesParaEliminar.includes(img)
                      ? "green"
                      : "red",
                    color: "white",
                    border: "none",
                    borderRadius: "0 5px 0 5px",
                    cursor: "pointer",
                    width: 20,
                    height: 20,
                  }}
                  title={
                    imagenesParaEliminar.includes(img)
                      ? "Deshacer eliminación"
                      : "Eliminar imagen"
                  }
                >
                  X
                </button>
              </div>
            ))}
        </div>

        <label htmlFor="imagenes">Subir nuevas imágenes (opcional):</label>
        <input
          id="imagenes"
          name="imagenes"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        <button type="submit" className="btn-submit">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
