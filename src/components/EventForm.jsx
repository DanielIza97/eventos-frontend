import { useState } from 'react';
import API from '../services/api';

export default function EventForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [images, setImages] = useState([]);

  const createEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    await API.post('/events', formData);
    alert('Evento creado');
  };

  return (
    <form onSubmit={createEvent}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input type="file" multiple onChange={e => setImages(e.target.files)} />
      <button type="submit">Crear Evento</button>
    </form>
  );
}
