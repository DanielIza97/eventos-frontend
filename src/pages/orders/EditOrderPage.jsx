import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import Sidebar from "../../components/common/Sidebar";

const EditOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState({
    nombreCliente: "",
    tipoEvento: "pedido",
    fechaEvento: "",
    lugar: "",
    estado: "pendiente",
    observaciones: "",
    productos: [],
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/eventos/${id}`);
        const data = res.data;
        setOrder({
          nombreCliente: data.nombreCliente || "",
          tipoEvento: data.tipoEvento || "pedido",
          fechaEvento: data.fechaEvento?.substring(0, 10) || "",
          lugar: data.lugar || "",
          estado: data.estado || "pendiente",
          observaciones: data.observaciones || "",
          productos: data.productos || [],
        });
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener el evento:", err);
        alert("No se pudo cargar el pedido");
        navigate("/orders");
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear objeto sólo con los campos que quieres enviar al backend para evitar errores
    const dataToUpdate = {
      nombreCliente: order.nombreCliente,
      tipoEvento: order.tipoEvento,
      fechaEvento: order.fechaEvento,
      lugar: order.lugar,
      estado: order.estado,
      observaciones: order.observaciones,
    };

    try {
      await API.put(`/eventos/actualizar/${id}`, dataToUpdate);
      alert("Pedido actualizado correctamente");
      navigate("/orders");
    } catch (err) {
      console.error("Error al actualizar el pedido:", err);
      alert("Error al actualizar el pedido");
    }
  };

  if (loading) return <p className="p-6">Cargando pedido...</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-6">Editar Pedido</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Nombre del Cliente</label>
              <input
                type="text"
                name="nombreCliente"
                value={order.nombreCliente}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Tipo de Evento</label>
              <select
                name="tipoEvento"
                value={order.tipoEvento}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="pedido">Pedido</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Fecha del Evento</label>
              <input
                type="date"
                name="fechaEvento"
                value={order.fechaEvento}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Lugar</label>
              <input
                type="text"
                name="lugar"
                value={order.lugar}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Estado</label>
              <select
                name="estado"
                value={order.estado}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              >
                <option value="pendiente">Pendiente</option>
                <option value="organizando">Organizando</option>
                <option value="completo">Completo</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Observaciones</label>
              <textarea
                name="observaciones"
                value={order.observaciones || ""}
                onChange={handleChange}
                rows={3}
                className="w-full border px-4 py-2 rounded resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditOrderPage;
