import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeamTasksPage from '../pages/TeamTaskPage';
import { TasksProvider } from '../contexts/TasksContext';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { api } from '../services/api';
import { UserRole, TaskStatus } from '../types';

// Mock the API
jest.mock('../services/api');

// Mock the TasksContext
const mockTasks = [
  {
    id: 'task1',
    title: 'Task 1',
    description: 'This is task 1',
    status: TaskStatus.IN_PROGRESS,
    assignedTo: 'user2',
    developerId: 'user2',
    developerName: 'John Developer',
    storyPoints: 3,
    estimatedHours: 5,
    actualHours: 0,
    sprintId: 'sprint1',
    createdAt: '2025-04-01',
    updatedAt: '2025-04-01',
    completedAt: null,
  },
  {
    id: 'task2',
    title: 'Task 2',
    description: 'This is task 2',
    status: TaskStatus.TODO,
    assignedTo: 'user3',
    developerId: 'user3',
    developerName: 'Jane Developer',
    storyPoints: 2,
    estimatedHours: 3,
    actualHours: 0,
    sprintId: 'sprint1',
    createdAt: '2025-04-01',
    updatedAt: '2025-04-01',
    completedAt: null,
  }
];

jest.mock('../contexts/TasksContext', () => ({
  ...jest.requireActual('../contexts/TasksContext'),
  useTasks: () => ({
    tasks: mockTasks, // Now mockTasks is defined
    loading: false,
    error: null,
    refreshTasks: jest.fn(),
  }),
}));

describe('TeamTasksPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows access denied for non-team leader users', async () => {
    // Mock getCurrentUser to return a non-team leader
    api.getCurrentUser = jest.fn().mockResolvedValue({
      id: 'user1',
      name: 'Regular User',
      role: UserRole.WORKER,
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

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText('This page is only available for Team Leaders.')).toBeInTheDocument();
    });
  });

  test('displays pending tasks for team leader', async () => {
    // Mock getCurrentUser to return a team leader
    api.getCurrentUser = jest.fn().mockResolvedValue({
      id: 'user1',
      name: 'Team Leader',
      role: UserRole.TEAM_LEAD,
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
      expect(screen.getByText('Team tasks to do')).toBeInTheDocument();
    });

    // Check if tasks are displayed
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Total pending tasks: 2')).toBeInTheDocument();
  });


});