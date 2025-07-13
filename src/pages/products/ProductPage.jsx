import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Sidebar from "../../components/common/Sidebar";

const ProductPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/productos");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = products.filter(
      (product) =>
        product.nombre.toLowerCase().includes(value) ||
        (product.descripcion && product.descripcion.toLowerCase().includes(value))
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    const value = e.target.value;
    if (value === "all") {
      setItemsPerPage(filteredProducts.length); // Mostrar todos
    } else {
      setItemsPerPage(Number(value));
    }
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = itemsPerPage === filteredProducts.length ? 1 : Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Inventario</h2>
          <button
            onClick={() => navigate("/products/add")}
            className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-colors"
          >
            Agregar nuevo producto
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar producto por nombre o descripción..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-md w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={itemsPerPage === filteredProducts.length ? "all" : itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="px-4 py-2 border rounded-md w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                Mostrar {num}
              </option>
            ))}
            <option value="all">Mostrar todos</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No hay productos que coincidan con la búsqueda.
            </p>
          ) : (
            currentProducts.map((product) => {
              const imgPath =
                product.imagenes?.[0] && typeof product.imagenes[0] === "string"
                  ? product.imagenes[0].replace(/^uploads\//, "")
                  : null;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col max-w-xs"
                >
                  {imgPath && (
                    <div className="w-full h-40 overflow-hidden rounded-t-lg bg-gray-200 flex items-center justify-center">
                      <img
                        src={`${process.env.REACT_APP_UPLOADS_URL}${product.imagenes[0]}`}
                        alt={product.nombre}
                        className="max-w-full max-h-full object-contain"
                        style={{ maxHeight: "160px", maxWidth: "100%" }}
                      />
                    </div>
                  )}

                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.nombre}</h3>
                    <p className="text-gray-700 flex-grow">{product.descripcion}</p>
                    <p className="mt-2 text-gray-600">
                      <strong>Disponible:</strong> {product.cantidadDisponible}
                    </p>
                    <p className="text-gray-600">
                      <strong>Costo alquiler:</strong>{" "}
                      {typeof product.costoAlquiler === "number"
                        ? `$${product.costoAlquiler.toFixed(2)}`
                        : "N/A"}
                    </p>
                    <button
                      onClick={() => navigate(`/products/edit/${product._id}`)}
                      className="mt-4 bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 transition-colors"
                    >
                      Ver
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Anterior
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === pageNum
                      ? "bg-blue-800 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
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
