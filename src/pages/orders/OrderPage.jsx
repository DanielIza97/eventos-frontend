import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useNavigate } from "react-router-dom";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import API from "../../services/api";
import Sidebar from "../../components/common/Sidebar";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const OrdersPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await API.get("/eventos/listar");

        // Aseguramos que la data sea un arreglo
        if (!Array.isArray(res.data)) {
          console.error("La respuesta no es un arreglo:", res.data);
          setEvents([]);
          return;
        }

        // Mapear eventos para el calendario, validando fechas válidas
        const calendarEvents = res.data
          .filter((event) => event.fechaEvento) // filtramos sin fecha
          .map((event) => {
            const startDate = new Date(event.fechaEvento);
            return {
              id: event._id,
              title: event.nombreCliente || "Pedido sin nombre",
              start: isNaN(startDate.getTime()) ? new Date() : startDate,
              end: isNaN(startDate.getTime()) ? new Date() : startDate,
              allDay: true,
            };
          });

        setEvents(calendarEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 ml-64">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Calendario de Pedidos
          </h2>
          <button
            onClick={() => navigate("/orders/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Crear nuevo pedido
          </button>
        </div>

        <div className="h-[600px] bg-white rounded-lg shadow-md p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            onSelectEvent={(event) => navigate(`/editar-evento/${event.id}`)}
          />
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
