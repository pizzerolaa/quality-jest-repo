// src/__tests__/useTasks.test.tsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTasks, TasksProvider } from '../contexts/TasksContext';
import { AuthProvider } from '../contexts/AuthContext';
import { api } from '../services/api';
import { TaskStatus } from '../types';

// Mock the API module
jest.mock('../services/api');

describe('useTasks custom hook', () => {
  const mockTasks = [
    {
      id: 't1',
      title: 'Test Task 1',
      description: 'Description for test task 1',
      assignedTo: 'A01643639',
      developerId: 'A01643639',
      developerName: 'Sadrac Aramburo',
      status: TaskStatus.TODO,
      storyPoints: 5,
      estimatedHours: 8,
      actualHours: 0,
      sprintId: 'sprint1',
      createdAt: '2025-04-01',
      updatedAt: '2025-04-01',
      completedAt: null,
    },
  ];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set up API mocks
    api.getCurrentUser = jest.fn().mockResolvedValue({
      id: 'A01643639',
      name: 'Sadrac Aramburo',
      role: 'Worker',
      email: 'sadrac@example.com',
      password: 'password123',
      teamId: 'team1',
    });

    api.getTasksByUser = jest.fn().mockResolvedValue(mockTasks);
    api.getAllTasks = jest.fn().mockResolvedValue(mockTasks);
    api.updateTask = jest.fn().mockImplementation(async (taskId, updates) => {
      const task = mockTasks.find((t) => t.id === taskId);
      if (!task) throw new Error('Task not found');
      return { ...task, ...updates };
    });
    api.completeTask = jest.fn().mockImplementation(async (taskId, actualHours) => {
      const task = mockTasks.find((t) => t.id === taskId);
      if (!task) throw new Error('Task not found');
      return {
        ...task,
        status: TaskStatus.COMPLETED,
        actualHours,
        completedAt: new Date().toISOString(),
      };
    });
  });

  test('should load tasks when initialized', async () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <TasksProvider>{children}</TasksProvider>
      </AuthProvider>
    );

    const { result } = renderHook(() => useTasks(), { wrapper });

    // Initially loading should be true
    expect(result.current.loading).toBe(true);

    // Wait for tasks to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check that tasks were loaded
    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.error).toBe(null);

    // Verify API calls
    expect(api.getCurrentUser).toHaveBeenCalled();
    expect(api.getTasksByUser).toHaveBeenCalledWith('A01643639');
  });

  test('should update a task', async () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <TasksProvider>{children}</TasksProvider>
      </AuthProvider>
    );

    const { result } = renderHook(() => useTasks(), { wrapper });

    // Wait for tasks to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Call updateTask
    const updates = { title: 'Updated Task Title' };
    await act(async () => {
      await result.current.updateTask('t1', updates);
    });

    // Verify API call
    expect(api.updateTask).toHaveBeenCalledWith('t1', updates);
    expect(api.getTasksByUser).toHaveBeenCalledTimes(2); // Initial + after update
  });

  test('should complete a task', async () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <TasksProvider>{children}</TasksProvider>
      </AuthProvider>
    );

    const { result } = renderHook(() => useTasks(), { wrapper });

    // Wait for tasks to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Call completeTask
    await act(async () => {
      await result.current.completeTask('t1', 10);
    });

    // Verify API call
    expect(api.completeTask).toHaveBeenCalledWith('t1', 10);
    expect(api.getTasksByUser).toHaveBeenCalledTimes(2); // Initial + after complete
  });

  test('should handle errors when updating tasks', async () => {
    // Mock console.error to prevent the error from showing in test output
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Mock API to throw an error
    api.updateTask = jest.fn().mockRejectedValue(new Error('Update failed'));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <TasksProvider>{children}</TasksProvider>
      </AuthProvider>
    );

    const { result } = renderHook(() => useTasks(), { wrapper });

    // Wait for tasks to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Call updateTask with invalid data
    await act(async () => {
      await result.current.updateTask('t1', { title: 'New Title' });
    });

    // Should set error state
    expect(result.current.error).toBe('Error updating task');

    // Check that console.error was called (optional, but validates our error was logged)
    expect(console.error).toHaveBeenCalled();

    // Restore the original console.error
    console.error = originalConsoleError;
  });
});
