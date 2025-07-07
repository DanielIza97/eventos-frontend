import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Sidebar from "../../components/common/Sidebar";

const ProductPage = () => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
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
                      src={`${process.env.REACT_APP_UPLOADS_URL}/${imgPath}`}
                      alt={product.nombre}
                      className="max-w-full max-h-full object-contain"
                      style={{ maxHeight: "160px", maxWidth: "100%" }}
                    />
                  </div>
                )}

                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.nombre}
                  </h3>
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
                    Editar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
