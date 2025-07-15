
import { BarChart3, Users, UserCheck, Receipt, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Overview",
    icon: Home,
    key: "overview",
  },
  {
    title: "Leads",
    icon: Users,
    key: "leads",
  },
  {
    title: "Onboarding",
    icon: UserCheck,
    key: "onboarding",
  },
  {
    title: "Invoices",
    icon: Receipt,
    key: "invoices",
  },
];

interface AppSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      className={`${isCollapsed ? "w-16" : "w-64"} transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarHeader className={`${isCollapsed ? "p-2" : "p-4 md:p-6"}`}>
        <div className="flex items-center space-x-2">
          <BarChart3 className={`${isCollapsed ? "w-6 h-6" : "w-8 h-8"} text-blue-600`} />
          {!isCollapsed && (
            <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
              COSLYN AI
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs md:text-sm">Dashboard</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton 
                    onClick={() => setActiveView(item.key)}
                    className={`
                      ${activeView === item.key 
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      ${isCollapsed ? "justify-center" : "justify-start"}
                      h-10 md:h-12 transition-all duration-200
                    `}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <item.icon className={`${isCollapsed ? "w-5 h-5" : "w-4 h-4"}`} />
                    {!isCollapsed && (
                      <span className="text-sm md:text-base">{item.title}</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
