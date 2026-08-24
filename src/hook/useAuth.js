export const useAuth = () => {
  // Simulamos un token JWT y datos de sesión estáticos por ahora
  return {
    userToken: "mock-jwt-token-12345",
    isAuthenticated: true,
  };
};