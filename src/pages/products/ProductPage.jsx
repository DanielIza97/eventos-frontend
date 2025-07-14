import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Sidebar from "../../components/common/Sidebar";

const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("cards");
  const [sortField, setSortField] = useState("nombre");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  // Estado para almacenar índice de imagen actual por producto
  const [imageIndices, setImageIndices] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/productos");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await API.delete(`/productos/${id}`);
        setProducts(products.filter((p) => p._id !== id));
        alert("Producto eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar el producto");
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ["Nombre", "Descripción", "Cantidad", "Costo Alquiler"];
    const rows = filteredProducts.map((p) => [
      p.nombre,
      p.descripcion,
      p.cantidadDisponible,
      p.costoAlquiler,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((col) => `"${col}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventario.csv";
    a.click();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    const value = e.target.value === "all" ? "all" : Number(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleViewModeChange = (e) => {
    setViewMode(e.target.value);
  };

  const handleSortFieldChange = (e) => {
    setSortField(e.target.value);
  };

  const handleSortOrderToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getStockColor = (cantidad) => {
    if (cantidad >= 10) return "text-green-600";
    if (cantidad >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  // Funciones para cambiar imagen de un producto
  const prevImage = (productId, imagesLength) => (e) => {
    e.stopPropagation();
    setImageIndices((prev) => {
      const currentIndex = prev[productId] || 0;
      const newIndex = currentIndex === 0 ? imagesLength - 1 : currentIndex - 1;
      return { ...prev, [productId]: newIndex };
    });
  };

  const nextImage = (productId, imagesLength) => (e) => {
    e.stopPropagation();
    setImageIndices((prev) => {
      const currentIndex = prev[productId] || 0;
      const newIndex = currentIndex === imagesLength - 1 ? 0 : currentIndex + 1;
      return { ...prev, [productId]: newIndex };
    });
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aField = a[sortField]?.toLowerCase() || "";
      const bField = b[sortField]?.toLowerCase() || "";

      return sortOrder === "asc"
        ? aField.localeCompare(bField)
        : bField.localeCompare(aField);
    });

    return filtered;
  }, [products, searchTerm, sortField, sortOrder]);

  const totalPages =
    itemsPerPage === "all"
      ? 1
      : Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [currentPage, totalPages]);

  const displayedProducts =
    itemsPerPage === "all"
      ? filteredProducts
      : filteredProducts.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-700">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Inventario</h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Exportar CSV
            </button>
            <button
              onClick={() => navigate("/products/add")}
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700"
            >
              Agregar nuevo producto
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-72 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="flex items-center gap-2">
            Mostrar:
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded-md px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={100}>100</option>
              <option value="all">Todos</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            Ordenar por:
            <select
              value={sortField}
              onChange={handleSortFieldChange}
              className="border rounded-md px-2 py-1"
            >
              <option value="nombre">Nombre</option>
              <option value="descripcion">Descripción</option>
            </select>
          </label>

          <button
            onClick={handleSortOrderToggle}
            className="px-3 py-1 border rounded bg-white hover:bg-gray-100"
          >
            {sortOrder === "asc" ? "Ascendente ⬆️" : "Descendente ⬇️"}
          </button>

          <label className="flex items-center gap-2">
            Vista:
            <select
              value={viewMode}
              onChange={handleViewModeChange}
              className="border rounded-md px-2 py-1"
            >
              <option value="cards">Tarjetas</option>
              <option value="table">Tabla</option>
            </select>
          </label>
        </div>

        {/* Modal de imagen */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setPreviewImage(null)}
          >
            <img
              src={previewImage}
              alt="Ampliada"
              className="max-w-full max-h-full rounded shadow-lg"
            />
          </div>
        )}

        {/* Mostrar productos */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => {
              const images = product.imagenes || [];
              const currentImageIndex = imageIndices[product._id] || 0;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col max-w-xs"
                >
                  {images.length > 0 && (
                    <div
                      className="relative w-full h-40 overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        setPreviewImage(
                          `${process.env.REACT_APP_UPLOADS_URL}${images[currentImageIndex]}`
                        )
                      }
                    >
                      <img
                        src={`${process.env.REACT_APP_UPLOADS_URL}${images[currentImageIndex]}`}
                        alt={`Imagen de ${product.nombre}`}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain"
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage(product._id, images.length)}
                            className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                            aria-label="Imagen anterior"
                          >
                            &#8249;
                          </button>
                          <button
                            onClick={nextImage(product._id, images.length)}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                            aria-label="Imagen siguiente"
                          >
                            &#8250;
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.nombre}
                    </h3>
                    <p className="text-gray-700 text-sm flex-grow">
                      {product.descripcion}
                    </p>
                    <p
                      className={`mt-2 ${getStockColor(
                        product.cantidadDisponible
                      )}`}
                    >
                      <strong>Disponible:</strong> {product.cantidadDisponible}
                    </p>
                    <p className="text-gray-600">
                      <strong>Alquiler:</strong>{" "}
                      {typeof product.costoAlquiler === "number"
                        ? `$${product.costoAlquiler.toFixed(2)}`
                        : "N/A"}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() =>
                          navigate(`/products/edit/${product._id}`)
                        }
                        className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Imagen</th>
                <th className="border px-4 py-2 text-left">Nombre</th>
                <th className="border px-4 py-2 text-left">Descripción</th>
                <th className="border px-4 py-2 text-left">Cantidad</th>
                <th className="border px-4 py-2 text-left">Alquiler</th>
                <th className="border px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((product) => {
                const images = product.imagenes || [];
                const currentImageIndex = imageIndices[product._id] || 0;

                return (
                  <tr key={product._id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">
                      {images.length > 0 && (
                        <div className="relative w-20 h-20 flex items-center justify-center">
                          <img
                            src={`${process.env.REACT_APP_UPLOADS_URL}${images[currentImageIndex]}`}
                            alt={`Imagen de ${product.nombre}`}
                            className="w-16 h-16 object-contain cursor-pointer"
                            loading="lazy"
                            onClick={() =>
                              setPreviewImage(
                                `${process.env.REACT_APP_UPLOADS_URL}${images[currentImageIndex]}`
                              )
                            }
                          />
                          {images.length > 1 && (
                            <>
                              <button
                                onClick={prevImage(product._id, images.length)}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                                aria-label="Imagen anterior"
                              >
                                &#8249;
                              </button>
                              <button
                                onClick={nextImage(product._id, images.length)}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                                aria-label="Imagen siguiente"
                              >
                                &#8250;
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">{product.nombre}</td>
                    <td className="border px-4 py-2">{product.descripcion}</td>
                    <td
                      className={`border px-4 py-2 ${getStockColor(
                        product.cantidadDisponible
                      )}`}
                    >
                      {product.cantidadDisponible}
                    </td>
                    <td className="border px-4 py-2">
                      {typeof product.costoAlquiler === "number"
                        ? `$${product.costoAlquiler.toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/products/edit/${product._id}`)
                          }
                          className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Paginación */}
        {itemsPerPage !== "all" && totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded border ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Anterior
            </button>

            <span>
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded border ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Siguiente
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductPage;
