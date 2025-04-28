import { Task, TaskStatus, User } from '../types';
import { mockTasks, mockUsers, /*mockSprints*/ mockTeams } from '../mocks/data';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // simulaciones
  getCurrentUser: async (): Promise<User> => {
    await delay(300);
    return mockUsers[0]; //asume el 1er user es el actual
  },

  getAllTasks: async (): Promise<Task[]> => {
    await delay(500);
    return [...mockTasks];
  },

  getTasksBySprint: async (sprintId: string): Promise<Task[]> => {
    await delay(500);
    return mockTasks.filter((task) => task.sprintId === sprintId);
  },

  getTasksByUser: async (userId: string): Promise<Task[]> => {
    await delay(500);
    return mockTasks.filter((task) => task.assignedTo === userId);
  },

  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    await delay(400);
    const taskIndex = mockTasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    const updatedTask = {
      ...mockTasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    mockTasks[taskIndex] = updatedTask;
    return updatedTask;
  },

  completeTask: async (taskId: string, actualHours: number): Promise<Task> => {
    await delay(400);
    return api.updateTask(taskId, {
      status: TaskStatus.COMPLETED,
      completedAt: new Date().toISOString(),
      actualHours,
    });
  },

  getTODOTasksByTeam: async (teamId: string): Promise<Task[]> => {
    await delay(500);
    const teamMembers = mockTeams.find((team) => team.id === teamId)?.members || [];
    return mockTasks.filter(
      (task) => teamMembers.includes(task.assignedTo) && task.status != TaskStatus.COMPLETED
    );
  },
};
