import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

// alterar userType pra cliente ou lojista
// logica do back vai vir aqui dps
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'tipo usuario teste',
    userType: 'lojista'
  });
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
