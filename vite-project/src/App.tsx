/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "./App.css";
import { AuthProvider } from "./hooks/useAuth";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoutes from "./components/layout/ProtectedRoutes";
import AuthRoutes from "./components/layout/AuthRoutes";
import ModalProvider from "./hooks/useModal";
import Dashboard from "./pages/user/dashboard/Dashboard";
import Accounts from "./pages/user/accounts/Accounts";
import Contacts from "./pages/user/contacts/Contacts";

export const UNAUTHORIZED_EVENT = "unauthorized_error";
const handleError = (error: any) => {
  if (error?.response?.status === 401) {
    console.log("Unauthorized error occurred");
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }
  // Handle other types of errors if needed
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleError,
  }),
  mutationCache: new MutationCache({
    onError: handleError,
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ModalProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<h1>Landing Page</h1>} />
                <Route element={<ProtectedRoutes />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/contacts" element={<Contacts />} />
                </Route>
                <Route element={<AuthRoutes />}>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>
            </AuthProvider>
          </ModalProvider>
        </Router>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;

