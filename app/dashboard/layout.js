import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata = {
  title: "ConvoVerse",
  description: "Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="sticky top-5 ml-2" />
      {children}
    </SidebarProvider>
  );
}
