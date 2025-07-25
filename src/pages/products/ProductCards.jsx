import React from "react";
import dayjs from "dayjs";

const ProductCards = ({
  products,
  imageIndices,
  setPreviewImage,
  prevImage,
  nextImage,
  navigate,
  getStockColor,
  selectedProducts,
  handleCheckboxChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const images = product.imagenes || [];
        const currentImageIndex = imageIndices[product._id] || 0;

        return (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col max-w-xs hover:shadow-lg transition-shadow duration-300"
          >
            {/* Checkbox de selección múltiple */}
            <div className="p-3 flex justify-end">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={() => handleCheckboxChange(product._id)}
                  className="sr-only"
                  aria-label={`Seleccionar producto ${product.nombre}`}
                />
                <div
                  className="w-6 h-6 bg-gray-200 rounded-md border border-gray-300 flex items-center justify-center
                  transition-colors duration-200
                  hover:bg-blue-100
                  focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1
                  "
                >
                  {selectedProducts.includes(product._id) && (
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </label>
            </div>

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
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition"
                      aria-label="Imagen anterior"
                    >
                      &#8249;
                    </button>
                    <button
                      onClick={nextImage(product._id, images.length)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition"
                      aria-label="Imagen siguiente"
                    >
                      &#8250;
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="p-4 flex flex-col flex-grow">
              <h3
                className="text-lg font-semibold text-gray-900 mb-2 truncate"
                title={product.nombre}
              >
                {product.nombre}
              </h3>
              <p
                className="text-gray-700 text-sm flex-grow mb-3 line-clamp-3"
                title={product.descripcion}
              >
                {product.descripcion}
              </p>
              <p
                className={`mt-1 ${getStockColor(product.cantidadDisponible)}`}
              >
                <strong>Disponible:</strong> {product.cantidadDisponible}
              </p>
              <p className="text-gray-600">
                <strong>Alquiler:</strong>{" "}
                {typeof product.costoAlquiler === "number"
                  ? `$${product.costoAlquiler.toFixed(2)}`
                  : "N/A"}
              </p>

              <div className="mt-4 text-gray-500 text-xs space-y-1">
                <div className="flex items-center gap-1">
                  <span>
                    Creado:{" "}
                    <time
                      dateTime={product.createdAt}
                      title={dayjs(product.createdAt).format("LLLL")}
                      className="underline"
                    >
                      {dayjs(product.createdAt).format("D MMM YYYY, HH:mm")}
                    </time>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>
                    Actualizado:{" "}
                    <time
                      dateTime={product.updatedAt}
                      title={dayjs(product.updatedAt).format("LLLL")}
                      className="underline"
                    >
                      {dayjs(product.updatedAt).fromNow()}
                    </time>
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => navigate(`/products/edit/${product._id}`)}
                  className="bg-yellow-400 text-black py-2 rounded-md hover:bg-yellow-500 transition w-full"
                  aria-label={`Ver producto ${product.nombre}`}
                >
                  Ver
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCards;
