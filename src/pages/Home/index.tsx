import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext, ThemeProvider, } from '../../context/ThemeContext';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from '../../components/CategoryFilter';
import { Link, useNavigate } from 'react-router-dom';
import { useUserDetails } from "../../context/userDetails";
import { jwtDecode } from 'jwt-decode'; // Correct way for newer versions
import { addTask, deleteTask, getAllTasks, updateStatus, updateTask } from '../../services/tasks';
import TaskModal from '../../components/addTask';
import { useTaskDetails } from '../../context/taskDetails';
import TaskGrid from '../../components/tasksGrid';
import ViewTaskModal from '../../components/viewTask';
import EditTaskModal from '../../components/editTask';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, Drawer } from '@mui/material';
import Header from '../../components/header';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    deadline: string;
    createdAt: string;
    // add other properties here
  }
  
function Home() {
    // const [filteredTodos , setFilteredTodos] = useState(todos)
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [filter, setFilter] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const categories = ['title', 'description', 'deadline'];
    // const filteredTodos = searchTodos(search).filter(todo => filterTodos(filter).includes(todo));
    const { user, updateUser } = useUserDetails();
    const { tasks, setTasks } = useTaskDetails();



    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewTaskModal, setIsViewTaskModal] = useState({ id: '', isOpen: false });
    const [isEditTaskModal, setIsEditTaskModal] = useState({ id: '', isOpen: false });

    // const [tasks, setTasks] = useState([]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const viewTaskClose = () => setIsViewTaskModal({ id: '', isOpen: false })
    const editTaskClose = () => setIsEditTaskModal({ id: '', isOpen: false })

    const handleSaveTask = async (task: any) => {
        try {
            const response = await addTask(task);
            if (response.message === 'Added Successfully') {
                console.log(response.message);
                setIsModalOpen(!isModalOpen)
                getAllTasksApi();
            } else {
                console.log("Login failed: No response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleEditTask = async (task: any) => {
        try {
            const response = await updateTask(task.id, task);
            if (response.message === 'Updated Successfully') {
                console.log(response.message);
                editTaskClose();
                getAllTasksApi();
            } else {
                console.log("Login failed: No response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleEditStatus = async (id: string, status: string) => {
        try {
            const response = await updateStatus(id, status);
            if (response.message === 'Updated Status Successfully') {
                console.log(response.message);
                getAllTasksApi();
            } else {
                console.log("No response from server");
            }
        } catch (error) {
            console.error("Updatation error:", error);
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            const response = await deleteTask(id);
            if (response === 'Deleted Successfully') {
                console.log(response.message);
                getAllTasksApi();
            } else {
                console.log("Login failed: No response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };


    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginMessage");
        localStorage.removeItem("loginTime");
        updateUser(null);
        // navigate("/signIn");  
    };


    console.log(filter, "taskstaskstasks",search)

   function todoTask() {
    if (!localStorage.getItem("authToken")) return [];
     if(filter || search){
         return tasks.filter((task) => {
            if (filter === 'title') {
                return task[filter]?.toLowerCase().includes(search.toLowerCase());
            } else  if (filter === 'description') {
                return task[filter]?.toLowerCase().includes(search.toLowerCase());
            }else  if (filter === 'deadline') {
                // return task[filter]?.toLowerCase().includes(search.toLowerCase());
            }
            else {
                // Filter by all categories
                // return categories.some((category) =>
                //     task[category]?.toLowerCase().includes(search.toLowerCase())
                // );
            }
        });
     }
     return tasks;
}

    async function getAllTasksApi() {
        try {
            const response = await getAllTasks();
            if (response) {
                console.log(response);
                setTasks(response)
            } else {
                console.log("Login failed: No response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    console.log(user, "UUUU")


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
                getAllTasksApi();
            }
        }
    }, [])



    return (
        <ThemeProvider>
            <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-black' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
                <header>
                    <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} setOpen={() => { setOpen(!open) }} />
                </header>
                <main className="container mx-auto p-4 overflow-y-auto flex-1">
                    <div className="bg-white p-2 md:p-4 rounded shadow-md mb-4 flex justify-between gap-4">
                        <div className='w-[65%] md:w-[67.5%]'><SearchBar onSearch={setSearch} /></div>
                        <div className='w-[25%] md:w-[27.5%] md:max-w-[20%]'><CategoryFilter categories={categories} onFilter={setFilter} /></div>
                    </div>
                    <button className="flex flex-row justify-center items-center gap-2 w-full md:w-auto py-2 px-10 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300" onClick={openModal}> <div className='text-2xl'>+</div> Add Task</button>
                    <TaskGrid tasks={todoTask()} deleteTask={(id: string) => { handleDeleteTask(id); }} editTaskModel={(id: string) => { setIsEditTaskModal({ id: id, isOpen: true }); }} viewTaskModal={(id: string) => { setIsViewTaskModal({ id: id, isOpen: true }); }} updateTaskStatus={(taskId: string, newStatus: string) => { handleEditStatus(taskId, newStatus) }} />
                    <TaskModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveTask} />
                    <ViewTaskModal isOpen={isViewTaskModal?.isOpen} id={isViewTaskModal?.id} onClose={viewTaskClose} />
                    <EditTaskModal isOpen={isEditTaskModal?.isOpen} id={isEditTaskModal?.id} onClose={editTaskClose} onSave={handleEditTask} />
                    <Drawer open={open} anchor="right" onClose={() => setOpen(false)}>
                        <div className="px-20 py-4">
                            {user ? (
                                <div className="flex flex-col items-center">
                                    <div className='text-2xl font-medium pb-5'>My Profile</div>
                                    {user?.gender === "Male" ? (
                                        <Avatar src={"https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg"} sx={{ height: 150, width: 150 }} className='object-cover' alt="Male Avatar" />
                                    ) : (
                                        <Avatar src={"https://w7.pngwing.com/pngs/4/736/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png"} sx={{ height: 150, width: 150 }} className='object-cover' alt="Female Avatar" />
                                    )}
                                    <div className="mt-2 text-lg font-semibold">
                                        {user?.firstName} {user?.lastName}
                                    </div>
                                    <div className="mt-2 text-lg font-semibold">
                                        {user?.email}
                                    </div>
                                    <button
                                        className="px-3 py-1 mt-3 bg-red-600 hover:bg-red-500 text-white rounded-md"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col justify-center items-center px-8">
                                    <div className="mb-2">
                                        <AccountCircleIcon fontSize="large" />
                                    </div>
                                    <div className="flex space-x-4">
                                        <Link className="px-3 py-1 text-lg font-semibold text-blue-600 rounded-md" to="/signIn">
                                            Login
                                        </Link>
                                        <Link className="px-3 py-1 text-lg font-semibold text-blue-600 rounded-md" to="/signUp">
                                            Sign Up
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Drawer>
                </main>
            </div>
        </ThemeProvider>
    );
}

export default Home;

