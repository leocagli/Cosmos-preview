import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppShell } from "./components/AppShell";
import { LandingAppShell } from "./components/LandingAppShell";
import { AuthShell } from "./components/AuthShell";
import { GuestRoute } from "./components/GuestRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CosmosPayDevLayout } from "./components/cosmosPay/CosmosPayDevLayout";
import { CosmosPayLanding } from "./pages/CosmosPayLanding";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CosmosPayDevOverviewPage } from "./pages/cosmosPayDev/CosmosPayDevOverviewPage";
import { CosmosPayDevKeysPage } from "./pages/cosmosPayDev/CosmosPayDevKeysPage";
import { CosmosPayDevLinksPage } from "./pages/cosmosPayDev/CosmosPayDevLinksPage";
import { CosmosPayDevDocsPage } from "./pages/cosmosPayDev/CosmosPayDevDocsPage";
import { CosmosPayAccountPage } from "./pages/cosmosPayDev/CosmosPayAccountPage";
import { CosmosPayPublicDocsPage } from "./pages/CosmosPayPublicDocsPage";
import { CosmosPayLinkPublicPage } from "./pages/cosmosPayDev/CosmosPayLinkPublicPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route element={<AuthShell />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/registro" element={<RegisterPage />} />
            </Route>
          </Route>

          <Route element={<LandingAppShell />}>
            <Route path="/" element={<CosmosPayLanding />} />
          </Route>

          <Route path="/docs/cosmos-pay" element={<CosmosPayPublicDocsPage />} />

          <Route element={<AppShell />}>
            <Route path="/cosmos-pay" element={<Navigate to="/" replace />} />
            <Route path="pago/:slug" element={<CosmosPayLinkPublicPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="panel/developers" element={<CosmosPayDevLayout />}>
              <Route index element={<Navigate to="cosmos-pay" replace />} />
              <Route path="cosmos-pay" element={<CosmosPayDevOverviewPage />} />
              <Route path="cosmos-pay/llaves" element={<CosmosPayDevKeysPage />} />
              <Route path="cosmos-pay/links" element={<CosmosPayDevLinksPage />} />
              <Route path="cosmos-pay/docs" element={<CosmosPayDevDocsPage />} />
              <Route path="cosmos-pay/cuenta" element={<CosmosPayAccountPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
