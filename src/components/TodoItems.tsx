import { Draggable } from "react-drag-reorder";
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
    const { suffleTodos, toggleComplete, deleteTodo } = useTodos();
    return (
        <div>
            <Draggable
                onPosChange={(currentPos, newPos) => { currentPos !== newPos && suffleTodos(currentPos, newPos) }}
            >
                {filteredTodos.map(todo => (
                    <div key={todo?.id} className="my-2">
                        <TodoItem todo={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo} />
                    </div>
                ))}
            </Draggable>
        </div>
    )
}

export default TodoItems