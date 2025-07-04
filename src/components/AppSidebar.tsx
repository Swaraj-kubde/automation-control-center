
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
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <img src="/lovable-uploads/d6817b98-b0d8-4817-bde6-b847a3619739.png" alt="CoslynAI Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-gray-900">CoslynAI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton 
                    onClick={() => setActiveView(item.key)}
                    className={activeView === item.key ? "bg-blue-100 text-blue-700" : ""}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
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
