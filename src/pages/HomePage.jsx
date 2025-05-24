import React from 'react';
import { Link } from 'react-router-dom';
import EventList from '../components/EventList';

const HomePage = () => {
  return (
    <div>
      <h1>Eventos Sociales</h1>
      <Link to="/crear-evento">Crear Evento</Link>
      <EventList />
    </div>
  );
};

export default HomePage;
