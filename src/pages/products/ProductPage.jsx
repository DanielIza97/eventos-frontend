import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import ModalConfirm from "../../components/common/ModalConfirm";
import ProductCards from "./ProductCards";
import ProductTable from "./ProductTable";
import "react-toastify/dist/ReactToastify.css";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

import {
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiFileText,
  FiFile,
  FiChevronDown,
} from "react-icons/fi";

dayjs.extend(relativeTime);
dayjs.locale("es");

const ProductPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const stored = localStorage.getItem("currentPage");
    return stored ? Number(stored) : 1;
  });
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("viewMode") || "cards"
  );
  const [sortField, setSortField] = useState(
    () => localStorage.getItem("sortField") || "nombre"
  );
  const [sortOrder, setSortOrder] = useState(
    () => localStorage.getItem("sortOrder") || "asc"
  );
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const stored = localStorage.getItem("itemsPerPage");
    return stored === "all" ? "all" : Number(stored) || 10;
  });
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageIndices, setImageIndices] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Estado para mostrar/ocultar el menú desplegable exportar
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (sessionStorage.getItem("productoCreado") === "true") {
        toast.success("Producto creado exitosamente");
        sessionStorage.removeItem("productoCreado");
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/productos");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(
      (product) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aField = (a[sortField] || "").toString().toLowerCase();
      const bField = (b[sortField] || "").toString().toLowerCase();
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
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [currentPage, totalPages]);

  useEffect(
    () => localStorage.setItem("itemsPerPage", itemsPerPage),
    [itemsPerPage]
  );
  useEffect(() => localStorage.setItem("viewMode", viewMode), [viewMode]);
  useEffect(() => localStorage.setItem("sortField", sortField), [sortField]);
  useEffect(() => localStorage.setItem("sortOrder", sortOrder), [sortOrder]);

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) {
      toast.info("No hay productos seleccionados para eliminar");
      return;
    }
    setProductToDelete(null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (productToDelete) {
        await API.delete(`/productos/${productToDelete._id}`);
        setProducts((prev) =>
          prev.filter((p) => p._id !== productToDelete._id)
        );
        toast.success("Producto eliminado correctamente");
      } else if (selectedProducts.length > 0) {
        await Promise.all(
          selectedProducts.map((id) => API.delete(`/productos/${id}`))
        );
        setProducts((prev) =>
          prev.filter((p) => !selectedProducts.includes(p._id))
        );
        toast.success("Productos eliminados correctamente");
        setSelectedProducts([]);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar producto(s)");
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
    setSelectedProducts([]);
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Nombre", "Descripción", "Cantidad", "Costo Alquiler"]],
      body: filteredProducts.map((p) => [
        p.nombre,
        p.descripcion,
        p.cantidadDisponible.toString(),
        typeof p.costoAlquiler === "number"
          ? `$${p.costoAlquiler.toFixed(2)}`
          : "N/A",
      ]),
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.text("Inventario de Productos", 14, 15);
    doc.save("inventario.pdf");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handleItemsPerPageChange = (e) => {
    const value = e.target.value === "all" ? "all" : Number(e.target.value);
    if (value === "all" || [10, 25, 100].includes(value)) {
      setItemsPerPage(value);
      setCurrentPage(1);
    }
  };
  const handleViewModeChange = (e) => setViewMode(e.target.value);
  const handleSortFieldChange = (e) => setSortField(e.target.value);
  const handleSortOrderToggle = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const getStockColor = (cantidad) => {
    if (cantidad >= 10) return "text-green-600 font-semibold";
    if (cantidad >= 5) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  };

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
  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const displayedProducts =
    itemsPerPage === "all"
      ? filteredProducts
      : filteredProducts.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700 animate-pulse">
          Cargando productos...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <main className="ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Inventario de Productos
          </h1>
          <div className="flex flex-wrap gap-3 relative">
            {/* Botón Exportar con menú desplegable */}
            <div className="relative inline-block text-left">
              <button
                onClick={() => setExportMenuOpen((open) => !open)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 transition"
                aria-haspopup="true"
                aria-expanded={exportMenuOpen}
                aria-label="Exportar inventario"
              >
                <FiFileText size={20} />
                Exportar
                <FiChevronDown />
              </button>

              {exportMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="export-menu"
                >
                  <button
                    onClick={() => {
                      handleExportCSV();
                      setExportMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Exportar CSV
                  </button>
                  <button
                    onClick={() => {
                      handleExportPDF();
                      setExportMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Exportar PDF
                  </button>
                </div>
              )}
            </div>

            {/* Botones adicionales */}
            <button
              onClick={() => navigate("/products/add")}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-md shadow hover:bg-green-700 transition"
              aria-label="Agregar nuevo producto"
            >
              Agregar nuevo producto
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={selectedProducts.length === 0}
              className="flex items-center gap-2 bg-red-500 disabled:opacity-50 text-white px-5 py-2 rounded-md shadow hover:bg-red-600 disabled:hover:bg-red-500 transition"
              aria-label="Eliminar productos seleccionados"
            >
              <FiTrash2 size={20} /> Eliminar seleccionados (
              {selectedProducts.length})
            </button>
          </div>
        </div>

        {/* Filtros y opciones */}
        <div className="flex flex-wrap items-center gap-4 mb-8 bg-white p-4 rounded-md shadow">
          <input
            type="search"
            placeholder="Buscar por nombre o descripción"
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-grow min-w-[220px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            aria-label="Buscar productos"
          />
          <label className="flex items-center gap-2 whitespace-nowrap">
            Mostrar:
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="Cantidad de productos por página"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={100}>100</option>
              <option value="all">Todos</option>
            </select>
          </label>
          <label className="flex items-center gap-2 whitespace-nowrap">
            Ordenar por:
            <select
              value={sortField}
              onChange={handleSortFieldChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="Campo para ordenar productos"
            >
              <option value="nombre">Nombre</option>
              <option value="descripcion">Descripción</option>
            </select>
          </label>
          <button
            onClick={handleSortOrderToggle}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-100 transition"
            aria-label={`Ordenar de forma ${
              sortOrder === "asc" ? "ascendente" : "descendente"
            }`}
          >
            {sortOrder === "asc" ? "Ascendente ⬆️" : "Descendente ⬇️"}
          </button>
          <label className="flex items-center gap-2 whitespace-nowrap">
            Vista:
            <select
              value={viewMode}
              onChange={handleViewModeChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="Modo de vista de productos"
            >
              <option value="cards">Tarjetas</option>
              <option value="table">Tabla</option>
            </select>
          </label>
        </div>

        <p className="mb-4 text-gray-600 font-medium">
          Total de productos:{" "}
          <span className="font-semibold">{products.length}</span>
        </p>

        {previewImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer"
            onClick={() => setPreviewImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Vista ampliada de la imagen"
          >
            <img
              src={previewImage}
              alt="Vista ampliada"
              className="max-w-full max-h-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Vista productos */}
        {viewMode === "cards" ? (
          <ProductCards
            products={displayedProducts}
            imageIndices={imageIndices}
            setPreviewImage={setPreviewImage}
            prevImage={prevImage}
            nextImage={nextImage}
            navigate={navigate}
            getStockColor={getStockColor}
            selectedProducts={selectedProducts}
            handleCheckboxChange={handleCheckboxChange}
          />
        ) : (
          <ProductTable
            products={displayedProducts}
            imageIndices={imageIndices}
            setPreviewImage={setPreviewImage}
            prevImage={prevImage}
            nextImage={nextImage}
            navigate={navigate}
            getStockColor={getStockColor}
            selectedProducts={selectedProducts}
            handleCheckboxChange={handleCheckboxChange}
          />
        )}

        {/* Paginación */}
        {itemsPerPage !== "all" && totalPages > 1 && (
          <nav
            className="flex justify-center mt-8 gap-2 flex-wrap"
            aria-label="Paginación de productos"
          >
            <button
              onClick={() =>
                setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
              }
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 transition"
              aria-label="Página anterior"
            >
              <FiChevronLeft />
              Anterior
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-white"
                }`}
                aria-current={currentPage === i + 1 ? "page" : undefined}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 transition"
              aria-label="Página siguiente"
            >
              Siguiente
              <FiChevronRight />
            </button>
          </nav>
        )}

        <ModalConfirm
          isOpen={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          title="Confirmar eliminación"
          message={
            productToDelete
              ? `¿Seguro que deseas eliminar el producto "${productToDelete.nombre}"?`
              : `¿Seguro que deseas eliminar los ${selectedProducts.length} productos seleccionados?`
          }
        />
      </main>
    </div>
  );
};

export default ProductPage;
