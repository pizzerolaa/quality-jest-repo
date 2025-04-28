import React, { createContext, useContext, useState, useEffect, ReactNode} from 'react';
import { Task, UserRole } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { mockTeams } from '../mocks/data';

interface TasksContextType {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
    completeTask: (taskId: string, actualHours: number) => Promise<void>;
    refreshTasks: () => Promise<void>;
    loadUserTasks: () => Promise<void>;
    loadTeamTasks: () => Promise<void>;
}

const TasksContext = createContext<TasksContextType>({
    tasks: [],
    loading: false,
    error: null,
    updateTask: async () => {},
    completeTask: async () => {},
    refreshTasks: async () => {},
    loadUserTasks: async () => {},
    loadTeamTasks: async () => {},
});

export const useTasks = () => useContext(TasksContext);

export const TasksProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    const loadUserTasks = async () => {
        if(!currentUser) return;
        setLoading(true);
        setError(null);
        try {
            const fetchedTasks = await api.getTasksByUser(currentUser.id);
            setTasks(fetchedTasks);
        } catch (err) {
            setError('Error loading user tasks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadTeamTasks = async () => {
        if(!currentUser || currentUser.role !== UserRole.TEAM_LEAD) return;
        setLoading(true);
        setError(null);
        try {
            const allTasks = await api.getAllTasks();
            const team = mockTeams.find(team => team.leaderId === currentUser.id);
            if (team) {
                const fetchedTasks = allTasks.filter(task => team.members.includes(task.assignedTo));
                setTasks(fetchedTasks);
            } else {
                setTasks([]);
            }
        } catch (err) {
            setError('Error loading team tasks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            loadUserTasks();
        }
    }, [currentUser]);

    const updateTask = async (taskId: string, updates: Partial<Task>) => {
        try {
            await api.updateTask(taskId, updates);
            await loadUserTasks();
        } catch (err) {
            setError('Error updating task');
            console.error(err);
        }
    };

    const completeTask = async (taskId: string, actualHours: number) => {
        try {
            await api.completeTask(taskId, actualHours);
            await loadUserTasks();
        } catch (err) {
            setError('Error completing task');
            console.error(err);
        }
    };

    const refreshTasks = async () => {
        await loadUserTasks();
    };

    return (
        <TasksContext.Provider value={{ 
            tasks, 
            loading, 
            error, 
            updateTask, 
            completeTask, 
            refreshTasks,
            loadUserTasks,
            loadTeamTasks 
        }}>
            {children}
        </TasksContext.Provider>
    );
};
