// src/__tests__/Dashboard.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { TasksProvider } from '../contexts/TasksContext';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { api } from '../services/api';
import { UserRole, TaskStatus } from '../types';

// Mock the api service
jest.mock('../services/api');

describe('Dashboard Page', () => {
  const mockTasks = [
    {
      id: 'task1',
      title: 'Test Task 1',
      description: 'Description for test task 1',
      status: TaskStatus.TODO,
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
      status: TaskStatus.COMPLETED,
      assignedTo: 'A01643639',
      developerId: 'A01643639',
      developerName: 'Sadrac Aramburo',
      storyPoints: 3,
      estimatedHours: 5,
      actualHours: 6,
      sprintId: 'sprint1',
      createdAt: '2025-04-02',
      updatedAt: '2025-04-03',
      completedAt: '2025-04-05',
    },
  ];

  test('displays dashboard for regular worker', async () => {
    // Mock getCurrentUser to return a worker
    api.getCurrentUser = jest.fn().mockResolvedValue({
      id: 'A01643742',
      name: 'Santos Arellano',
      role: UserRole.WORKER,
      email: 'santos@example.com',
      password: 'password123',
      teamId: 'team1',
    });

    api.getAllTasks = jest.fn().mockResolvedValue(mockTasks);
    api.getTasksByUser = jest.fn().mockResolvedValue(mockTasks);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TasksProvider>
            <Dashboard />
          </TasksProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for dashboard to load
    await waitFor(() => {
      // Should show welcome message with user name
      expect(screen.getByText(/Welcome, Santos Arellano/i)).toBeInTheDocument();

      // Should show access message for worker
      expect(screen.getByText(/Access to your tasks and custom dashboard/i)).toBeInTheDocument();

      // Verify dashboard KPIs are displayed
      expect(screen.getByText('Assignee Tasks')).toBeInTheDocument();
      expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
      expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
    });
  });

  test('displays dashboard for team leader', async () => {
    // Mock getCurrentUser to return a team leader
    api.getCurrentUser = jest.fn().mockResolvedValue({
      id: 'A01643639',
      name: 'Sadrac Aramburo',
      role: UserRole.TEAM_LEAD,
      email: 'sadrac@example.com',
      password: 'password123',
      teamId: 'team1',
    });

    api.getAllTasks = jest.fn().mockResolvedValue(mockTasks);
    api.getTasksByUser = jest.fn().mockResolvedValue(mockTasks);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TasksProvider>
            <Dashboard />
          </TasksProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for dashboard to load
    await waitFor(() => {
      // Should show welcome message with user name
      expect(screen.getByText(/Welcome, Sadrac Aramburo/i)).toBeInTheDocument();

      // Should show access message for team leader
      expect(screen.getByText(/U have access to team leader panel/i)).toBeInTheDocument();

      // Verify dashboard KPIs are displayed
      expect(screen.getByText('Assignee Tasks')).toBeInTheDocument();
      expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
      expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
    });
  });
});
