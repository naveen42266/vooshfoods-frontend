import React, { useState, useContext } from 'react';
import StarIcon from '@mui/icons-material/Star';
import Tooltip from '@mui/material/Tooltip';
import { Dialog } from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { ThemeContext } from '../../context/ThemeContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface TaskGridProps {
    tasks: Array<any>
    deleteTask: (id: string) => void;
    editTaskModel: (id: string) => void;
    viewTaskModal: (id: string) => void;
    updateTaskStatus: (taskId: string, newStatus: string) => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({ tasks, deleteTask, editTaskModel, viewTaskModal, updateTaskStatus }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const [draggedItem, setDraggedItem] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [status, setStatus] = React.useState('');
    const [statusChange, setStatusChange] = React.useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedItem(taskId);
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        const task = tasks?.find((ele) => ele.id === draggedItem);
        if (task && task.status !== status) {
            updateTaskStatus(draggedItem, status);
            setDraggedItem('');
        }
    };

    const handleChangeStatus = () => {
        const task = tasks?.find((ele) => ele.id === draggedItem);
        if (task && task.status !== statusChange) {
            updateTaskStatus(draggedItem, statusChange);
            setDraggedItem('');
            handleClose();
            setStatusChange('');
            setStatus('')
        }
    }

    const renderTasks = (status: string, themeColors: any) => (
        <div
            className={`p-3 md:p-4 rounded-xl border flex flex-col transition-colors duration-300 ${isDarkMode ? themeColors.darkBg : themeColors.lightBg} ${isDarkMode ? themeColors.darkBorder : themeColors.lightBorder}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
        >
            {/* Fixed header */}
            <div className={`flex items-center justify-between mb-4 pb-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0`}>
                <div className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? themeColors.darkText : themeColors.lightText}`}>
                    {status}
                </div>
                <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isDarkMode ? themeColors.darkBadgeBg : themeColors.lightBadgeBg} ${isDarkMode ? themeColors.darkText : themeColors.lightText}`}>
                    {tasks.filter((task) => task.status.toLowerCase() === status.toLowerCase()).length}
                </div>
            </div>

            {/* Scrollable task list */}
            <div className="overflow-y-auto scroll-smooth flex-1 space-y-3 min-h-[150px]">
                {tasks
                    .filter((task) => task.status.toLowerCase() === status.toLowerCase())
                    .map((task) => (
                        <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            style={{ cursor: 'grab' }}
                            className={`group relative p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-200 hover:border-gray-600' : 'bg-white border border-gray-100 text-gray-800 hover:border-gray-300'}`}
                        >
                            <div className='flex flex-row justify-between items-start mb-2'>
                                <div className="flex items-start gap-2 max-w-[70%]">
                                    <div className={`mt-0.5 cursor-grab opacity-40 hover:opacity-100 shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        <DragIndicatorIcon fontSize="small" />
                                    </div>
                                    <div className="text-base font-semibold leading-tight line-clamp-2 pr-2">{task.title}</div>
                                </div>
                                <div className='flex flex-shrink-0 gap-1'>
                                    {task.priority === 'High' && (
                                        <Tooltip title="High Priority" arrow>
                                            <div className="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 p-1 rounded-md flex items-center justify-center">
                                                <StarIcon fontSize="small" />
                                            </div>
                                        </Tooltip>
                                    )}
                                    <div 
                                        onClick={() => { handleOpen(); setDraggedItem(task?.id); setStatus(task?.status); setStatusChange(''); }}
                                        className={`p-1 rounded-md cursor-pointer transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                                    >
                                        {status.toLowerCase() === 'todo' ? (
                                            <KeyboardDoubleArrowRightIcon fontSize="small" />
                                        ) : status.toLowerCase() === 'done' ? (
                                            <KeyboardDoubleArrowLeftIcon fontSize="small" />
                                        ) : (
                                            <div className="flex -space-x-1">
                                                <KeyboardDoubleArrowLeftIcon fontSize="small" />
                                                <KeyboardDoubleArrowRightIcon fontSize="small" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {task.description}
                            </div>
                            
                            <div className="space-y-1 mb-3">
                                {task?.deadline && (
                                    <div className={`text-xs font-medium px-2 py-1 rounded-md inline-block ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
                                        Due: {new Date(task?.deadline).toLocaleDateString()}
                                    </div>
                                )}
                                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {task?.updatedAt ? `Updated ${new Date(task.updatedAt).toLocaleDateString()}` : `Created ${new Date(task.createdAt).toLocaleDateString()}`}
                                </div>
                            </div>
                            
                            {/* Action Buttons - reveal on hover for cleaner look, or display as subtle icons */}
                            <div className={`flex flex-row justify-end gap-2 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                <Tooltip title="Delete">
                                    <button 
                                        className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                                        onClick={() => { handleOpenDelete(); setId(task?.id) }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </button>
                                </Tooltip>
                                <Tooltip title="Edit">
                                    <button 
                                        className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                        onClick={() => { editTaskModel(task?.id); handleClose(); }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </button>
                                </Tooltip>
                                <Tooltip title="View">
                                    <button 
                                        className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/30' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                        onClick={() => { viewTaskModal(task?.id); handleClose(); }}
                                    >
                                        <VisibilityIcon fontSize="small" />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );

    const themeColors = {
        todo: {
            lightBg: 'bg-slate-50', darkBg: 'bg-gray-900/50',
            lightBorder: 'border-slate-200', darkBorder: 'border-gray-800',
            lightText: 'text-slate-700', darkText: 'text-gray-300',
            lightBadgeBg: 'bg-slate-200', darkBadgeBg: 'bg-gray-800'
        },
        inProgress: {
            lightBg: 'bg-indigo-50/50', darkBg: 'bg-indigo-900/10',
            lightBorder: 'border-indigo-100', darkBorder: 'border-indigo-900/30',
            lightText: 'text-indigo-700', darkText: 'text-indigo-300',
            lightBadgeBg: 'bg-indigo-100', darkBadgeBg: 'bg-indigo-900/50'
        },
        done: {
            lightBg: 'bg-emerald-50/50', darkBg: 'bg-emerald-900/10',
            lightBorder: 'border-emerald-100', darkBorder: 'border-emerald-900/30',
            lightText: 'text-emerald-700', darkText: 'text-emerald-300',
            lightBadgeBg: 'bg-emerald-100', darkBadgeBg: 'bg-emerald-900/50'
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {renderTasks('todo', themeColors.todo)}
            {renderTasks('in progress', themeColors.inProgress)}
            {renderTasks('done', themeColors.done)}

            {/* Change Status Modal */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                    <h3 className="text-lg font-semibold mb-4">Change Task Status</h3>
                    <div className="mb-6">
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Move from <span className="text-indigo-500 capitalize">{status}</span> to:
                        </label>
                        <select
                            value={statusChange || status}
                            onChange={(e) => setStatusChange(e.target.value)}
                            className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                        >
                            <option value="todo">Todo</option>
                            <option value="in progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleClose}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { if (status !== statusChange && statusChange !== "") { handleChangeStatus(); } }}
                            disabled={status === statusChange || statusChange === ""}
                            className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${status === statusChange || statusChange === "" ? (isDarkMode ? 'bg-indigo-500/50 text-indigo-200 cursor-not-allowed' : 'bg-indigo-300 cursor-not-allowed') : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm'}`}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={openDelete} onClose={handleCloseDelete} fullWidth maxWidth="xs">
                <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                    <div className="flex items-center gap-3 mb-4 text-rose-500">
                        <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full">
                            <DeleteIcon />
                        </div>
                        <h3 className="text-lg font-semibold">Delete Task</h3>
                    </div>
                    <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Are you sure you want to delete <span className='font-semibold text-rose-500 line-clamp-1'>"{tasks?.find((ele) => ele.id === id)?.title}"</span>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleCloseDelete}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { deleteTask(id); handleCloseDelete(); }}
                            className="px-4 py-2 rounded-lg font-medium text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default TaskGrid;
