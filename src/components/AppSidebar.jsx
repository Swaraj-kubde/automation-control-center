
import { BarChart3, Users, UserCheck, Receipt, Home, Target, FileText } from "lucide-react";
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
  // ,
  // {
  //   title: "Lead Qualification",
  //   icon: Target,
  //   key: "qualification",
  // },
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
  {
    title: "CV Evaluation",
    icon: FileText,
    key: "cv-evaluation",
  },
];

export function AppSidebar({ activeView, setActiveView }) {
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">AutoBiz</span>
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
                    className={activeView === item.key ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : ""}
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
