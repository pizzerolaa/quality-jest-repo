// src/__tests__/TaskCard.test.tsx
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

describe('TaskCard Component', () => {
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
    // Reset mocks
    jest.clearAllMocks();

    // Set up the API mocks
    api.updateTask = jest.fn().mockImplementation(async (taskId, updates) => {
      return { ...mockTask, ...updates, updatedAt: new Date().toISOString() };
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

  test('renders task card with correct information', async () => {
    render(
      <AuthProvider>
        <TasksProvider>
          <TaskCard task={mockTask} />
        </TasksProvider>
      </AuthProvider>
    );

    // Verify the task information is displayed correctly
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Description for test task')).toBeInTheDocument();
    expect(screen.getByText('Sadrac Aramburo')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Story points
    expect(screen.getByText('8')).toBeInTheDocument(); // Estimated hours
    expect(screen.getByText('0')).toBeInTheDocument(); // Actual hours
    expect(screen.getByText('TODO')).toBeInTheDocument();
  });

  test('can edit and update task details', async () => {
    render(
      <AuthProvider>
        <TasksProvider>
          <TaskCard task={mockTask} />
        </TasksProvider>
      </AuthProvider>
    );

    // Click edit button
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Find all the input fields
    const titleInput = screen.getByDisplayValue('Test Task');
    const storyPointsInput = screen.getByDisplayValue('5');
    const estimatedHoursInput = screen.getByDisplayValue('8');

    // Change the values
    fireEvent.change(titleInput, { target: { value: 'Updated Task Title' } });
    fireEvent.change(storyPointsInput, { target: { value: '8' } });
    fireEvent.change(estimatedHoursInput, { target: { value: '12' } });

    // Save the changes
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Verify the API was called with the right parameters
    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalledWith(
        'task1',
        expect.objectContaining({
          title: 'Updated Task Title',
          storyPoints: 8,
          estimatedHours: 12,
        })
      );
    });
  });

  test('can cancel editing without saving changes', async () => {
    render(
      <AuthProvider>
        <TasksProvider>
          <TaskCard task={mockTask} />
        </TasksProvider>
      </AuthProvider>
    );

    // Click edit button
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Find the title input and change it
    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Changed Title That Should Not Be Saved' } });

    // Cancel the edit
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Verify the API was NOT called
    expect(api.updateTask).not.toHaveBeenCalled();

    // Verify the original title is still displayed
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('shows validation error for empty title', async () => {
    // Track console errors to verify our error was thrown
    const originalError = console.error;
    const mockConsoleError = jest.fn();
    console.error = mockConsoleError;

    // Update updateTask mock to better simulate validation
    api.updateTask = jest.fn().mockImplementation(async (taskId, updates) => {
      // Don't update if title is empty
      if (!updates.title) {
        throw new Error('Title is required');
      }
      return { ...mockTask, ...updates, updatedAt: new Date().toISOString() };
    });

    render(
      <AuthProvider>
        <TasksProvider>
          <TaskCard task={mockTask} />
        </TasksProvider>
      </AuthProvider>
    );

    // Click edit button
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Find the title input and clear it
    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: '' } });

    // Try to save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Verify the API was called
    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalled();
    });

    // Verify the error was logged to console
    await waitFor(() => {
      expect(mockConsoleError).toHaveBeenCalled();
      // Check if any call includes our error message
      const errorCalled = mockConsoleError.mock.calls.some((call) =>
        call.some((arg) => arg instanceof Error && arg.message === 'Title is required')
      );
      expect(errorCalled).toBe(true);
    });

    // Based on the actual component's HTML, it looks like the component is
    // reverting back to view mode after the error, so we should check for the Edit button
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    // Restore console.error
    console.error = originalError;
  });
});
