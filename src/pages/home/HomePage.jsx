import React from "react";
import { Link } from "react-router-dom";
import EventList from "../components/EventList";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>🎉 Eventos Sociales</h1>
        <nav>
          <Link className="btn" to="/crear-evento">
            + Crear Evento
          </Link>
        </nav>
      </header>
      <main>
        <EventList />
      </main>
    </div>
  );
};

export default HomePage;
