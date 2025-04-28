// src/test/utils/testUtils.tsx
import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { TasksProvider } from '../../contexts/TasksContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { api } from '../../services/api';

// Mock API before rendering components
beforeEach(() => {
  // Mock getCurrentUser to avoid act warnings
  api.getCurrentUser = jest.fn().mockResolvedValue({
    id: 'A01643639',
    name: 'Sadrac Aramburo',
    role: 'Worker',
    email: 'sadrac@example.com',
    password: 'password123',
    teamId: 'team1',
  });
});

// Custom render function that includes providers
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <TasksProvider>{ui}</TasksProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Wrapper component for hooks testing
export const AllProvidersWrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      <TasksProvider>{children}</TasksProvider>
    </AuthProvider>
  </BrowserRouter>
);
