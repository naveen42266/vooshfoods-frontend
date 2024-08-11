import React, { DragEvent, useState } from "react";
import useTodos from "../hooks/useTodos";
import TodoItem from "./TodoItem";

interface TodoItemsProps {
    filteredTodos: Todo[]
}

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    category?: string;
    dueDate?: string;
}

const TodoItems: React.FC<TodoItemsProps> = ({ filteredTodos }) => {
    const { todos, suffleTodos, toggleComplete, deleteTodo } = useTodos();
    const [draggedItem, setDraggedItem] = useState<Todo | null>(null);

    const handleDragStart = (e: DragEvent<HTMLDivElement>, todo: Todo) => {
        setDraggedItem(todo);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
        const dragImage = e.currentTarget.cloneNode(true) as HTMLDivElement;
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 20, 20);
        setTimeout(() => document.body.removeChild(dragImage), 0);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>, targetTodo: Todo) => {
        e.preventDefault();
        if (draggedItem && draggedItem !== targetTodo) {
            const currentPosition = todos.findIndex(todo => todo.id === draggedItem.id);
            const newPosition = todos.findIndex(todo => todo.id === targetTodo.id);
            suffleTodos(currentPosition, newPosition);
        }
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    console.log(todos)

    return (
        <div>
            <ul className="space-y-2">
                {filteredTodos.map((todo) => (
                    <li key={todo.id} className="my-2">
                        <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, todo)}
                            onDragOver={(e) => handleDragOver(e, todo)}
                            onDragEnd={handleDragEnd}
                            style={{
                                padding: '10px',
                                marginBottom: '5px',
                                border: '1px solid #ccc',
                                backgroundColor: todo === draggedItem ? '#e0e0e0' : 'white',
                                cursor: 'move',
                            }}
                        >
                            <TodoItem todo={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TodoItems;