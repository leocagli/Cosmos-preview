import { Outlet } from "react-router-dom";
import { MainHeader } from "./MainHeader";
import { SimpleFooter } from "./SimpleFooter";

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col cosmos-app-chrome">
      <MainHeader />
      <main className="relative flex-1 min-h-0">
        <div className="relative z-[1]">
          <Outlet />
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
}
