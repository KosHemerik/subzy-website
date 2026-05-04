import { 
  DashboardHeader, 
  DashboardSidebar, 
  DashboardFooter, 
  DashboardContent 
} from "./components";
import DashboardProtection from "./DashboardProtection";

export const metadata = {
  title: "Dashboard - Subzy Klantportaal",
  description: "Beheer uw subsidieaanvragen en teruggaven in het Subzy klantportaal.",
};

/**
 * Dashboard Page - Klantportaal Overview
 * Protected route - only accessible when logged in
 */
export default function DashboardPage() {
  return (
    <DashboardProtection>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardHeader />
        <div className="flex-grow flex max-w-[1440px] mx-auto w-full">
          <DashboardSidebar />
          <DashboardContent />
        </div>
        <DashboardFooter />
      </div>
    </DashboardProtection>
  );
}
