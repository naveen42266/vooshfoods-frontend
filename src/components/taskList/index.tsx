import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    deadline: string;
    createdAt: string;
}

interface TaskListProps {
    tasks: Array<Task>;
    addTask: (task: any) => Promise<void>;
    updateTaskStatus: (taskId: string, newStatus: string) => void;
    editTaskModel: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, addTask, updateTaskStatus, editTaskModel }) => {
    const { isDarkMode } = useContext(ThemeContext);

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        todo: true,
        'in progress': true,
        done: true
    });
    const [showAddTask, setShowAddTask] = useState(false);

    const [draggedItem, setDraggedItem] = useState<string>('');

    // Inline Add Task Form State
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDate, setNewTaskDate] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('todo');
    const [inProgress, setInProgress] = useState(false);

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

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

    const handleSaveInlineTask = async () => {
        if (!newTaskTitle.trim()) return;
        setInProgress(true);
        const taskObj = {
            title: newTaskTitle,
            priority: 'Medium', // default
            status: newTaskStatus,
            deadline: newTaskDate ? new Date(newTaskDate).toISOString() : '',
            description: '',
            createdAt: new Date().toISOString()
        };

        await addTask(taskObj);

        // Reset
        setNewTaskTitle('');
        setNewTaskDate('');
        setNewTaskStatus('todo');
        setShowAddTask(false);
        setInProgress(false);
    };

    const formatDueDate = (isoDate: string) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const StatusDropdown = ({ currentStatus, onChange, id }: { currentStatus: string, onChange: (v: string) => void, id: string }) => {
        return (
            <div className="relative inline-block w-[130px]">
                <select
                    value={currentStatus.toLowerCase()}
                    onChange={(e) => onChange(e.target.value)}
                    className={`appearance-none font-bold text-xs w-full py-1.5 px-3 pr-6 rounded text-center transition-colors outline-none cursor-pointer
                        ${isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-200/60 text-gray-700 border-gray-300'}
                    `}
                >
                    <option value="todo">TO-DO</option>
                    <option value="in progress">IN-PROGRESS</option>
                    <option value="done">COMPLETED</option>
                </select>
                <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        );
    };

    const renderSection = (title: string, count: number, statusKey: string, bgColorClass: string, isTodoSection = false) => {
        const isOpen = openSections[statusKey];
        const sectionTasks = tasks.filter(t => t.status.toLowerCase() === statusKey.toLowerCase());

        return (
            <div 
                className={`mb-6 rounded-t-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-[#f5f5f5]'}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, statusKey)}
            >
                <div
                    className={`px-4 py-3 cursor-pointer font-bold flex justify-between items-center ${bgColorClass}`}
                    onClick={() => toggleSection(statusKey)}
                >
                    <span className={isDarkMode ? 'text-gray-900' : 'text-gray-900'}>
                        {title} ({count})
                    </span>
                    <svg
                        className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-900' : 'text-gray-900'}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {isOpen && (
                    <div>
                        {/* Inline Add Task Form (Only in Todo Section) */}
                        {isTodoSection && (
                            <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                {!showAddTask ? (
                                    <div
                                        className="py-3 px-6 cursor-pointer flex items-center gap-2 font-semibold text-sm hover:opacity-80 transition-opacity"
                                        onClick={() => setShowAddTask(true)}
                                    >
                                        <AddIcon fontSize="small" className="text-purple-600" />
                                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>ADD TASK</span>
                                    </div>
                                ) : (
                                    <div className="py-4 px-6 flex flex-col md:flex-row items-center gap-4">
                                        <div className="flex-1 w-full">
                                            <input
                                                type="text"
                                                autoFocus
                                                placeholder="Task Title"
                                                value={newTaskTitle}
                                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveInlineTask() }}
                                                className={`w-full bg-transparent border-none outline-none font-medium placeholder-gray-400 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                                            />
                                            <div className="flex items-center gap-3 mt-4 md:mt-2">
                                                <button
                                                    disabled={inProgress || !newTaskTitle.trim()}
                                                    onClick={handleSaveInlineTask}
                                                    className="flex items-center gap-1 bg-purple-700 hover:bg-purple-800 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors disabled:opacity-50"
                                                >
                                                    ADD <KeyboardReturnIcon sx={{ fontSize: 14 }} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowAddTask(false);
                                                        setNewTaskTitle('');
                                                        setNewTaskDate('');
                                                    }}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}
                                                >
                                                    CANCEL
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0">
                                            <div className="md:w-[150px] flex items-center justify-start md:justify-center shrink-0">
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}`}>
                                                    <CalendarTodayIcon sx={{ fontSize: 14 }} />
                                                    <input
                                                        type="date"
                                                        value={newTaskDate}
                                                        onChange={(e) => setNewTaskDate(e.target.value)}
                                                        className="bg-transparent border-none outline-none text-xs w-[85px] cursor-pointer appearance-none"
                                                        style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                                                    />
                                                </div>
                                            </div>
    
                                            <div className="md:w-[150px] flex items-center justify-end md:justify-center shrink-0">
                                                <StatusDropdown currentStatus={newTaskStatus} onChange={setNewTaskStatus} id="new" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {sectionTasks.map((task, index) => (
                            <div
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task.id)}
                                className={`flex flex-col md:flex-row md:items-center justify-between py-3 px-4 border-b group cursor-grab gap-3 md:gap-0 ${isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-100'}`}
                            >
                                <div className="flex-1 flex items-center gap-3">
                                    <div className={`opacity-50 hover:opacity-100 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        <DragIndicatorIcon fontSize="small" />
                                    </div>
                                    <div
                                        className={`cursor-pointer transition-colors ${task.status.toLowerCase() === 'done' ? 'text-emerald-500' : (isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500')}`}
                                        onClick={() => {
                                            const newStatus = task.status.toLowerCase() === 'done' ? 'todo' : 'done';
                                            updateTaskStatus(task.id, newStatus);
                                        }}
                                    >
                                        {task.status.toLowerCase() === 'done' ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                                    </div>
                                    <div
                                        className={`font-medium cursor-pointer ${task.status.toLowerCase() === 'done' ? 'line-through text-gray-400' : (isDarkMode ? 'text-gray-200' : 'text-gray-800')}`}
                                        onClick={() => editTaskModel(task.id)}
                                    >
                                        {task.title}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end w-full md:w-auto pl-8 md:pl-0">
                                    <div className={`w-[150px] shrink-0 text-sm flex md:justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {formatDueDate(task.deadline)}
                                    </div>
    
                                    <div className="w-[150px] shrink-0 flex justify-end md:justify-center">
                                        <StatusDropdown
                                            currentStatus={task.status}
                                            onChange={(newStatus) => updateTaskStatus(task.id, newStatus)}
                                            id={task.id}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {sectionTasks.length === 0 && !isTodoSection && (
                            <div className={`py-4 px-6 text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                No tasks in this section.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full animate-fade-in">
            {/* Header Row */}
            <div className={`hidden md:flex items-center justify-between py-2 px-4 mb-2 font-bold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="flex-1">Task name</div>
                <div className="w-[150px] text-center">Due on</div>
                <div className="w-[150px] text-center">Task Status</div>
            </div>

            {/* Sections */}
            {renderSection('Todo', tasks.filter(t => t.status.toLowerCase() === 'todo').length, 'todo', 'bg-[#facce2]', true)}
            {renderSection('In-Progress', tasks.filter(t => t.status.toLowerCase() === 'in progress').length, 'in progress', 'bg-[#a0dcf0]', false)}
            {renderSection('Completed', tasks.filter(t => t.status.toLowerCase() === 'done').length, 'done', 'bg-[#bde8be]', false)}
        </div>
    );
};

export default TaskList;
