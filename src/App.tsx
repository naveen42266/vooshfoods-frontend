import React, { useState, useContext, useEffect } from 'react';
import useTodos from './hooks/useTodos';
import AddTodoForm from './components/AddTodoForm';
import TodoItem from './components/TodoItem';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
// import { Drawer } from '@mui/material';

function App() {
  const { todos, addTodo, toggleComplete, deleteTodo, filterTodos, searchTodos } = useTodos();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [filter, setFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const categories = ['work', 'personal', 'shopping', 'education', 'health', 'finance', 'hobbies'];
  // const [width, setWidth] = useState<number>(0)
  const filteredTodos = searchTodos(search).filter(todo => filterTodos(filter).includes(todo));
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const updateWidth = () => { setWidth(window.innerWidth) };
  //     updateWidth();
  //     window.addEventListener('resize', updateWidth);
  //     return () => window.removeEventListener('resize', updateWidth);
  //   }
  // }, [])
  useEffect(() => {
    setOpen(false)
  }, [todos?.length])

  return (
    <ThemeProvider>
      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-black' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
        <header className="p-4 bg-blue-600 text-white shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold">Todo List</h1>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors duration-300"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </header>
        <main className="flex-1 container mx-auto p-4">
          <div className="bg-white p-2 md:p-4 rounded shadow-md mb-4 flex justify-start gap-4">
            <div className='w-[65%] md:w-[67.5%]'><SearchBar onSearch={setSearch} /></div>
            <div className='w-[25%] md:w-[27.5%] md:max-w-[20%]'><CategoryFilter categories={categories} onFilter={setFilter} /></div>
            {!open ? <button className="w-[15%] sm:w-[10%] py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300 block md:hidden text-xl" onClick={() => setOpen(true)}>+</button> : <button className="w-[15%] sm:w-[10%] py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors duration-300 block md:hidden text-xl" onClick={() => setOpen(false)}>x</button>}
            {!open ? <button className="w-[10%] py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300 hidden md:block" onClick={() => setOpen(true)}>Add</button> : <button className="w-[10%] py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors duration-300 hidden md:block" onClick={() => setOpen(false)}>Close</button>}
          </div>
          {/* <div className="mb-4">
            <CategoryFilter categories={['work', 'personal', 'shopping']} onFilter={setFilter} />
          </div> */}
          {open && <div className="mb-4">
            <AddTodoForm addTodo={addTodo} content='' handleEmitCancel={(value: boolean) => { setOpen(false) }} />
          </div>}
          {!open && <div >
            {filteredTodos?.length > 0 ? <ul className="space-y-2">
              {filteredTodos.map(todo => (
                <li key={todo.id}>
                  <TodoItem todo={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo} />
                </li>
              ))}
            </ul> : todos?.length == 0 && <div className='py-10 flex flex-col justify-center items-center gap-4'>
              <div className={`${isDarkMode && 'text-white'}`}>There is no todo lists.</div>
              <button className="py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300 w-32" onClick={() => setOpen(true)}>Add new Task</button>
            </div>}
          </div>}
        </main>
      </div>
      {/* <Drawer anchor={width >= 768 ? "right" : "bottom"} open={open} onClose={() => setOpen(false)}>
        <div className="">
          <AddTodoForm addTodo={addTodo} content={width >= 768 ? "right" : "bottom"} />
        </div>
      </Drawer> */}
    </ThemeProvider>
  );
}

export default App;

