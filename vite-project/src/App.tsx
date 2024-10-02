import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { AuthProvider } from "./hooks/useAuth";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/toaster";
import Dashboard from "./pages/user/dashboard";
import ProtectedRoutes from "./components/ui/layout/ProtectedRoutes";
import AuthRoutes from "./components/ui/layout/AuthRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<h1>Landing Page</h1>} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route element={<AuthRoutes />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;

