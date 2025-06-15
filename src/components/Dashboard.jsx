
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SummaryCards } from "@/components/SummaryCards";
import { LeadsOverview } from "@/components/LeadsOverview";
import { OnboardingTracker } from "@/components/OnboardingTracker";
import { InvoiceTracker } from "@/components/InvoiceTracker";
import { useState } from "react";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("overview");

  const renderContent = () => {
    switch (activeView) {
      case "leads":
        return <LeadsOverview />;
      case "onboarding":
        return <OnboardingTracker />;
      case "invoices":
        return <InvoiceTracker />;
      default:
        return (
          <div className="space-y-6">
            <SummaryCards />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <LeadsOverview />
              <OnboardingTracker />
            </div>
            <InvoiceTracker />
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
