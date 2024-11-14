import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import Tooltip from '@mui/material/Tooltip';
// import { Modal }  from '@mui/material/Modal/Modal';
import { Dialog } from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
interface TaskGridProps {
    tasks: Array<any>
    deleteTask: (id: string) => void;
    editTaskModel: (id: string) => void;
    viewTaskModal: (id: string) => void;
    updateTaskStatus: (taskId: string, newStatus: string) => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({ tasks, deleteTask, editTaskModel, viewTaskModal, updateTaskStatus }) => {
    const [draggedItem, setDraggedItem] = useState<string>('');
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState('');
    const [statusChange, setStatusChange] = React.useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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

    const renderTasks = (status: string, bgColor: string, headerColor: string) => (
        <div
            className="bg-white p-2 md:p-4 rounded shadow-md mb-4 md:max-h-[500px] flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
        >
            {/* Fixed header */}
            <div className={`text-xl text-white font-bold ${headerColor} w-full py-1 px-3 mb-4 sticky top-0`}>
                {status.toUpperCase()}
            </div>

            {/* Scrollable task list */}
            <div className="overflow-y-auto scroll-smooth flex-1">
                {tasks
                    .filter((task) => task.status.toLowerCase() === status.toLowerCase())
                    .map((task) => (
                        <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            style={{
                                // marginBottom: '5px',
                                backgroundColor: draggedItem === task.id ? '#e0e0e0' : '',
                                cursor: 'move',
                            }}
                            className={`${bgColor} p-2 md:p-4 rounded shadow-md mb-4`}
                            onClick={() => {  }}
                        >
                            <div className='flex flex-row justify-between items-center'>
                                <div className="text-base font-bold capitalize">{task.title}</div>
                                <div className='flex'>
                                    {task.priority === 'High' ? (
                                        <Tooltip title="High Priority" arrow>
                                            <StarIcon className='text-red-500' />
                                        </Tooltip>) : ''}
                                    <div onClick={() => { handleOpen(); setDraggedItem(task?.id); setStatus(task?.status); setStatusChange('');}}>
                                        {status.toLowerCase() === 'todo' ? (
                                            <div>
                                                <KeyboardDoubleArrowRightIcon />
                                            </div>
                                        ) : status.toLowerCase() === 'done' ? (
                                            <div>
                                                <KeyboardDoubleArrowLeftIcon />
                                            </div>
                                        ) : (
                                            <div>
                                                <KeyboardDoubleArrowLeftIcon />
                                                <KeyboardDoubleArrowRightIcon />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-base pb-10 capitalize">{task.description}</div>
                            <div className="text-base font-medium text-red-500">{"Deadline at: " + new Date(task?.deadline).toLocaleString()}</div>
                            <div className="text-sm">{task?.updatedAt ? (<>Updated at: {new Date(task.updatedAt).toLocaleString()}</>) : (<>Created at: {new Date(task.createdAt).toLocaleString()}</>)}</div>
                            <div className="flex flex-row justify-end gap-2 pt-3 text-sm" onClick={() => { setOpen(false) }}>
                                <button className="px-3 py-1 text-white bg-red-600 rounded-md" onClick={() => { deleteTask(task?.id); handleClose(); }}>Delete</button>
                                <button className="px-3 py-1 text-white bg-blue-400 rounded-md" onClick={() => { editTaskModel(task?.id); handleClose(); }}>Edit</button>
                                <button className="px-3 py-1 text-white bg-blue-600 rounded-md" onClick={() => { viewTaskModal(task?.id); handleClose(); }}>View Details</button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {renderTasks('todo', 'bg-yellow-200', 'bg-yellow-500')}
            {renderTasks('in progress', 'bg-orange-200', 'bg-orange-600')}
            {renderTasks('done', 'bg-green-200', 'bg-green-600')}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                fullWidth
                maxWidth={window.innerWidth >= 768 ? "sm" : 'lg'}
            >
                <div className='p-3'>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center gap-1 text-xs sm:text-sm'>Change this Status<div className='font-semibold text-blue-600 capitalize'>{status}</div>to </div>
                        <select
                            name="status"
                            value={statusChange ? statusChange : status}
                            onChange={(e) => { setStatusChange(e?.target?.value) }}
                            className="w-[100px] md:w-[150px] py-1 md:py-2 my-2 border rounded-md text-xs sm:text-sm"
                        >
                            <option value="todo">Todo</option>
                            <option value="in progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => { handleClose(); }}
                            className="px-4 py-1 md:py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-xs sm:text-sm"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => { if (status !== statusChange && statusChange !== "") { handleChangeStatus(); } }}
                            className={`px-4 py-1 md:py-2 ${status === statusChange || statusChange === "" ? 'bg-gray-300 hover:bg-gray-400 text-gray-700' : 'bg-green-500 hover:bg-green-600 text-white '}  rounded-md text-xs sm:text-sm`}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default TaskGrid;
