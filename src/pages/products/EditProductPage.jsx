import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import Sidebar from "../../components/common/Sidebar";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    nombre: "",
    descripcion: "",
    cantidadDisponible: 0,
    costoCompra: 0,
    costoAlquiler: 0,
    imagenes: [],
  });

  const [newImages, setNewImages] = useState([]);
  const [imagenesParaEliminar, setImagenesParaEliminar] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/productos/${id}`);
        setProduct({
          ...res.data,
          cantidadDisponible: Number(res.data.cantidadDisponible) || 0,
          costoCompra: Number(res.data.costoCompra) || 0,
          costoAlquiler: Number(res.data.costoAlquiler) || 0,
          imagenes: res.data.imagenes || [],
        });
      } catch (err) {
        console.error("Error al cargar el producto:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "cantidadDisponible" ||
      name === "costoCompra" ||
      name === "costoAlquiler"
    ) {
      setProduct({ ...product, [name]: Number(value) });
    } else {
      setProduct({ ...product, [name]: value });
    }
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

      formData.append("nombre", product.nombre);
      formData.append("descripcion", product.descripcion);
      formData.append("cantidadDisponible", product.cantidadDisponible);
      formData.append("costoCompra", product.costoCompra);
      formData.append("costoAlquiler", product.costoAlquiler);

      newImages.forEach((img) => {
        formData.append("imagenes", img);
      });

      formData.append(
        "imagenesParaEliminar",
        JSON.stringify(imagenesParaEliminar)
      );

      await API.put(`/productos/${id}`, formData);

      alert("Producto actualizado correctamente");
      navigate("/products");
    } catch (err) {
      console.error("Error actualizando producto:", err);
      alert("Error al actualizar el producto");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-4xl mx-auto bg-white rounded-md shadow-md p-6">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            Editar Producto
          </h2>

          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-6"
          >
            {/* Campos de texto */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-gray-700 font-medium mb-1"
              >
                Nombre:
              </label>
              <input
                id="nombre"
                name="nombre"
                value={product.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="descripcion"
                className="block text-gray-700 font-medium mb-1"
              >
                Descripción:
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={product.descripcion}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="cantidadDisponible"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Cantidad Disponible:
                </label>
                <input
                  id="cantidadDisponible"
                  name="cantidadDisponible"
                  type="number"
                  value={product.cantidadDisponible}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="costoCompra"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Costo de Compra:
                </label>
                <input
                  id="costoCompra"
                  name="costoCompra"
                  type="number"
                  step="0.01"
                  value={product.costoCompra}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="costoAlquiler"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Costo de Alquiler:
                </label>
                <input
                  id="costoAlquiler"
                  name="costoAlquiler"
                  type="number"
                  step="0.01"
                  value={product.costoAlquiler}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Imágenes actuales */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Imágenes actuales:
              </label>
              <div className="flex flex-wrap gap-4 mb-4">
                {product.imagenes &&
                  product.imagenes.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={`${process.env.REACT_APP_API_URL.replace(
                          "/api",
                          ""
                        )}/${img}`}
                        alt={`Imagen ${i + 1}`}
                        className={`w-24 h-24 object-contain rounded-md border bg-gray-100 ${
                          imagenesParaEliminar.includes(img)
                            ? "opacity-50"
                            : "opacity-100"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleEliminarImagen(img)}
                        title={
                          imagenesParaEliminar.includes(img)
                            ? "Deshacer eliminación"
                            : "Eliminar imagen"
                        }
                        className={`absolute top-0 right-0 w-6 h-6 rounded-tr-md rounded-bl-md flex items-center justify-center text-white text-sm font-bold ${
                          imagenesParaEliminar.includes(img)
                            ? "bg-green-600"
                            : "bg-red-600"
                        } hover:opacity-80 transition-opacity`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Subir nuevas imágenes */}
            <div>
              <label
                htmlFor="imagenes"
                className="block text-gray-700 font-medium mb-1"
              >
                Subir nuevas imágenes (opcional):
              </label>
              <input
                id="imagenes"
                name="imagenes"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-gray-700"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition-colors"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProductPage;
