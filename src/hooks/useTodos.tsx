import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  dueDate?: string;
}

interface UseTodosReturn {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  toggleComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
  filterTodos: (category: string) => Todo[];
  searchTodos: (searchQuery: string) => Todo[];
}

const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>('');  // eslint-disable-next-line
  const [search, setSearch] = useState<string>('');  // eslint-disable-next-line

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  const addTodo = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  };

  const toggleComplete = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    const prevTodos = todos.filter(todo => todo.id !== id)
    if (prevTodos?.length === 0) {
      localStorage.setItem('todos', JSON.stringify(prevTodos))
    }
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const filterTodos = (category: string): Todo[] => {
    return todos.filter(todo => category === '' || todo.category === category);
  };

  const searchTodos = (searchQuery: string): Todo[] => {
    return todos.filter(todo => todo.text.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  useEffect(() => {
    if (todos?.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  return {
    todos: searchTodos(search).filter(todo => filterTodos(filter).includes(todo)),
    addTodo,
    toggleComplete,
    deleteTodo,
    filterTodos,
    searchTodos,
  };
};

export default useTodos;
