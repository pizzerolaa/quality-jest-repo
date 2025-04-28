// src/__tests__/TaskCard.snapshot.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import TaskCard from '../components/tasks/TaskCards';
import { TasksProvider } from '../contexts/TasksContext';
import { AuthProvider } from '../contexts/AuthContext';
import { TaskStatus } from '../types';
import { api } from '../services/api';

// Mock the api service
jest.mock('../services/api');

describe('TaskCard Snapshot', () => {
  const mockTask = {
    id: 'task1',
    title: 'Test Task',
    description: 'Description for test task',
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
  };

  beforeEach(() => {
    // Set up API mocks
    api.getCurrentUser = jest.fn().mockResolvedValue({
      id: 'A01643639',
      name: 'Sadrac Aramburo',
      role: 'Worker',
      email: 'sadrac@example.com',
      password: 'password123',
      teamId: 'team1',
    });

    api.getAllTasks = jest.fn().mockResolvedValue([mockTask]);
  });

  test('TaskCard renders correctly for TODO task', () => {
    const { container } = render(
      <AuthProvider>
        <TasksProvider>
          <TaskCard task={mockTask} />
        </TasksProvider>
      </AuthProvider>
    );

    expect(container).toMatchSnapshot();
  });

  test('TaskCard renders correctly for IN_PROGRESS task', () => {
    const inProgressTask = {
      ...mockTask,
      status: TaskStatus.IN_PROGRESS,
    };

    const { container } = render(
      <AuthProvider>
        <TasksProvider>
          <TaskCard task={inProgressTask} />
        </TasksProvider>
      </AuthProvider>
    );

    expect(container).toMatchSnapshot();
  });

  test('TaskCard renders correctly for COMPLETED task', () => {
    const completedTask = {
      ...mockTask,
      status: TaskStatus.COMPLETED,
      completedAt: '2025-04-10',
    };

    const { container } = render(
      <AuthProvider>
        <TasksProvider>
          <TaskCard task={completedTask} />
        </TasksProvider>
      </AuthProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
