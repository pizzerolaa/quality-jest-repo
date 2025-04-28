// src/__tests__/CompleteTask.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../components/tasks/TaskCards';
import { TasksProvider } from '../contexts/TasksContext';
import { AuthProvider } from '../contexts/AuthContext';
import { api } from '../services/api';
import { TaskStatus } from '../types';

// Mock the api service
jest.mock('../services/api');

describe('Complete Task Functionality', () => {
  const mockTask = {
    id: 'task1',
    title: 'Test Task',
    description: 'Description for test task',
    status: TaskStatus.IN_PROGRESS,
    assignedTo: 'A01643639',
    developerId: 'A01643639',
    developerName: 'Sadrac Aramburo',
    storyPoints: 5,
    estimatedHours: 8,
    actualHours: 0,
    sprintId: 'sprint1',
    createdAt: '2025-04-01',
    updatedAt: '2025-04-01',
    completedAt: null,
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set up the API mocks
    api.completeTask = jest.fn().mockImplementation(async (taskId, actualHours) => {
      return {
        ...mockTask,
        status: TaskStatus.COMPLETED,
        actualHours,
        completedAt: new Date().toISOString(),
      };
    });

    api.getAllTasks = jest.fn().mockResolvedValue([mockTask]);
    api.getCurrentUser = jest.fn().mockResolvedValue({
      id: 'A01643639',
      name: 'Sadrac Aramburo',
      role: 'Worker',
      email: 'sadrac@example.com',
      password: 'password123',
      teamId: 'team1',
    });
  });

  test('can mark a task as completed with actual hours', async () => {
    render(
      <AuthProvider>
        <TasksProvider>
          <TaskCard task={mockTask} />
        </TasksProvider>
      </AuthProvider>
    );

    // Find the actual hours input by placeholder instead of label
    const hoursInput = screen.getByPlaceholderText('Hours');

    // Use fireEvent instead of userEvent for this case
    fireEvent.change(hoursInput, { target: { value: '10' } });

    // Click the complete button
    const completeButton = screen.getByText('Complete');
    fireEvent.click(completeButton);

    // Verify the API was called correctly
    await waitFor(() => {
      expect(api.completeTask).toHaveBeenCalledWith('task1', 10);
    });
  });
});
