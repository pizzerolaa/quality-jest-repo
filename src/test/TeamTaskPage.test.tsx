// src/__tests__/TeamTaskPage.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TeamTasksPage from '../pages/TeamTaskPage';
import { TasksProvider } from '../contexts/TasksContext';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { api } from '../services/api';
import { UserRole, TaskStatus } from '../types';

// Mock the api service
jest.mock('../services/api');

describe('TeamTasksPage', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('shows access denied for non-team leader users', async () => {
    // Mock getCurrentUser to return a worker
    api.getCurrentUser = jest.fn().mockResolvedValue({
      id: 'A01643742',
      name: 'Santos Arellano',
      role: UserRole.WORKER,
      email: 'santos@example.com',
      password: 'password123',
      teamId: 'team1',
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TasksProvider>
            <TeamTasksPage />
          </TasksProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText('This page is only available for Team Leaders.')).toBeInTheDocument();
    });
  });

  test('displays pending tasks for team leader', async () => {
    // Mock getCurrentUser to return a team leader
    api.getCurrentUser = jest.fn().mockResolvedValue({
      id: 'A01643639',
      name: 'Sadrac Aramburo',
      role: UserRole.TEAM_LEAD,
      email: 'sadrac@example.com',
      password: 'password123',
      teamId: 'team1',
    });

    // Mock getAllTasks to return some tasks
    const mockTasks = [
      {
        id: 't1',
        title: 'Pending Task 1',
        description: 'Description for pending task 1',
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
      {
        id: 't2',
        title: 'Completed Task',
        description: 'Description for completed task',
        assignedTo: 'A01643639',
        developerId: 'A01643639',
        developerName: 'Sadrac Aramburo',
        status: TaskStatus.COMPLETED,
        storyPoints: 3,
        estimatedHours: 5,
        actualHours: 4,
        sprintId: 'sprint1',
        createdAt: '2025-03-25',
        updatedAt: '2025-03-30',
        completedAt: '2025-03-30',
      },
      {
        id: 't3',
        title: 'Pending Task 2',
        description: 'Description for pending task 2',
        assignedTo: 'A01643639',
        developerId: 'A01643639',
        developerName: 'Sadrac Aramburo',
        status: TaskStatus.TODO,
        storyPoints: 4,
        estimatedHours: 6,
        actualHours: 0,
        sprintId: 'sprint1',
        createdAt: '2025-04-02',
        updatedAt: '2025-04-02',
        completedAt: null,
      },
    ];

    api.getAllTasks = jest.fn().mockResolvedValue(mockTasks);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TasksProvider>
            <TeamTasksPage />
          </TasksProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Team tasks to do')).toBeInTheDocument();
    });

    // Should show the count of pending tasks
    await waitFor(() => {
      expect(screen.getByText(/Total pending tasks: 2/i)).toBeInTheDocument();
    });

    // Should show the pending tasks
    expect(screen.getByText('Pending Task 1')).toBeInTheDocument();
    expect(screen.getByText('Pending Task 2')).toBeInTheDocument();

    // Should not show the completed task
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
  });

  test('displays empty state when no pending tasks', async () => {
    // Mock getCurrentUser to return a team leader
    api.getCurrentUser = jest.fn().mockResolvedValue({
      id: 'A01643639',
      name: 'Sadrac Aramburo',
      role: UserRole.TEAM_LEAD,
      email: 'sadrac@example.com',
      password: 'password123',
      teamId: 'team1',
    });

    // Mock getAllTasks to return only completed tasks
    const mockTasks = [
      {
        id: 't2',
        title: 'Completed Task',
        description: 'Description for completed task',
        assignedTo: 'A01643639',
        developerId: 'A01643639',
        developerName: 'Sadrac Aramburo',
        status: TaskStatus.COMPLETED,
        storyPoints: 3,
        estimatedHours: 5,
        actualHours: 4,
        sprintId: 'sprint1',
        createdAt: '2025-03-25',
        updatedAt: '2025-03-30',
        completedAt: '2025-03-30',
      },
    ];

    api.getAllTasks = jest.fn().mockResolvedValue(mockTasks);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TasksProvider>
            <TeamTasksPage />
          </TasksProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Team tasks to do')).toBeInTheDocument();
    });

    // Should show the empty state message
    await waitFor(() => {
      expect(screen.getByText('No pending tasks! Your team is up to date.')).toBeInTheDocument();
    });
  });
});
