
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Sun, Moon, BarChart3 } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white dark:bg-gray-800 px-3 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-2 md:space-x-4 flex-1">
        <SidebarTrigger className="md:hidden" />
        
        {/* Mobile Logo */}
        <div className="flex items-center space-x-2 md:hidden">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">COSLYN</span>
        </div>
        
        {/* Desktop Title */}
        <h1 className="hidden md:block text-lg lg:text-2xl font-semibold text-gray-900 dark:text-gray-100 truncate">
          Business Automation Dashboard
        </h1>
        
        {/* Mobile Title */}
        <h1 className="md:hidden text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
          Dashboard
        </h1>
      </div>
      
      <div className="flex items-center space-x-1 md:space-x-2">
        <Button variant="ghost" size="sm" className="p-2">
          <Bell className="w-4 h-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="sm" className="p-2">
          <Settings className="w-4 h-4" />
          <span className="sr-only">Settings</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
