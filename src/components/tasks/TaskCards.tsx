import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { useTasks } from '../../contexts/TasksContext';

interface TaskCardsProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardsProps> = ({ task }) => {
  const { updateTask, completeTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [actualHours, setActualHours] = useState(task.actualHours);

  const statusColors = {
    [TaskStatus.TODO]: 'bg-yellow-100 border-yellow-400',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 border-blue-400',
    [TaskStatus.COMPLETED]: 'bg-green-100 border-green-400',
  };

  const handleSave = async () => {
    await updateTask(task.id, editedTask);
    setIsEditing(false);
  };

  const handleComplete = async () => {
    await completeTask(task.id, actualHours);
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 mb-4 shadow-sm bg-white">
        <div className="mb-3">
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="task-title"
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="task-developer" className="block text-sm font-medium text-gray-700">
            Developer
          </label>
          <input
            id="task-developer"
            type="text"
            value={editedTask.developerName}
            onChange={(e) => setEditedTask({ ...editedTask, developerName: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="task-story-points" className="block text-sm font-medium text-gray-700">
            Story Points
          </label>
          <input
            id="task-story-points"
            type="number"
            value={editedTask.storyPoints}
            onChange={(e) =>
              setEditedTask({ ...editedTask, storyPoints: parseInt(e.target.value) || 0 })
            }
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="task-estimated-hours" className="block text-sm font-medium text-gray-700">
            Estimated Hours
          </label>
          <input
            id="task-estimated-hours"
            type="number"
            value={editedTask.estimatedHours}
            onChange={(e) =>
              setEditedTask({ ...editedTask, estimatedHours: parseInt(e.target.value) || 0 })
            }
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-4 mb-4 shadow-sm ${statusColors[task.status]}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">{task.title}</h3>
        <span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-200">
          {task.status}
        </span>
      </div>

      <p className="text-gray-600 mt-1">{task.description}</p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm text-gray-500">Developer:</p>
          <p>{task.developerName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Story Points:</p>
          <p>{task.storyPoints}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Estimated Hours:</p>
          <p>{task.estimatedHours}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Actual Hours:</p>
          <p>{task.actualHours}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {task.status !== TaskStatus.COMPLETED && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <div className="flex items-center">
              <input
                type="number"
                value={actualHours}
                onChange={(e) => setActualHours(parseInt(e.target.value))}
                className="border rounded w-16 px-2 py-1 mr-2"
                placeholder="Hours"
              />
              <button
                onClick={handleComplete}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Complete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
