import React, { createContext, useContext, useState, useEffect, ReactNode} from 'react';
import { Task } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface TasksContextType {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
    completeTask: (taskId: string, actualHours: number) => Promise<void>;
    refreshTasks: () => Promise<void>;
}

const TasksContext = createContext<TasksContextType>({
    tasks: [],
    loading: false,
    error: null,
    updateTask: async () => {},
    completeTask: async () => {},
    refreshTasks: async () => {},
});

export const useTasks = () => useContext(TasksContext);

export const TasksProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    const loadTasks = async () => {
        if(!currentUser) return;
        setLoading(true);
        setError(null);
        try {
            let fetchedTasks;
            if(currentUser.role === 'Team Leader') {
                fetchedTasks = await api.getAllTasks();
            } else {
                fetchedTasks = await api.getTasksByUser(currentUser.id);
            }
            setTasks(fetchedTasks);
        } catch (err) {
            setError('Error loading tasks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            loadTasks();
        }
    }, [currentUser]);

    const updateTask = async (taskId: string, updates: Partial<Task>) => {
        try {
            await api.updateTask(taskId, updates);
            await loadTasks();
        } catch (err) {
            setError('Error updating task');
            console.error(err);
        }
    };

    const completeTask = async (taskId: string, actualHours: number) => {
        try {
            await api.completeTask(taskId, actualHours);
            await loadTasks();
        } catch (err) {
            setError('Error completing task');
            console.error(err);
        }
    };

    const refreshTasks = async () => {
        await loadTasks();
    };

    return (
        <TasksContext.Provider value={{ tasks, loading, error, updateTask, completeTask, refreshTasks }}>
            {children}
        </TasksContext.Provider>
    );
};
