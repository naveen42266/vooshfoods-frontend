import React, { useEffect, useState, useContext } from 'react';
import { useTaskDetails } from '../../context/taskDetails';
import { ScaleLoader } from 'react-spinners';
import { ThemeContext } from '../../context/ThemeContext';
import CloseIcon from '@mui/icons-material/Close';

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
    const { isDarkMode } = useContext(ThemeContext);
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
            setTimeout(() => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
            <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                
                {/* Header */}
                <div className={`px-6 py-4 flex items-center justify-between border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Edit Task</h2>
                    <button 
                        onClick={onClose}
                        className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        <CloseIcon fontSize="small" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={task?.title || ''}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-colors outline-none ${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                        <textarea
                            name="description"
                            value={task?.description || ''}
                            onChange={handleChange}
                            rows={3}
                            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-colors outline-none resize-none ${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
                            <select
                                name="priority"
                                value={task?.priority || ''}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-colors outline-none ${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Deadline</label>
                            <input
                                type="datetime-local"
                                name="deadline"
                                value={task?.deadline || ''}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-colors outline-none ${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 flex justify-end gap-3 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
                    <button
                        onClick={onClose}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200 bg-gray-100'}`}
                    >
                        Cancel
                    </button>
                    {inProgress ? (
                        <button
                            disabled
                            className="px-6 py-2.5 bg-indigo-500/70 text-white rounded-lg cursor-not-allowed flex items-center justify-center min-w-[100px]"
                        >
                            <ScaleLoader height={14} width={4} color="white" />
                        </button>
                    ) : (
                        <button
                            onClick={() => { if (isChanges()) { handleSave(); } }}
                            className={`px-5 py-2.5 font-medium rounded-lg transition-all shadow-sm ${isChanges() ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        >
                            Update Task
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
