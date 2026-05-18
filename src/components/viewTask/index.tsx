import React, { useEffect, useState, useContext } from 'react';
import { useTaskDetails } from '../../context/taskDetails';
import { ThemeContext } from '../../context/ThemeContext';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import TitleIcon from '@mui/icons-material/Title';

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
  const { isDarkMode } = useContext(ThemeContext);
  const { tasks } = useTaskDetails();
  const [findedTask, setFindedTask] = useState<Task | null>(null);

  useEffect(() => {
    const task = tasks?.find((each) => each?.id === id) as any ?? null;
    setFindedTask(task);
  }, [id, tasks]);

  if (!isOpen || !findedTask) return null;

  const priorityColors: Record<string, string> = {
    'High': 'text-rose-500 bg-rose-500/10',
    'Medium': 'text-amber-500 bg-amber-500/10',
    'Low': 'text-emerald-500 bg-emerald-500/10',
  };

  const getPriorityColor = (priority: string) => {
    return priorityColors[priority] || 'text-gray-500 bg-gray-500/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Task Details</h2>
            <button 
                onClick={onClose}
                className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            >
                <CloseIcon fontSize="small" />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-500 mb-1">
                    <TitleIcon fontSize="small" /> Title
                </div>
                <div className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {findedTask?.title}
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-500 mb-1">
                    <FormatAlignLeftIcon fontSize="small" /> Description
                </div>
                <div className={`text-base leading-relaxed whitespace-pre-wrap p-3 rounded-lg ${isDarkMode ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                    {findedTask?.description || 'No description provided.'}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-indigo-500 mb-1">
                        <FlagIcon fontSize="small" /> Priority
                    </div>
                    <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(findedTask?.priority || '')}`}>
                            {findedTask?.priority || 'None'}
                        </span>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-indigo-500 mb-1">
                        <AccessTimeIcon fontSize="small" /> Deadline
                    </div>
                    <div className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {findedTask?.deadline ? new Date(findedTask.deadline).toLocaleString() : 'No deadline'}
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 flex justify-end gap-3 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
            <button
                onClick={onClose}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
