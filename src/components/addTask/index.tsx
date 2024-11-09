import React, { useEffect, useState } from 'react';

interface TaskModalProps {
    isOpen?: boolean,
    onClose?: () => void,
    onSave?: (task: Task) => void
}

interface Task {
    title: string;
    priority: string;
    status: string;
    deadline: string;
    description: string;
    createdAt: string;

    // title: req.body.title,
    // description: req.body.description,
    // status: req.body.status,
    // priority: req.body.priority,
    // deadline: req.body.deadline,
    // createdAt: req.body.createdAt,
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave }) => {
    const [task, setTask] = useState<Task>({
        title: '',
        priority: 'High',
        status: '',
        deadline: '',
        description: '',
        createdAt: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        let addTask = { ...task };
        addTask.status = 'todo'
        addTask.createdAt = new Date().toISOString();
        setTask({
            title: '',
            priority: 'High',
            status: '',
            deadline: '',
            description: '',
            createdAt: ''
        })
        if (onSave) onSave(addTask);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Task Details</h2>

                <label className="block mb-2">
                    Title
                    <input
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </label>

                
                <label className="block mb-4">
                    Description
                    <textarea
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </label>

                <label className="block mb-2">
                    Priority
                    <select
                        name="priority"
                        value={task.priority}
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
                        value={task.deadline}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </label>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Update Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
