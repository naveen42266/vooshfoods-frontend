import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext, ThemeProvider, } from '../../context/ThemeContext';
import useTodos from '../../hooks/useTodos';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from '../../components/CategoryFilter';
import AddTodoForm from '../../components/AddTodoForm';
import TodoItem from '../../components/TodoItem';
import { Link, useNavigate } from 'react-router-dom';
import { useUserDetails } from "../../context/userDetails";
// import jwt_decode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode'; // Correct way for newer versions
import { getAllTasks } from '../../services/tasks';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    category?: string;
    dueDate?: string;
}
function Home() {
    const { todos, suffleTodos, addTodo, toggleComplete, deleteTodo, filterTodos, searchTodos } = useTodos();
    // const [filteredTodos , setFilteredTodos] = useState(todos)
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [filter, setFilter] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [draggedItem, setDraggedItem] = useState<Todo | null>(null);
    const categories = ['work', 'personal', 'shopping', 'education', 'health', 'finance', 'hobbies'];
    const filteredTodos = searchTodos(search).filter(todo => filterTodos(filter).includes(todo));
    const { user, updateUser } = useUserDetails();
    const navigate = useNavigate();

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, todo: Todo) => {
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

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetTodo: Todo) => {
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

    // // On page load, check if the session is expired (e.g., 30 minutes)
    // const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    // const storedLoginTime = localStorage.getItem("loginTime");
    // if (storedLoginTime && Date.now() - parseInt(storedLoginTime) > sessionTimeout) {
    //     // Session expired, log out the user
    //     localStorage.removeItem("user");
    //     setUser(null);
    // }

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginMessage");
        localStorage.removeItem("loginTime");
        // Reset the user context
        updateUser(null);
        navigate("/signIn");  // Redirect to login page
    };

    async function getAllApi() {
        try {
            const response = await getAllTasks();
            if (response) {
                console.log(response.message);
            } else {
                console.log("Login failed: No response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }



    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000; 
            console.log(token)
            if (decoded.exp < currentTime) {
                localStorage.removeItem("user");
                localStorage.removeItem("authToken");
                localStorage.removeItem("loginMessage");
                localStorage.removeItem("loginTime");
            }
            else {
                getAllApi();
            }
        }
    }, [])

    return (
        <ThemeProvider>
            <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-black' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
                <header className="p-4 bg-blue-600 text-white shadow-md">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link className="text-3xl font-bold" to={"/"}>Todo</Link>
                        <div className='flex flex-row justify-end gap-4 items-center'>
                            <button
                                onClick={toggleTheme}
                                className={`px-4 py-2 ${!isDarkMode ? "bg-gray-800 text-white hover:bg-gray-100 hover:text-black" : 'bg-white text-black hover:bg-gray-700 hover:text-white'}  rounded transition-colors duration-300`}
                            >
                                {isDarkMode ? 'Light' : 'Dark'}
                            </button>
                            {user ? (
                                <div className='px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-md' onClick={handleLogout}>Logout</div>
                            ) : (
                                <div className="flex">
                                    <Link className='px-2 py-1 text-white rounded-md' to={'/signIn'}>Login</Link>
                                    <Link className='px-2 py-1 text-white rounded-md' to={'/signUp'}>SignUp</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <main className="flex-1 container mx-auto p-4">
                    <button className=" w-full md:w-auto py-2 px-10 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300" onClick={() => setOpen(true)}>Add Task</button>
                    <div className="bg-white p-2 md:p-4 rounded shadow-md mb-4 flex justify-between gap-4">
                        <div className='w-[65%] md:w-[67.5%]'><SearchBar onSearch={setSearch} /></div>
                        <div className='w-[25%] md:w-[27.5%] md:max-w-[20%]'><CategoryFilter categories={categories} onFilter={setFilter} /></div>
                        {/* {!open ? <button className="w-[15%] sm:w-[10%] py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300 block md:hidden text-xl" onClick={() => setOpen(true)}>+</button> : <button className="w-[15%] sm:w-[10%] py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors duration-300 block md:hidden text-xl" onClick={() => setOpen(false)}>x</button>} */}
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                        <div className="bg-white p-2 md:p-4 rounded shadow-md mb-4">
                            <div className='text-xl text-white bg-blue-600 w-full py-1 px-3 mb-4'>TODO</div>
                            <div className='bg-blue-200 p-2 md:p-4 rounded shadow-md mb-4'>
                                <div className='text-base font-bold'>Task 1</div>
                                <div className='text-base pb-10'>Description 1</div>
                                <div className='text-sm'>Created at: 07/11/2024, 08:20:00</div>
                                <div className='flex flex-row justify-end gap-2 pt-3 text-sm'>
                                    <div className='px-3 py-1 text-white bg-red-600 rounded-md'>Delete</div>
                                    <div className='px-3 py-1 text-white bg-blue-400 rounded-md'>Edit</div>
                                    <div className='px-3 py-1 text-white bg-blue-600 rounded-md'>View Details</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-2 md:p-4 rounded shadow-md mb-4">
                            <div className='text-xl text-white bg-blue-600 w-full py-1 px-3 mb-4'>IN PROGRESS</div>
                            <div className='bg-blue-200 p-2 md:p-4 rounded shadow-md mb-4'>
                                <div className='text-base font-bold'>Task 1</div>
                                <div className='text-base pb-10'>Description 1</div>
                                <div className='text-sm'>Created at: 07/11/2024, 08:20:00</div>
                                <div className='flex flex-row justify-end gap-2 pt-3 text-sm'>
                                    <div className='px-3 py-1 text-white bg-red-600 rounded-md'>Delete</div>
                                    <div className='px-3 py-1 text-white bg-blue-400 rounded-md'>Edit</div>
                                    <div className='px-3 py-1 text-white bg-blue-600 rounded-md'>View Details</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-2 md:p-4 rounded shadow-md mb-4">
                            <div className='text-xl text-white bg-blue-600 w-full py-1 px-3 mb-4'>DONE</div>
                            <div className='bg-blue-200 p-2 md:p-4 rounded shadow-md mb-4'>
                                <div className='text-base font-bold'>Task 1</div>
                                <div className='text-base pb-10'>Description 1</div>
                                <div className='text-sm'>Created at: 07/11/2024, 08:20:00</div>
                                <div className='flex flex-row justify-end gap-2 pt-3 text-sm'>
                                    <div className='px-3 py-1 text-white bg-red-600 rounded-md'>Delete</div>
                                    <div className='px-3 py-1 text-white bg-blue-400 rounded-md'>Edit</div>
                                    <div className='px-3 py-1 text-white bg-blue-600 rounded-md'>View Details</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {open && <div className="mb-4">
                        <AddTodoForm addTodo={addTodo} content='' handleEmitCancel={(value: boolean) => { setOpen(false) }} />
                    </div>}
                    {!open && <div >
                        {filteredTodos?.length > 0 ?
                            <ul className="space-y-2">
                                {filteredTodos.map((todo) => (
                                    <li key={todo.id} className="my-2">
                                        <div
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, todo)}
                                            onDragOver={(e) => handleDragOver(e, todo)}
                                            onDragEnd={handleDragEnd}
                                            style={{
                                                // padding: '10px',
                                                marginBottom: '5px',
                                                // border: '1px solid #ccc',
                                                backgroundColor: todo === draggedItem ? '#e0e0e0' : 'white',
                                                cursor: 'move',
                                            }}
                                        >
                                            <TodoItem todo={todo} toggleComplete={(id: string) => { toggleComplete(id) }} deleteTodo={(id: string) => { deleteTodo(id) }} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            : todos?.length === 0 && <div className='py-10 flex flex-col justify-center items-center gap-4'>
                                <div className={`${isDarkMode && 'text-white'}`}>There is no todo lists.</div>
                                <button className="py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300 w-32" onClick={() => setOpen(true)}>Add new Task</button>
                            </div>}
                    </div>}
                </main>
                <footer className='p-4 flex justify-between items-center'>
                    <a href="https://github.com/naveen42266" className='underline cursor-pointer hover:text-blue-500' target="_blank" rel="noopener noreferrer">Naveen V</a>
                    <a href="https://github.com/naveen42266/todoTask2-nowDigitalEasy" className='underline cursor-pointer hover:text-blue-500' target="_blank" rel="noopener noreferrer">GitHub Code</a>
                </footer>
            </div>
        </ThemeProvider>
    );
}

export default Home;

