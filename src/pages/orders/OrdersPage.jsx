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

        const calendarEvents = Array.isArray(res.data)
          ? res.data.map((event) => ({
              title: event.nombreCliente || "Unnamed Order",
              start: new Date(event.fechaEvento),
              end: new Date(event.fechaEvento),
              allDay: true,
            }))
          : [];

        setEvents(calendarEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "1rem", marginLeft: "250px" }}>
        <h2>Calendario de Pedidos</h2>
        <button
          onClick={() => navigate("/crear-evento")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginBottom: "1rem",
            cursor: "pointer",
          }}
        >
          Crear nuevo pedido
        </button>

        <div style={{ height: 600 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
