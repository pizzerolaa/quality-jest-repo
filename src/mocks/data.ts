import { Task, TaskStatus, User, UserRole, Sprint, Team } from '../types';

//mock a los users
export const mockUsers: User[] = [
  {
    id: 'A01643639',
    name: 'Sadrac Aramburo',
    role: UserRole.TEAM_LEAD,
    email: 'sadrac@example.com',
    password: 'password123',
    teamId: 'team1',
  },
  {
    id: 'A01643742',
    name: 'Santos Arellano',
    role: UserRole.WORKER,
    email: 'santos@example.com',
    password: 'password123',
    teamId: 'team1',
  },
  {
    id: 'A01643685',
    name: 'Fernando Antonio',
    role: UserRole.WORKER,
    email: 'fher@example.com',
    password: 'password123',
    teamId: 'team2',
  },
  {
    id: 'A00836723',
    name: 'Diego Villa',
    role: UserRole.WORKER,
    email: 'diego@example.com',
    password: 'password123',
    teamId: 'team3',
  },
  {
    id: 'A01643651',
    name: 'Roberto Teigeiro',
    role: UserRole.TEAM_LEAD,
    email: 'robert@example.com',
    password: 'password123',
    teamId: 'team4',
  },
];

//mock a los sprints
export const mockSprints: Sprint[] = [
  {
    id: 'sprint1',
    name: 'Sprint 1',
    startDate: '2025-03-24',
    endDate: '2025-04-04',
    team: 'team1',
  },
  {
    id: 'sprint2',
    name: 'Sprint 2',
    startDate: '2025-04-07',
    endDate: '2025-04-25',
    team: 'team2',
  },
  {
    id: 'sprint3',
    name: 'Sprint 3',
    startDate: '2025-04-28',
    endDate: '2025-05-09',
    team: 'team3',
  },
];

//mock a los teams
export const mockTeams: Team[] = [
  {
    id: 'team1',
    name: 'Frontend Team',
    members: ['A01643639', 'A01643742'],
    leaderId: 'A01643639',
  },
  {
    id: 'team2',
    name: 'Telegram Bot Team',
    members: ['A01643685'],
    leaderId: 'A01643685',
  },
  {
    id: 'team3',
    name: 'UI/UX Team',
    members: ['A00836723'],
    leaderId: 'A00836723',
  },
  {
    id: 'team4',
    name: 'Backend Team',
    members: ['A01643651'],
    leaderId: 'A01643651',
  },
];

//mock a las tasks
export const mockTasks: Task[] = [
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
    title: 'Make the deployment',
    description: 'Deploy the application to the production server.',
    assignedTo: 'A01643651',
    developerId: 'A01643651',
    developerName: 'Roberto Teigeiro',
    status: TaskStatus.COMPLETED,
    storyPoints: 5,
    estimatedHours: 10,
    actualHours: 5,
    sprintId: 'sprint2',
    createdAt: '2025-04-07',
    updatedAt: '2025-04-21',
    completedAt: '2025-04-24',
  },
  {
    id: 't4',
    title: 'Add new commands to the bot',
    description: 'Add new commands to the Telegram bot for better user interaction.',
    assignedTo: 'A01643685',
    developerId: 'A01643685',
    developerName: 'Fernando Antonio',
    status: TaskStatus.COMPLETED,
    storyPoints: 7,
    estimatedHours: 10,
    actualHours: 12,
    sprintId: 'sprint2',
    createdAt: '2025-04-09',
    updatedAt: '2025-04-22',
    completedAt: '2025-04-23',
  },
  {
    id: 't5',
    title: 'Design the KPI Dashboard',
    description: 'Create a dashboard to display key performance indicators.',
    assignedTo: 'A00836723',
    developerId: 'A00836723',
    developerName: 'Diego Villa',
    status: TaskStatus.TODO,
    storyPoints: 5,
    estimatedHours: 10,
    actualHours: 0,
    sprintId: 'sprint3',
    createdAt: '2025-04-28',
    updatedAt: '2025-04-28',
    completedAt: null,
  },
  {
    id: 't6',
    title: 'Configure CI/CD pipeline',
    description: 'Set up a CI/CD pipeline for automatic deployment.',
    assignedTo: 'A01643651',
    developerId: 'A01643651',
    developerName: 'Roberto Teigeiro',
    status: TaskStatus.TODO,
    storyPoints: 8,
    estimatedHours: 12,
    actualHours: 0,
    sprintId: 'sprint3',
    createdAt: '2025-04-28',
    updatedAt: '2025-04-28',
    completedAt: null,
  },
];
