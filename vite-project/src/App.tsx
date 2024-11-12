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
import Campaign from "./pages/user/campaign/Campaign";
import Accounts from "./pages/user/accounts/Accounts";
import Contacts from "./pages/user/contacts/Contacts";
import EmailTemplate from "./pages/user/email_template/EmailTemplate";
import { TooltipProvider } from "./components/ui/tooltip";
import CreateEmailTemplate from "./pages/user/email_template/CreateEmailTemplate";
import UpdateEmailTemplate from "./pages/user/email_template/UpdateEmailTemplate";
import Dashboard from "./pages/user/campaign/CampaignList";
import AutomationBuilderEditor from "./pages/user/campaign/campaign_automation/AutomationBuilder.Page";
import { ReactFlowProvider } from "@xyflow/react";
import Emails from "./pages/user/emails/Emails";
import { LandingPage } from "./pages/LandingPage";

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
        <TooltipProvider>
          <Router>
            <ModalProvider>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route element={<ProtectedRoutes />}>
                    <Route path="/emails" element={<Emails />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                      path="/dashboard/:id"
                      element={
                        <ReactFlowProvider>
                          <Campaign />
                        </ReactFlowProvider>
                      }
                    />
                    <Route
                      path="/dashboard/:id/editor"
                      element={
                        <ReactFlowProvider>
                          <AutomationBuilderEditor />
                        </ReactFlowProvider>
                      }
                    />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route
                      path="/email-templates"
                      element={<EmailTemplate />}
                    />
                    <Route
                      path="/email-templates/create"
                      element={<CreateEmailTemplate />}
                    />
                    <Route
                      path="/email-templates/:id"
                      element={<UpdateEmailTemplate />}
                    />
                  </Route>
                  <Route element={<AuthRoutes />}>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>
              </AuthProvider>
            </ModalProvider>
          </Router>
        </TooltipProvider>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;

