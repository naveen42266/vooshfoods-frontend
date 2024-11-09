import React, { useEffect, useState } from 'react';
import { useTaskDetails } from '../../context/taskDetails';

interface ViewTaskModalProps {
  isOpen?: boolean;
  id?: string;
  onClose?: () => void;
}

interface Task {
  title: string;
  priority: string;
  status: string;
  deadline: string;
  description: string;
  createdAt: string;
  id: string;
  userId: number;
}

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({ isOpen, id, onClose }) => {
  const { tasks } = useTaskDetails();
  const [findedTask, setFindedTask] = useState<Task | null>(null);

  useEffect(() => {
    const task = tasks?.find((each) => each?.id === id) as any ?? null;
    setFindedTask(task);
  }, [id, tasks]);

  if (!isOpen || !findedTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">View Task Details</h2>

        <label className="block mb-2">
          Title
          <input
            type="text"
            name="title"
            value={findedTask?.title || ""}
            className="w-full p-2 border rounded-md"
            readOnly
          />
        </label>

        <label className="block mb-4">
          Description
          <textarea
            name="description"
            value={findedTask?.description || ""}
            className="w-full p-2 border rounded-md"
            readOnly
          />
        </label>

        <label className="block mb-2">
          Priority
          <select
            name="priority"
            value={findedTask?.priority || ""}
            className="w-full p-2 border rounded-md"
            disabled
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>

        <label className="block mb-2">
          Deadline
          <input
            type="datetime-local"
            name="deadline"
            value={findedTask?.deadline || ""}
            className="w-full p-2 border rounded-md"
            readOnly
          />
        </label>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
