import React, { useState } from 'react';
import { useTasks } from '../contexts/TasksContext';
import TaskCard from '../components/tasks/TaskCards';
import { TaskStatus } from '../types';

const TasksList: React.FC = () => {
    const { tasks, loading, error } = useTasks();
    const [filter, setFilter] = useState<string>('all');

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'to-do') return task.status === TaskStatus.TODO;
        if (filter === 'in-progress') return task.status === TaskStatus.IN_PROGRESS;
        if (filter === 'completed') return task.status === TaskStatus.COMPLETED;
        return false;
    });

    if (loading) {
        return <div className="text-center py-10">Loading tasks...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
            <div className="mb-6 flex gap-2">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    All
                </button>
                <button onClick={() => setFilter('to-do')} className={`px-4 py-2 rounded ${filter === 'to-do' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    To Do
                </button>
                <button onClick={() => setFilter('in-progress')} className={`px-4 py-2 rounded ${filter === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    In Progress
                </button>
                <button onClick={() => setFilter('completed')} className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    Completed
                </button>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No tasks found with the actual filter</div>
            ) : (
                <div>
                    {filteredTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TasksList;