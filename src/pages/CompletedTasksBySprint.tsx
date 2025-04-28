import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Sprint } from '../types';
import { api } from '../services/api';
import { mockSprints } from '../mocks/data';

const CompletedTasksBySprint: React.FC = () => {
    const [selectedSprint, setSelectedSprint] = useState<string>(mockSprints[0]?.id || '');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [sprints] = useState<Sprint[]>(mockSprints);

    useEffect(() => {
        const loadTasks = async () => {
            if (!selectedSprint) return;

            setLoading(true);
            try {
                const allTasks = await api.getTasksBySprint(selectedSprint);
                const completedTasks = allTasks.filter(task => task.status === TaskStatus.COMPLETED);
                setTasks(completedTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, [selectedSprint]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Completed Tasks by Sprints</h1>
            <div className="mb-6">
                <label htmlFor="sprint-select" className="block mb-2">Select Sprint:</label>
                <select
                    id='sprint-select'
                    value={selectedSprint}
                    onChange={(e) => setSelectedSprint(e.target.value)}
                    className="p-2 border rounded w-full md:w-80"
                >
                    {sprints.map(sprint => (
                        <option key={sprint.id} value={sprint.id}>
                            {sprint.name} ({new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading tasks...</div>
            ) : (
                <>
                    {tasks.length === 0 ? (
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            No completed tasks found for the selected sprint.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2 text-left">Task Name</th>
                                        <th className="border p-2 text-left">Developer</th>
                                        <th className="border p-2 text-left">Estimated Hours</th>
                                        <th className="border p-2 text-left">Actual Hours</th>
                                        <th className="border p-2 text-left">Complete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map(task => (
                                        <tr key={task.id} className="hover:bg-gray-50">
                                            <td className="border p-2">{task.title}</td>
                                            <td className="border p-2">{task.developerName}</td>
                                            <td className="border p-2">{task.estimatedHours}</td>
                                            <td className="border p-2">{task.actualHours}</td>
                                            <td className="border p-2">{task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CompletedTasksBySprint;