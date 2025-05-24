import { useEffect, useState } from 'react';
import API from '../services/api';

export default function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get('/events').then(res => setEvents(res.data));
  }, []);

  return (
    <div>
      {events.map(event => (
        <div key={event._id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>{new Date(event.date).toLocaleDateString()}</p>
          <div>
            {event.images.map((img, idx) => (
              <img key={idx} src={img} alt="evento" style={{ width: 150 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
