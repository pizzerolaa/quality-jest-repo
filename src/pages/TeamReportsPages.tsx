import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { mockSprints, mockTeams } from '../mocks/data';
import { api } from '../services/api';

const TeamReportsPage: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState(mockTeams[0]?.id || '');
  const [selectedSprintId, setSelectedSprintId] = useState(mockSprints[0]?.id || '');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedSprintId) return;

      setLoading(true);
      try {
        const allTasks = await api.getAllTasks();

        const filteredTasks = allTasks.filter((task) => task.sprintId === selectedSprintId);

        setTasks(filteredTasks);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedSprintId, selectedTeam]);

  const totalCompletedTasks = tasks.filter((task) => task.status === TaskStatus.COMPLETED).length;
  const totalHoursEstimated = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
  const totalHoursActual = tasks.reduce((sum, task) => sum + task.actualHours, 0);

  const developerStats = tasks.reduce(
    (acc, task) => {
      if (!acc[task.developerId]) {
        acc[task.developerId] = {
          name: task.developerName,
          tasksCount: 0,
          completedTasks: 0,
          estimatedHours: 0,
          actualHours: 0,
        };
      }

      acc[task.developerId].tasksCount += 1;
      if (task.status === TaskStatus.COMPLETED) {
        acc[task.developerId].completedTasks += 1;
      }
      acc[task.developerId].estimatedHours += task.estimatedHours;
      acc[task.developerId].actualHours += task.actualHours;

      return acc;
    },
    {} as Record<
      string,
      {
        name: string;
        tasksCount: number;
        completedTasks: number;
        estimatedHours: number;
        actualHours: number;
      }
    >
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Team Report</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="team-select" className="block mb-2">
            Team:
          </label>
          <select
            id="team-select"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="p-2 border rounded w-full"
          >
            {mockTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sprint-select" className="block mb-2">
            Sprint:
          </label>
          <select
            id="sprint-select"
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            className="p-2 border rounded w-full"
          >
            {mockSprints.map((sprint) => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name} ({new Date(sprint.startDate).toLocaleDateString()} -{' '}
                {new Date(sprint.endDate).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading data...</div>
      ) : (
        <>
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Team KPI</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-medium mb-2">Completed Tasks</h3>
                <p className="text-3xl font-bold">
                  {totalCompletedTasks} / {tasks.length}
                </p>
                <p className="text-sm text-gray-500">
                  {tasks.length > 0
                    ? `${((totalCompletedTasks / tasks.length) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-medium mb-2">Estimated Hours</h3>
                <p className="text-3xl font-bold">{totalHoursEstimated}</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-medium mb-2">Actual Hours</h3>
                <p className="text-3xl font-bold">{totalHoursActual}</p>
                <p className="text-sm text-gray-500">
                  {totalHoursEstimated > 0
                    ? `${((totalHoursActual / totalHoursEstimated) * 100).toFixed(1)}% estimated`
                    : '0%'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">KPI by Developer</h2>

            {Object.keys(developerStats).length === 0 ? (
              <p className="text-center text-gray-500 py-4">No data to show</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Developer</th>
                      <th className="border p-2 text-left">Total Tasks</th>
                      <th className="border p-2 text-left">Completed</th>
                      <th className="border p-2 text-left">% Completed</th>
                      <th className="border p-2 text-left">Estimated Hours</th>
                      <th className="border p-2 text-left">Actual Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(developerStats).map((dev, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border p-2">{dev.name}</td>
                        <td className="border p-2">{dev.tasksCount}</td>
                        <td className="border p-2">{dev.completedTasks}</td>
                        <td className="border p-2">
                          {dev.tasksCount > 0
                            ? `${((dev.completedTasks / dev.tasksCount) * 100).toFixed(1)}%`
                            : '0%'}
                        </td>
                        <td className="border p-2">{dev.estimatedHours}</td>
                        <td className="border p-2">{dev.actualHours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamReportsPage;
