/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import usePostQuery from "./usePostQuery";
import { Loader } from "lucide-react";
import { UNAUTHORIZED_EVENT } from "@/App";

type AuthContextType = {
  user: any;
  login: (data: any, redirect?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
const FIFTEEN_MINUTES = 15 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { mutate } = usePostQuery("/api/users/refresh-token");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const refreshAccessToken = () => {
    mutate(
      {},
      {
        onSuccess: (data) => {
          login(data);
        },
        onError: () => {
          logout();
        },
      }
    );
  };

  useEffect(() => {
    const checkUserExpiration = async () => {
      console.log("check user expiration");
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const currDate = new Date();
        const expDate = new Date(parsedUser.expiry);

        if (currDate.getTime() > expDate.getTime()) {
          console.log("refresh access otken");
          refreshAccessToken();
        } else {
          console.log("set user");
          setUser(parsedUser);
          setIsLoading(false);
        }
      } else {
        // No user found, stop loading
        setIsLoading(false);
      }
    };

    checkUserExpiration();
  }, []);

  const login = useCallback(
    async (data: any, redirect?: string) => {
      const userData = {
        ...data,
        expiry: new Date(Date.now() + FIFTEEN_MINUTES),
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      if (redirect) {
        navigate(`${redirect}`);
        return;
      }
      navigate("/dashboard");
      setIsLoading(false);
    },
    [navigate]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user data from local storage
    navigate("/login", { replace: true });
    setIsLoading(false);
  }, [navigate]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [navigate, logout]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isLoading,
    }),
    [user, isLoading, login, logout]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <Loader className="animate-spin" size={20} />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
