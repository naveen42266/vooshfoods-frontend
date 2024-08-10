import React from 'react';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    category?: string;
    dueDate?: string;
}

interface TodoItemProps {
    todo: Todo;
    toggleComplete: (id: string) => void;
    deleteTodo: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleComplete, deleteTodo }) => {
    const handleDate = (date: string): string => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    }
    return (
        <div className="flex items-center justify-between bg-white p-2 md:p-4 rounded shadow-md">
            <div className="flex items-center space-x-4">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="form-checkbox"
                />
                <span className={`ml-2 capitalize ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.text}
                    {todo.category && ` (${todo.category})`}
                    {todo.dueDate && ` - ${handleDate(todo.dueDate)}`}
                </span>
            </div>
            <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors duration-300"
            >
                Delete
            </button>
        </div>
    );
};

export default TodoItem;
