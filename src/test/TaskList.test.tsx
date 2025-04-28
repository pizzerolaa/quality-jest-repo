// src/__tests__/TasksList.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TasksList from '../pages/TasksList';
import { TasksProvider } from '../contexts/TasksContext';
import { AuthProvider } from '../contexts/AuthContext';
import { api } from '../services/api';
import { BrowserRouter } from 'react-router-dom';

// Mock the api service
jest.mock('../services/api');

describe('TasksList Page', () => {
  test('displays tasks assigned to the current user', async () => {
    // Mock the API responses
    const mockTasks = [
      {
        id: 'task1',
        title: 'Test Task 1',
        description: 'Description for test task 1',
        status: 'TODO',
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
      },
      {
        id: 'task2',
        title: 'Test Task 2',
        description: 'Description for test task 2',
        status: 'IN_PROGRESS',
        assignedTo: 'A01643639',
        developerId: 'A01643639',
        developerName: 'Sadrac Aramburo',
        storyPoints: 3,
        estimatedHours: 5,
        actualHours: 2,
        sprintId: 'sprint1',
        createdAt: '2025-04-02',
        updatedAt: '2025-04-03',
        completedAt: null,
      },
    ];

    // Mock getCurrentUser to return a specific user
    api.getCurrentUser = jest.fn().mockResolvedValue({
      id: 'A01643639',
      name: 'Sadrac Aramburo',
      role: 'Worker',
      email: 'sadrac@example.com',
      password: 'password123',
      teamId: 'team1',
    });

    // Mock getTasksByUser to return our mock tasks
    api.getTasksByUser = jest.fn().mockResolvedValue(mockTasks);
    api.getAllTasks = jest.fn().mockResolvedValue(mockTasks);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TasksProvider>
            <TasksList />
          </TasksProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Check that loading message is displayed initially
    expect(screen.getByText(/Loading tasks/i)).toBeInTheDocument();

    // Wait for tasks to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    // Verify API was called correctly
    expect(api.getCurrentUser).toHaveBeenCalled();
    expect(api.getTasksByUser).toHaveBeenCalledWith('A01643639');
  });
});
