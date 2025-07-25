import React from "react";

const ProductTable = ({
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
        {products.map((product) => {
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
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProductTable;
