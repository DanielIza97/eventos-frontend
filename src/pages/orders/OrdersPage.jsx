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
  const [calendarView, setCalendarView] = useState("week");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await API.get("/eventos/listar");

        if (!Array.isArray(res.data)) {
          console.error("La respuesta no es un arreglo:", res.data);
          setEvents([]);
          return;
        }

        const calendarEvents = res.data
          .filter((event) => event.fechaEvento)
          .map((event) => {
            const startDate = new Date(event.fechaEvento);
            const endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + 1); // duración de 1 hora

            const hora = startDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return {
              id: event._id,
              title: `${hora} - ${event.nombreCliente || "Pedido sin nombre"}`,
              start: startDate,
              end: endDate,
              allDay: false,
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
            onClick={() => navigate("/crear-evento")}
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
            views={["month", "week", "day"]}
            view={calendarView} // ← vista actual
            onView={(view) => setCalendarView(view)} // ← actualizar vista
            defaultView="month"
            tooltipAccessor={(event) =>
              `Cliente: ${event.title}\nHora: ${new Date(event.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            }
            onSelectEvent={(event) => navigate(`/editar-evento/${event.id}`)}
          />
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
