"use client";

import Spinner from "@/components/UI/SpinnerLoading";
import User from "../lib/models/userModel";
import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
  useContext,
} from "react";


interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  login: (newToken: string, user: User) => void;
  logout: () => void;
  loginWithGoogle: (token: string) => void;
  isLoading: boolean;
  error: string | null;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  userId: null,
  login: () => {},
  logout: () => {},
  loginWithGoogle: () => {},
  isLoading: true,
  error: null,
  user: null,
  setUser: () => {},
});

interface AuthProviderProp {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProp> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set timeout for token expiration
  useEffect(() => {
    if (!token) return;

    // Decode JWT token to get expiration time
    const decodeToken = (token: string) => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000; // Convert to milliseconds
      } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
      }
    };

    const expirationTime = decodeToken(token);
    if (!expirationTime) return;

    const timeUntilExpiration = expirationTime - Date.now();
    
    if (timeUntilExpiration <= 0) {
      // Token already expired
      logout();
      return;
    }

    // Set timeout to logout when token expires
    const timeoutId = setTimeout(() => {
      console.log('Token expired, logging out...');
      logout();
    }, timeUntilExpiration);

    return () => clearTimeout(timeoutId);
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setIsAuthenticated(!!(token || storedToken));
  }, [token]);


  const login = (newToken: string, user: User) => {
    setToken(newToken);
    setUser(user);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userData", JSON.stringify(user));
  };

  const loginWithGoogle = (token: string) => {
    setToken(token);
  };

  const logout = () => {
    setIsLoading(true);
    setToken(null);
    setUserId(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");
    setIsLoading(false);
    // Use window.location for client-side redirect
    window.location.href = "/";
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    let userData = null;
    try {
      const raw = localStorage.getItem("userData");
      if (raw && raw !== "undefined") {
        userData = JSON.parse(raw);
      }
    } catch (err) {
      console.log("there is no userData", err);
    }

    const verifyToken = async () => {
      let res;
      try {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-token`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server did not return JSON");
        }

        const data = await res.json();

        if (res.ok && data.valid) {
          console.log(res.status);
          // Set state directly instead of calling login to avoid infinite loop
          setToken(storedToken);
          setUser(data.user);
          setIsAuthenticated(true);
        } else if (res.status === 401 && !data.valid) {
          console.log(res.status);
          logout();
        } else {
          setError("Server Failed Please try Another Time");
          // Clear invalid token
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        // Only set user data if we have a token, otherwise clear everything
        if (storedToken) {
          setUser(userData);
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
        setError("Server Failed Please try Another Time");
      } finally {
        setIsLoading(false);
      }
    };

    if (storedToken) {
      verifyToken();
    } else {
      setIsLoading(false);
    }
  }, []); // Remove token dependency to prevent infinite loop

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        userId,
        login,
        logout,
        isLoading,
        user,
        setUser,
        error,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
