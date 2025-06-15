
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold text-gray-900">Business Automation Dashboard</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <Bell className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
