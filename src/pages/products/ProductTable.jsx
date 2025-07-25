import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

dayjs.extend(relativeTime);
dayjs.locale("es");

const ProductTable = ({
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
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="border px-3 py-2"></th>
            <th className="border px-4 py-2 text-left">Imagen</th>
            <th className="border px-4 py-2 text-left">Nombre</th>
            <th className="border px-4 py-2 text-left">Descripción</th>
            <th className="border px-4 py-2 text-left">Cantidad</th>
            <th className="border px-4 py-2 text-left">Alquiler</th>
            <th className="border px-4 py-2 text-left">Creado</th>
            <th className="border px-4 py-2 text-left">Actualizado</th>
            <th className="border px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const images = product.imagenes || [];
            const currentImageIndex = imageIndices[product._id] || 0;
            const isSelected = selectedProducts.includes(product._id);

            return (
              <tr
                key={product._id}
                className={`hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""}`}
              >
                <td className="border px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCheckboxChange(product._id)}
                    className="cursor-pointer w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    aria-label={`Seleccionar producto ${product.nombre}`}
                  />
                </td>
                <td className="border px-4 py-2">
                  {images.length > 0 && (
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <img
                        src={`${process.env.REACT_APP_UPLOADS_URL}${images[currentImageIndex]}`}
                        alt={`Imagen de ${product.nombre}`}
                        className="w-16 h-16 object-contain cursor-pointer rounded-md"
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
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-1 hover:bg-opacity-60 transition"
                            aria-label="Imagen anterior"
                          >
                            &#8249;
                          </button>
                          <button
                            onClick={nextImage(product._id, images.length)}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-1 hover:bg-opacity-60 transition"
                            aria-label="Imagen siguiente"
                          >
                            &#8250;
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>
                <td className="border px-4 py-2 font-semibold">
                  {product.nombre}
                </td>
                <td
                  className="border px-4 py-2 max-w-xs truncate"
                  title={product.descripcion}
                >
                  {product.descripcion}
                </td>
                <td
                  className={`border px-4 py-2 font-medium ${getStockColor(
                    product.cantidadDisponible
                  )}`}
                >
                  {product.cantidadDisponible}
                </td>
                <td className="border px-4 py-2 font-medium">
                  {typeof product.costoAlquiler === "number"
                    ? `$${product.costoAlquiler.toFixed(2)}`
                    : "N/A"}
                </td>
                <td className="border px-4 py-2 text-gray-600 text-xs">
                  {dayjs(product.createdAt).format("D MMM YYYY, HH:mm")}
                </td>
                <td className="border px-4 py-2 text-gray-600 text-xs">
                  {dayjs(product.updatedAt).fromNow()}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => navigate(`/products/edit/${product._id}`)}
                    className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500 transition w-full"
                    aria-label={`Ver producto ${product.nombre}`}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
