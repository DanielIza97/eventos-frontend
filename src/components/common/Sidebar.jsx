import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2>Vajillas Selva Alegre</h2>

      {/* Perfil del usuario */}
      <div className="user-profile">
        <p>
          <strong>{user?.nombre || "Invitado"}</strong>
        </p>
        <p style={{ fontSize: "0.9em", color: "#888" }}>{user?.email}</p>
        <p style={{ fontSize: "0.9em", fontStyle: "italic" }}>
          Rol: {user?.rol}
        </p>
      </div>

      <nav>
        <ul>
          <li>
            <Link to="/orders">Pedidos</Link>
          </li>
          <li>
            <Link to="/inventory">Inventario</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Salir</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
