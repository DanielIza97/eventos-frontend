import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg flex flex-col p-6">
      <h1 className="text-2xl font-extrabold mb-10 text-blue-700 tracking-wide">
        Vajillas Selva Alegre
      </h1>

      <div className="mb-10 border-b pb-6">
        <p
          className="text-lg font-semibold text-gray-900 truncate"
          title={user?.nombre}
        >
          {user?.nombre || "Invitado"}
        </p>
        <p className="text-sm text-gray-500 truncate" title={user?.email}>
          {user?.email}
        </p>
        <p className="mt-1 text-sm italic text-gray-400">
          Rol: {user?.rol || "N/A"}
        </p>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-4">
          <li>
            <Link
              to="/orders"
              className="block px-4 py-3 rounded-lg hover:bg-blue-100 text-gray-700 hover:text-blue-700 font-medium transition-colors"
            >
              Pedidos
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="block px-4 py-3 rounded-lg hover:bg-blue-100 text-gray-700 hover:text-blue-700 font-medium transition-colors"
            >
              Productos
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition-colors"
            >
              Salir
            </button>
          </li>
        </ul>
      </nav>

      <footer className="mt-auto text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Vajillas Selva Alegre
      </footer>
    </aside>
  );
};

export default Sidebar;
