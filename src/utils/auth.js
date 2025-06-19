export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch (error) {
    return true; // si no se puede decodificar, consideramos que está mal
  }
};
