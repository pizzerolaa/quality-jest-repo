import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TasksContext';
import { Task, TaskStatus } from '../types';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { tasks } = useTasks();
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  //calcular kpi ggs zzz
  const totalHoursEstimated = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
  const totalHoursActual = tasks.reduce((sum, task) => sum + task.actualHours, 0);
  const completionRate =
    tasks.length > 0 ? ((completedTasks.length / tasks.length) * 100).toFixed(2) : '0';

  useEffect(() => {
    if (tasks.length > 0) {
      setPendingTasks(tasks.filter((task) => task.status !== TaskStatus.COMPLETED));
      setCompletedTasks(tasks.filter((task) => task.status === TaskStatus.COMPLETED));
    }
  }, [tasks]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {currentUser && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl mb-2">Welcome, {currentUser.name}</h2>
          <p className="text-gray-600">
            {currentUser.role === 'Team Leader'
              ? 'U have access to team leader panel'
              : 'Access to your tasks and custom dashboard'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
          <h3 className="font-bold text-lg">Assignee Tasks</h3>
          <p className="text-3xl font-bold">{tasks.length}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
          <h3 className="font-bold text-lg">Pending Tasks</h3>
          <p className="text-3xl font-bold">{pendingTasks.length}</p>
        </div>

        <div className="bg-green-100 p-4 rounded-lg shadow text-center">
          <h3 className="font-bold text-lg">Completed Tasks</h3>
          <p className="text-3xl font-bold">{completedTasks.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">KPIs by Hours</h2>
          <div className="mb-3">
            <p className="text-gray-600">Total Estimated Hours:</p>
            <p className="text-2xl font-bold">{totalHoursEstimated}</p>
          </div>
          <div className="mb-3">
            <p className="text-gray-600">Actual Hours Worked:</p>
            <p className="text-2xl font-bold">{totalHoursActual}</p>
          </div>
          <div className="mb-3">
            <p className="text-gray-600">Completion Rate:</p>
            <p className="text-2xl font-bold">{completionRate}%</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Tasks</h2>
          {tasks.slice(0, 3).map((task) => (
            <div key={task.id} className="mb-3 p-3 border-b">
              <div className="flex justify-between">
                <p className="font-medium">{task.title}</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    task.status === TaskStatus.COMPLETED
                      ? 'bg-green-100'
                      : task.status === TaskStatus.IN_PROGRESS
                        ? 'bg-blue-100'
                        : 'bg-yellow-100'
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">Assignee to: {task.developerName}</p>
            </div>
          ))}

          {tasks.length === 0 && <p className="text-gray-500">No tasks TODO</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
