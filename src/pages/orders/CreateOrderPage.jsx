import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import API from "../../services/api";

const CreateOrderPage = () => {
  const navigate = useNavigate();

  const [nombreCliente, setNombreCliente] = useState("");
  const [fechaEvento, setFechaEvento] = useState("");
  const [lugar, setLugar] = useState("");
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [items, setItems] = useState([{ productoId: "", cantidad: 1 }]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await API.get("/productos");
        setProductosDisponibles(res.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };

    fetchProductos();
  }, []);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { productoId: "", cantidad: 1 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombreCliente,
        fechaEvento,
        lugar,
        productos: items.map((item) => ({
          productoId: item.productoId,
          cantidad: Number(item.cantidad),
        })),
      };

      await API.post("/eventos/crear", payload);
      alert("Orden creada con éxito");
      navigate("/orders");
    } catch (err) {
      console.error("Error al crear la orden:", err);
      alert("Error al crear la orden. Verifica los datos o permisos.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-md shadow-md p-6">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            Crear Nueva Orden
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nombre del Cliente:
              </label>
              <input
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Fecha del Evento:
              </label>
              <input
                type="date"
                value={fechaEvento}
                onChange={(e) => setFechaEvento(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Lugar:
              </label>
              <input
                type="text"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Productos:
              </label>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-center mb-4"
                >
                  <select
                    value={item.productoId}
                    onChange={(e) =>
                      handleItemChange(index, "productoId", e.target.value)
                    }
                    required
                    className="col-span-7 px-4 py-2 border rounded-md"
                  >
                    <option value="">Seleccione un producto</option>
                    {productosDisponibles.map((prod) => (
                      <option key={prod._id} value={prod._id}>
                        {prod.nombre}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) =>
                      handleItemChange(index, "cantidad", e.target.value)
                    }
                    required
                    className="col-span-3 px-4 py-2 border rounded-md"
                  />

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="col-span-2 text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addItem}
                className="mt-2 text-blue-600 hover:underline"
              >
                + Agregar otro producto
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-md"
            >
              Guardar Orden
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateOrderPage;
