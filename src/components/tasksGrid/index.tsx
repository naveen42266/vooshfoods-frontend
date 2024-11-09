import React, { useState } from 'react';

interface TaskGridProps {
    tasks:Array<any>
    deleteTask: (id: string) => void;
    editTaskModel: (id: string) => void;
    viewTaskModal: (id: string) => void;
    updateTaskStatus: (taskId: string, newStatus: string) => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({tasks, deleteTask, editTaskModel, viewTaskModal, updateTaskStatus }) => {
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedItem(taskId);
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        if (draggedItem) {
            updateTaskStatus(draggedItem, status);
            setDraggedItem(null);
        }
    };

    const renderTasks = (status: string, bgColor: string, headerColor: string) => (
        <div
            className="bg-white p-2 md:p-4 rounded shadow-md mb-4 max-h-[500px] flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
        >
            {/* Fixed header */}
            <div className={`text-xl text-white ${headerColor} w-full py-1 px-3 mb-4 sticky top-0`}>
                {status.toUpperCase()}
            </div>

            {/* Scrollable task list */}
            <div className="overflow-y-auto flex-1">
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
                        >
                            <div className="text-base font-bold capitalize">{task.title}</div>
                            <div className="text-base pb-10 capitalize">{task.description}</div>
                            <div className="text-sm">Created at: {new Date(task.createdAt).toLocaleString()}</div>
                            <div className="flex flex-row justify-end gap-2 pt-3 text-sm">
                                <button className="px-3 py-1 text-white bg-red-600 rounded-md" onClick={() => deleteTask(task.id)}>Delete</button>
                                <button className="px-3 py-1 text-white bg-blue-400 rounded-md" onClick={() => editTaskModel(task.id)}>Edit</button>
                                <button className="px-3 py-1 text-white bg-blue-600 rounded-md" onClick={() => viewTaskModal(task.id)}>View Details</button>
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
        </div>
    );
};

export default TaskGrid;
