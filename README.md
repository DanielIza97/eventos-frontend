# Frontend - Event Management System

Este proyecto es el frontend desarrollado con React para el sistema de gestión de eventos.

## 🚀 Tecnologías usadas

- React (Create React App)
- Axios para llamadas HTTP
- React Router para navegación
- React Big Calendar para calendario de eventos

## 📦 Instalación

1. Clona el repositorio y navega a la carpeta del frontend.
2. Ejecuta en la terminal:

```bash
npm install
```

````

3. Crea un archivo `.env` basado en `.env.example` con las variables de entorno necesarias.

Ejemplo de `.env`:

## ⚙ Variables de entorno

- `REACT_APP_API_URL`: URL base para las llamadas a la API (backend).
- `REACT_APP_UPLOADS_URL`: URL base para acceder a las imágenes subidas.

4. Inicia el servidor de desarrollo:

```bash
npm start
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la app.

## 📂 Estructura del proyecto

```
eventos-frontend/
├── public/             # Archivos públicos (index.html, favicon, etc.)
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── context/        # Contextos (e.g. AuthContext)
│   ├── pages/          # Páginas principales (Orders, Inventory, Login, etc.)
│   ├── services/          # Servicios
│   ├── App.jsx         # Componente raíz
│   └── index.js        # Entrada principal
├── .env.example        # Ejemplo de variables de entorno
├── package.json
└── README.md
``
````
