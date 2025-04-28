import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Dashboard from '../pages/Dashboard';
import TasksList from '../pages/TasksList';
import CompletedTasksBySprint from '../pages/CompletedTasksBySprint';
import TeamReportsPage from '../pages/TeamReportsPages';
import TeamTasksPage from '../pages/TeamTaskPage';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { TasksProvider } from '../contexts/TasksContext';
import { UserRole } from '../types';

const TeamLeadRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  if (!currentUser || currentUser.role !== UserRole.TEAM_LEAD) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TasksProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-4">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<TasksList />} />
                
                {/* rutas accesibles por todos */}
                <Route path="/tasks/completed-by-sprint" element={<CompletedTasksBySprint />} />
                
                {/* rutas solo para líder de equipo */}
                <Route 
                  path="/team-tasks" 
                  element={<TeamLeadRoute><TeamTasksPage /></TeamLeadRoute>} 
                />
                <Route 
                  path="/reports" 
                  element={<TeamLeadRoute><TeamReportsPage /></TeamLeadRoute>} 
                />
                
                {/* ruta por defecto */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        </TasksProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;