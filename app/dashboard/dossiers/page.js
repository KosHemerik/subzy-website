import DossiersOverview from "./components/DossiersOverview";
import DashboardProtection from "../DashboardProtection";
import { DashboardSidebar, DashboardFooter } from "../components";

export const metadata = {
  title: "Mijn Dossiers - Subzy Klantportaal",
  description: "Bekijk alle dossiers die gekoppeld zijn aan uw Subzy account.",
};

export default function DossiersPage() {
  return (
    <DashboardProtection>
      <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,#dbe8ff_0%,#edf4ff_40%,#f4f8ff_100%)] text-primary relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute top-40 -left-28 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />
        </div>
        <div className="relative z-10 flex-grow flex w-full">
          <DashboardSidebar />
          <DossiersOverview />
        </div>
        <DashboardFooter />
      </div>
    </DashboardProtection>
  );
}
