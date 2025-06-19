import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Cargando autenticación...</div>;
  }

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
