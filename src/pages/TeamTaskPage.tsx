import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TasksContext';
import { UserRole } from '../types';
import TaskCard from '../components/tasks/TaskCards';

const TeamTasksPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { tasks, loading, error, loadTeamTasks } = useTasks();
  
  useEffect(() => {
    const loadPendingTasks = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        const allTasks = await api.getAllTasks();
        const filteredTasks = allTasks.filter(
          (task) => task.status === TaskStatus.TODO && task.assignedTo === currentUser.id
        );
        setPendingTasks(filteredTasks);
      } catch (err) {
        setError('Error loading tasks. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.role === UserRole.TEAM_LEAD) {
      loadTeamTasks();
    }
  }, [currentUser]);

  if (!currentUser || currentUser.role !== UserRole.TEAM_LEAD) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>This page is only available for Team Leaders.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-10">Loading team tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  
  const pendingTasks = tasks.filter(task => task.status !== 'COMPLETED');
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Team tasks to do</h1>

      {pendingTasks.length === 0 ? (
        <div className="bg-green-50 p-4 rounded-lg text-center">
          No pending tasks! Your team is up to date.
        </div>
      ) : (
        <>
          <p className="mb-4">Total pending tasks: {pendingTasks.length}</p>

          <div>
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamTasksPage;
