import React, { useEffect, useState } from 'react';
import { useTaskDetails } from '../../context/taskDetails';
import { ScaleLoader } from 'react-spinners';

interface EditTaskModalProps {
    isOpen?: boolean;
    id?: string;
    onClose?: () => void;
    onSave?: (task: Task) => void;
}

interface Task {
    title: string;
    priority: string;
    status: string;
    deadline: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    userId: number;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, id, onClose, onSave }) => {
    const { tasks } = useTaskDetails();
    const [task, setTask] = useState<Task | null>(null);
    const [inProgress, setInProgress] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTask((prev) => prev ? { ...prev, [name]: value } : null);
    };

    const handleSave = () => {
        setInProgress(true)
        if (task) {
            const updatedTask = {
                ...task,
                updatedAt: new Date().toISOString(),
            };
            if (onSave) onSave(updatedTask);
            setInterval(() => {
                setInProgress(false);
            }, 3000);
        }
    };

    const isChanges = () => {
        const before = tasks?.find((each) => each?.id === id) ?? null;
        if ((before?.title !== task?.title && task?.title !== '') || before?.description !== task?.description || before?.deadline !== task?.deadline || before?.priority !== task?.priority) {
            return true;
        }
        return false
    }

    useEffect(() => {
        const currentTask = tasks?.find((each) => each?.id === id) ?? null;
        setTask(currentTask as any);
    }, [id, tasks]);

    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Edit Task Details</h2>

                <label className="block mb-2">
                    Title
                    <input
                        type="text"
                        name="title"
                        value={task?.title || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </label>

                <label className="block mb-4">
                    Description
                    <textarea
                        name="description"
                        value={task?.description || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </label>

                <label className="block mb-2">
                    Priority
                    <select
                        name="priority"
                        value={task?.priority || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
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
                        value={task?.deadline || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </label>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md"
                    >
                        Close
                    </button>
                    {inProgress ?
                        <button
                            disabled
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                        >
                            <ScaleLoader height={17} width={6} className="" color="white" />
                        </button> :
                        <button
                            onClick={() => { if (isChanges()) { handleSave(); } }}
                            className={`px-4 py-2 ${isChanges() ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-300 hover:bg-gray-400 text-gray-700"} rounded-md`}
                        >
                            Update
                        </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
