// src/__tests__/TeamReportsPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import TeamReportsPage from '../pages/TeamReportsPages';
import { api } from '../services/api';
import { TaskStatus } from '../types';

// Mock the api service
jest.mock('../services/api');

describe('TeamReportsPage', () => {
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
    {
      id: 't3',
      title: 'Fix bug in login form',
      description: 'Fix validation errors in login form',
      assignedTo: 'A01643639',
      developerId: 'A01643639',
      developerName: 'Sadrac Aramburo',
      status: TaskStatus.IN_PROGRESS,
      storyPoints: 3,
      estimatedHours: 4,
      actualHours: 2,
      sprintId: 'sprint1',
      createdAt: '2025-03-26',
      updatedAt: '2025-03-28',
      completedAt: null,
    },
  ];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set up API mocks
    api.getAllTasks = jest.fn().mockResolvedValue(mockTasks);
  });

  test('displays team KPIs correctly', async () => {
    render(<TeamReportsPage />);

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Team Report')).toBeInTheDocument();
    });

    // Verify API was called
    expect(api.getAllTasks).toHaveBeenCalled();

    // First wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    // Now check Team KPI section
    await waitFor(() => {
      expect(screen.getByText('Team KPI')).toBeInTheDocument();
    });

    // Check completion rate (2 completed out of 3 total tasks = 66.7%)
    await waitFor(() => {
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    // Check estimated hours (8 + 16 + 4 = 28)
    await waitFor(() => {
      expect(screen.getByText('28')).toBeInTheDocument();
    });

    // Check actual hours (7 + 14 + 2 = 23)
    await waitFor(() => {
      expect(screen.getByText('23')).toBeInTheDocument();
    });
  });

  test('displays developer KPIs correctly', async () => {
    render(<TeamReportsPage />);

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('KPI by Developer')).toBeInTheDocument();
    });

    // Find the developer table directly instead of using closest('section')
    // The KPI by Developer heading is likely directly in the div, not in a section element
    const developerTable = screen.getByRole('table');

    // Now use within() to scope our queries to just the developer table
    const tableWithin = within(developerTable);

    // Check that the developer table has the required columns
    expect(tableWithin.getByText('Developer')).toBeInTheDocument();
    expect(tableWithin.getByText('Total Tasks')).toBeInTheDocument();
    expect(tableWithin.getByText('Completed')).toBeInTheDocument();
    expect(tableWithin.getByText('% Completed')).toBeInTheDocument();
    expect(tableWithin.getByText('Estimated Hours')).toBeInTheDocument();
    expect(tableWithin.getByText('Actual Hours')).toBeInTheDocument();

    // Check Sadrac Aramburo's stats (2 tasks, 1 completed, 50% completion rate, 12 estimated hours, 9 actual hours)
    // Find the row containing 'Sadrac Aramburo'
    const sadracRow = screen.getByText('Sadrac Aramburo').closest('tr');

    // Now query within that specific row
    expect(within(sadracRow).getByText('2')).toBeInTheDocument(); // Total tasks
    expect(within(sadracRow).getByText('1')).toBeInTheDocument(); // Completed tasks
    expect(within(sadracRow).getByText('50.0%')).toBeInTheDocument(); // Completion rate
    expect(within(sadracRow).getByText('12')).toBeInTheDocument(); // Estimated hours
    expect(within(sadracRow).getByText('9')).toBeInTheDocument(); // Actual hours

    // Check Santos Arellano's stats (1 task, 1 completed, 100% completion rate, 16 estimated hours, 14 actual hours)
    const santosRow = screen.getByText('Santos Arellano').closest('tr');
    expect(within(santosRow).getByText('100.0%')).toBeInTheDocument(); // Completion rate
    expect(within(santosRow).getByText('16')).toBeInTheDocument(); // Estimated hours
    expect(within(santosRow).getByText('14')).toBeInTheDocument(); // Actual hours
  });

  test('can filter by different sprints', async () => {
    // Update the mock to return different tasks for sprint2
    const sprint2Tasks = [
      {
        id: 't4',
        title: 'Add new feature',
        description: 'Add new feature to the app',
        assignedTo: 'A01643639',
        developerId: 'A01643639',
        developerName: 'Sadrac Aramburo',
        status: TaskStatus.COMPLETED,
        storyPoints: 8,
        estimatedHours: 20,
        actualHours: 18,
        sprintId: 'sprint2',
        createdAt: '2025-04-07',
        updatedAt: '2025-04-15',
        completedAt: '2025-04-15',
      },
    ];

    api.getAllTasks = jest.fn().mockImplementation(async () => {
      // First call, return mockTasks (for sprint1)
      // Second call, when sprint is changed, return sprint2Tasks
      if (api.getAllTasks.mock.calls.length === 1) {
        return mockTasks;
      } else {
        return sprint2Tasks;
      }
    });

    render(<TeamReportsPage />);

    // Wait for initial page load
    await waitFor(() => {
      expect(screen.getByText('Team Report')).toBeInTheDocument();
    });

    // Change the selected sprint to sprint2
    const selectElement = screen.getByLabelText('Sprint:');
    fireEvent.change(selectElement, { target: { value: 'sprint2' } });

    // Wait for the data to load for sprint2
    await waitFor(() => {
      expect(api.getAllTasks).toHaveBeenCalledTimes(2);
    });

    // Use more specific queries for elements that appear multiple times
    await waitFor(() => {
      // Should show 1 completed task out of 1 total task (100%)
      expect(screen.getByText('1 / 1')).toBeInTheDocument();

      // Find the specific Estimated Hours value in the Team KPI section
      // First find the Team KPI section
      const teamKpiSection = screen.getByText('Team KPI').closest('div');
      // Then find the Estimated Hours section within it
      const estimatedHoursDiv = within(teamKpiSection).getByText('Estimated Hours').closest('div');
      // Finally, check the value
      expect(within(estimatedHoursDiv).getByText('20')).toBeInTheDocument();

      // Similarly for Actual Hours
      const actualHoursDiv = within(teamKpiSection).getByText('Actual Hours').closest('div');
      expect(within(actualHoursDiv).getByText('18')).toBeInTheDocument();
    });
  });
});
