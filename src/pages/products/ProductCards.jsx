import React from "react";
import dayjs from "dayjs";

const ProductCards = ({
  products,
  imageIndices,
  setPreviewImage,
  prevImage,
  nextImage,
  navigate,
  handleDelete,
  getStockColor,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => {
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
                className={`mt-2 ${getStockColor(product.cantidadDisponible)}`}
              >
                <strong>Disponible:</strong> {product.cantidadDisponible}
              </p>
              <p className="text-gray-600">
                <strong>Alquiler:</strong>{" "}
                {typeof product.costoAlquiler === "number"
                  ? `$${product.costoAlquiler.toFixed(2)}`
                  : "N/A"}
              </p>
              <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                Creado: {dayjs(product.createdAt).format("D MMM YYYY, HH:mm")}
              </p>
              <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                Actualizado: {dayjs(product.updatedAt).fromNow()}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/products/edit/${product._id}`)}
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
  );
};

export default ProductCards;
