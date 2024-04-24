import { getCookie } from "cookies-next";
import { createContext, useState, useContext, FC, ReactNode } from "react";

interface User {
  id: string | number;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  signin: (userData: User) => void;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cookieValue = getCookie("authtoken");
    return cookieValue ? JSON.parse(cookieValue.toString()) : null;
  });

  const signin = (userData: User | null) => {
    setUser(userData);
  };

  const signout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
