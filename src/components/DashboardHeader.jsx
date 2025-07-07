
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="border-b bg-white dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Business Automation Dashboard</h1>
      </div>
      <div className="flex items-center space-x-2">
        {/* <Button variant="ghost" size="sm">
          <Bell className="w-4 h-4" />
        </Button> */}
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>
      </div>
    </header>
  );
}
