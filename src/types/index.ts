export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

export enum UserRole {
    WORKER = 'Worker',
    TEAM_LEAD = 'Team Leader',
}

export interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    role: UserRole,
    teamId: string,
}

export interface Task {
    id: string;
    title: string;
    description: string;
    assignedTo: string; // userId
    developerId: string;
    developerName: string;
    status: TaskStatus;
    storyPoints: number;
    estimatedHours: number;
    actualHours: number;
    sprintId: string;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
}

export interface Sprint {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    team: string;
}

export interface Team {
    id: string;
    name: string;
    members: string[]; // array of userIds
    leaderId: string;
}