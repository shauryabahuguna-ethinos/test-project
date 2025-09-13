import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from '../AppSidebar'

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-96 w-full border rounded-md overflow-hidden">
        <AppSidebar
          currentPage="tasks"
          onNavigate={(page) => console.log('Navigate to:', page)}
          onCreateTask={() => console.log('Create new task')}
        />
      </div>
    </SidebarProvider>
  )
}