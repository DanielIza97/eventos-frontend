import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Sidebar from "../../components/common/Sidebar";

const AddProductPage = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadDisponible, setCantidadDisponible] = useState("");
  const [costoCompra, setCostoCompra] = useState("");
  const [costoAlquiler, setCostoAlquiler] = useState("");
  const [imagenes, setImagenes] = useState([]);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Agrega nuevas imágenes al estado
    setImagenes((prev) => [...prev, ...files]);
  };

  // Eliminar imagen seleccionada
  const eliminarImagen = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("cantidadDisponible", Number(cantidadDisponible));
      formData.append("costoCompra", Number(costoCompra));
      formData.append("costoAlquiler", Number(costoAlquiler));
      imagenes.forEach((img) => formData.append("imagenes", img));

      await API.post("/productos", formData);

      alert("Producto creado con éxito");
      navigate("/products");
    } catch (err) {
      console.error("Error al crear producto:", err);
      alert("Error al crear producto");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 ml-64 p-6">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            Agregar nuevo producto
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <div className="grid grid-cols-2 gap-6">
              <input
                type="number"
                placeholder="Cantidad disponible"
                value={cantidadDisponible}
                onChange={(e) => setCantidadDisponible(e.target.value)}
                required
                min="0"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Costo de compra"
                value={costoCompra}
                onChange={(e) => setCostoCompra(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Costo de alquiler"
                value={costoAlquiler}
                onChange={(e) => setCostoAlquiler(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-gray-700"
              />
            </div>

            {imagenes.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {imagenes.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 bg-gray-100 rounded-md border overflow-hidden">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarImagen(idx)}
                      title="Eliminar imagen"
                      className="absolute top-0 right-0 w-6 h-6 bg-red-600 text-white rounded-tr-md rounded-bl-md flex items-center justify-center text-sm font-bold hover:opacity-80 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-md transition-colors"
            >
              Guardar producto
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProductPage;
