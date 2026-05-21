import { Outlet } from "react-router-dom";
import { MainHeader } from "./MainHeader";
import { SimpleFooter } from "./SimpleFooter";

export function AuthShell() {
  return (
    <div className="flex min-h-screen flex-col cosmos-app-chrome auth-app-chrome">
      <MainHeader variant="auth" />
      <div className="relative flex flex-1 min-h-0 flex-col">
        <div className="relative z-[1] flex flex-1 flex-col">
          <Outlet />
        </div>
      </div>
      <SimpleFooter />
    </div>
  );
}
