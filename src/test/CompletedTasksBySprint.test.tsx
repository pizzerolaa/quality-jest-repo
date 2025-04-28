// src/__tests__/CompletedTasksBySprint.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompletedTasksBySprint from '../pages/CompletedTasksBySprint';
import { api } from '../services/api';
import { TaskStatus } from '../types';

// Mock the api service
jest.mock('../services/api');

describe('CompletedTasksBySprint Page', () => {
  const mockTasks = [
    {
      id: 't1',
      title: 'Implement login page',
      description: 'Create a login page with email and password fields.',
      assignedTo: 'A01643639',
      developerId: 'A01643639',
      developerName: 'Sadrac Aramburo',
      status: TaskStatus.COMPLETED,
      storyPoints: 5,
      estimatedHours: 8,
      actualHours: 7,
      sprintId: 'sprint1',
      createdAt: '2025-03-24',
      updatedAt: '2025-03-27',
      completedAt: '2025-03-30',
    },
    {
      id: 't2',
      title: 'Implement dashboard page',
      description: 'Create a dashboard page with user statistics.',
      assignedTo: 'A01643742',
      developerId: 'A01643742',
      developerName: 'Santos Arellano',
      status: TaskStatus.COMPLETED,
      storyPoints: 6,
      estimatedHours: 16,
      actualHours: 14,
      sprintId: 'sprint1',
      createdAt: '2025-03-24',
      updatedAt: '2025-03-29',
      completedAt: '2025-04-03',
    },
  ];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set up API mocks
    api.getTasksBySprint = jest.fn().mockImplementation(async (sprintId) => {
      if (sprintId === 'sprint1') {
        return mockTasks;
      }
      return [];
    });
  });

  test('displays completed tasks for the selected sprint with all required information', async () => {
    render(<CompletedTasksBySprint />);

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Completed Tasks by Sprints')).toBeInTheDocument();
    });

    // Check dropdown has loaded with sprint options
    const selectElement = screen.getByLabelText('Select Sprint:');
    expect(selectElement).toBeInTheDocument();

    // Select a sprint (sprint1 should be selected by default in the mock)

    // Wait for the tasks to load
    await waitFor(() => {
      // Verify API was called
      expect(api.getTasksBySprint).toHaveBeenCalledWith('sprint1');
    });

    // Check that the table has the required columns
    expect(screen.getByText('Task Name')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Estimated Hours')).toBeInTheDocument();
    expect(screen.getByText('Actual Hours')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();

    // Check that task data is displayed correctly
    expect(screen.getByText('Implement login page')).toBeInTheDocument();
    expect(screen.getByText('Sadrac Aramburo')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument(); // Estimated hours for task 1
    expect(screen.getByText('7')).toBeInTheDocument(); // Actual hours for task 1

    expect(screen.getByText('Implement dashboard page')).toBeInTheDocument();
    expect(screen.getByText('Santos Arellano')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument(); // Estimated hours for task 2
    expect(screen.getByText('14')).toBeInTheDocument(); // Actual hours for task 2
  });

  test('handles sprints with no completed tasks', async () => {
    // Update the mock to return no tasks for sprint2
    api.getTasksBySprint = jest.fn().mockImplementation(async (sprintId) => {
      if (sprintId === 'sprint1') {
        return mockTasks;
      }
      return [];
    });

    render(<CompletedTasksBySprint />);

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Completed Tasks by Sprints')).toBeInTheDocument();
    });

    // Change the selected sprint to sprint2
    const selectElement = screen.getByLabelText('Select Sprint:');
    fireEvent.change(selectElement, { target: { value: 'sprint2' } });

    // Wait for the API call to complete
    await waitFor(() => {
      expect(api.getTasksBySprint).toHaveBeenCalledWith('sprint2');
    });

    // Check that the "no tasks" message is displayed
    expect(
      screen.getByText('No completed tasks found for the selected sprint.')
    ).toBeInTheDocument();
  });
});
