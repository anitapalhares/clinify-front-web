import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('clinify_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    let role = 'estudante';
    if (email.includes('prof')) role = 'professor';
    if (email.includes('admin')) role = 'administrador';

    const userData = { email, role, token: 'mock-jwt-token' };
    setUser(userData);
    localStorage.setItem('clinify_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clinify_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);