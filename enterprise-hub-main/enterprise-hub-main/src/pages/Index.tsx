import { useState } from "react";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { TaskBoard } from "@/components/TaskBoard";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const { profile, userRole } = useAuth();

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard userRole={userRole} />;
      case "tasks":
        return <TaskBoard userRole={userRole} />;
      case "teams":
      case "team":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Team Management</h2>
            <p className="text-muted-foreground">Team management features will be implemented with full backend integration.</p>
          </div>
        );
      case "analytics":
      case "reports":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Analytics & Reports</h2>
            <p className="text-muted-foreground">Advanced analytics and reporting features will be implemented with full backend integration.</p>
          </div>
        );
      default:
        return <Dashboard userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        userRole={userRole}
        profile={profile}
      />
      <main className="min-h-[calc(100vh-4rem)]">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Index;
