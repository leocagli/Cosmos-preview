import { Outlet } from "react-router-dom";
import { SimpleFooter } from "./SimpleFooter";

/** Home route: full-bleed gateway hero without the global marketing header. */
export function LandingAppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-cosmos-bg">
      <Outlet />
      <SimpleFooter variant="gateway" />
    </div>
  );
}
