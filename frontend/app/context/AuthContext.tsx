import { createContext, useContext, useState, type ReactNode} from "react";


type AuthContextType = {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
const [token, setToken] = useState<string | null>(() =>
  localStorage.getItem("token")
);

const [userId, setUserId] = useState<string | null>(() =>
  localStorage.getItem("userId")
);

const login = (newToken: string, newUserId: string) => {
  localStorage.setItem("token", newToken);
  localStorage.setItem("userId", newUserId);

  setToken(newToken);
  setUserId(newUserId);
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  setToken(null);
  setUserId(null);
};

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}