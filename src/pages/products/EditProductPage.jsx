import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
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

  const [originalProduct, setOriginalProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [imagenesParaEliminar, setImagenesParaEliminar] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/productos/${id}`);
        const fetchedProduct = {
          ...res.data,
          cantidadDisponible: Number(res.data.cantidadDisponible) || 0,
          costoCompra: Number(res.data.costoCompra) || 0,
          costoAlquiler: Number(res.data.costoAlquiler) || 0,
          imagenes: res.data.imagenes || [],
        };
        setProduct(fetchedProduct);
        setOriginalProduct(fetchedProduct);
      } catch (err) {
        toast.error("Error al cargar el producto");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = [
      "cantidadDisponible",
      "costoCompra",
      "costoAlquiler",
    ].includes(name)
      ? Number(value)
      : value;
    setProduct({ ...product, [name]: updatedValue });
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

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = window.confirm(
      "¿Estás seguro de que deseas guardar los cambios?"
    );
    if (!confirm) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("nombre", product.nombre);
      formData.append("descripcion", product.descripcion);
      formData.append("cantidadDisponible", product.cantidadDisponible);
      formData.append("costoCompra", product.costoCompra);
      formData.append("costoAlquiler", product.costoAlquiler);
      newImages.forEach((img) => formData.append("imagenes", img));
      formData.append(
        "imagenesParaEliminar",
        JSON.stringify(imagenesParaEliminar)
      );

      const res = await API.put(`/productos/${id}`, formData);

      const updated = {
        ...res.data,
        cantidadDisponible: Number(res.data.cantidadDisponible),
        costoCompra: Number(res.data.costoCompra),
        costoAlquiler: Number(res.data.costoAlquiler),
        imagenes: res.data.imagenes || [],
      };

      setProduct(updated);
      setOriginalProduct(updated);
      setNewImages([]);
      setImagenesParaEliminar([]);
      setEditMode(false);

      toast.success("Producto actualizado correctamente");
    } catch (err) {
      toast.error("Error al actualizar el producto");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setProduct(originalProduct);
    setNewImages([]);
    setImagenesParaEliminar([]);
    setEditMode(false);
    toast.info("Edición cancelada");
  };

  const isProductModified = () => {
    if (!originalProduct) return false;
    const campos = [
      "nombre",
      "descripcion",
      "cantidadDisponible",
      "costoCompra",
      "costoAlquiler",
    ];
    for (let campo of campos) {
      if (product[campo] !== originalProduct[campo]) return true;
    }
    return newImages.length > 0 || imagenesParaEliminar.length > 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-700">Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 ml-64">
        <ToastContainer />
        <div className="max-w-4xl mx-auto bg-white rounded-md shadow-md p-6">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Editar Producto
          </h2>

          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-700">Nombre:</label>
              <input
                name="nombre"
                value={product.nombre}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Descripción:</label>
              <textarea
                name="descripcion"
                value={product.descripcion}
                onChange={handleChange}
                rows={3}
                disabled={!editMode}
                className="w-full border px-4 py-2 rounded resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {["cantidadDisponible", "costoCompra", "costoAlquiler"].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-gray-700">
                      {field === "cantidadDisponible"
                        ? "Cantidad Disponible"
                        : field === "costoCompra"
                        ? "Costo de Compra"
                        : "Costo de Alquiler"}
                    </label>
                    <input
                      name={field}
                      type="number"
                      value={product[field]}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full border px-4 py-2 rounded"
                    />
                  </div>
                )
              )}
            </div>

            {/* Imágenes actuales */}
            <div>
              <label className="block text-gray-700">Imágenes actuales:</label>
              <div className="flex flex-wrap gap-3">
                {product.imagenes.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={`${process.env.REACT_APP_UPLOADS_URL}${img}`}
                      alt={`Imagen ${i + 1}`}
                      className={`w-24 h-24 object-contain border rounded ${
                        imagenesParaEliminar.includes(img)
                          ? "opacity-50"
                          : "opacity-100"
                      }`}
                    />
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => toggleEliminarImagen(img)}
                        className={`absolute top-0 right-0 w-5 h-5 text-xs font-bold text-white rounded-tr-md rounded-bl-md flex items-center justify-center ${
                          imagenesParaEliminar.includes(img)
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Nuevas imágenes */}
            {editMode && (
              <>
                {newImages.length > 0 && (
                  <div>
                    <label className="block text-gray-700">
                      Nuevas imágenes:
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {newImages.map((img, i) => (
                        <div key={i} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt="preview"
                            className="w-24 h-24 object-contain border rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-tr-md rounded-bl-md"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-700">
                    Subir nuevas imágenes:
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={!editMode}
                  />
                </div>
              </>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              {editMode ? (
                <>
                  {isProductModified() && (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded"
                >
                  Editar
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-slate-200 text-gray-800 px-4 py-2 rounded hover:bg-slate-300"
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProductPage;
