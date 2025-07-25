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

dayjs.extend(relativeTime);
dayjs.locale("es");

const ProductPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Toast si se creó producto
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (sessionStorage.getItem("productoCreado") === "true") {
        toast.success("Producto creado exitosamente");
        sessionStorage.removeItem("productoCreado");
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Fetch productos
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

  // Filtrado y orden
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

  // Guardar configuraciones
  useEffect(
    () => localStorage.setItem("itemsPerPage", itemsPerPage),
    [itemsPerPage]
  );
  useEffect(() => localStorage.setItem("viewMode", viewMode), [viewMode]);
  useEffect(() => localStorage.setItem("sortField", sortField), [sortField]);
  useEffect(() => localStorage.setItem("sortOrder", sortOrder), [sortOrder]);

  // Manejo de borrado
  const handleDelete = (id) => {
    const product = products.find((p) => p._id === id);
    setProductToDelete(product);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await API.delete(`/productos/${productToDelete._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar el producto");
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Export CSV y PDF (igual que en tu código original)
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

  // Handlers inputs y estados
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

  // Color de stock
  const getStockColor = (cantidad) => {
    if (cantidad >= 10) return "text-green-600";
    if (cantidad >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  // Navegación imágenes
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

  // Productos paginados
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
      <ToastContainer />
      <main className="ml-64 p-6">
        {/* Título y botones */}
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
              onClick={handleExportPDF}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Exportar PDF
            </button>
            <button
              onClick={() => navigate("/products/add")}
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700"
            >
              Agregar nuevo producto
            </button>
          </div>
        </div>

        {/* Filtros y controles */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Buscar por nombre o descripción"
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

        {viewMode === "cards" ? (
          <ProductCards
            products={displayedProducts}
            imageIndices={imageIndices}
            setPreviewImage={setPreviewImage}
            prevImage={prevImage}
            nextImage={nextImage}
            navigate={navigate}
            handleDelete={handleDelete}
            getStockColor={getStockColor}
          />
        ) : (
          <ProductTable
            products={displayedProducts}
            imageIndices={imageIndices}
            setPreviewImage={setPreviewImage}
            prevImage={prevImage}
            nextImage={nextImage}
            navigate={navigate}
            handleDelete={handleDelete}
            getStockColor={getStockColor}
          />
        )}

        <ModalConfirm
          isOpen={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          title="Confirmar eliminación"
          message={`¿Seguro que deseas eliminar el producto "${productToDelete?.nombre}"?`}
        />
      </main>
    </div>
  );
};

export default ProductPage;
