import React, { useState, useContext, useEffect, useCallback } from 'react';
import { ThemeContext, ThemeProvider, } from '../../context/ThemeContext';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from '../../components/CategoryFilter';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserDetails } from "../../context/userDetails";
import { jwtDecode } from 'jwt-decode'; // Correct way for newer versions
import { addTask, deleteTask, getAllTasks, updateStatus, updateTask } from '../../services/tasks';
import TaskModal from '../../components/addTask';
import { useTaskDetails } from '../../context/taskDetails';
import TaskGrid from '../../components/tasksGrid';
import TaskList from '../../components/taskList';
import ViewTaskModal from '../../components/viewTask';
import EditTaskModal from '../../components/editTask';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import AssignmentIcon from '@mui/icons-material/Assignment';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Avatar, Drawer, LinearProgress, linearProgressClasses, styled } from '@mui/material';
import Header from '../../components/header';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

type TaskKey = keyof Task;

function Home() {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [filter, setFilter] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
    const { user, updateUser } = useUserDetails();
    const { tasks, setTasks } = useTaskDetails();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewTaskModal, setIsViewTaskModal] = useState({ id: '', isOpen: false });
    const [isEditTaskModal, setIsEditTaskModal] = useState({ id: '', isOpen: false });
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    let taskCompletionPercent = calculateCompletionRate(tasks);
    const categories = ['title', 'description', 'deadline'];


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
                toast.success('Task Added successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                console.log(response.message);
                toast.error(response.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("handleSaveTask error:", error);
            toast.error("Task Creatation failed", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleEditTask = async (task: any) => {
        try {
            const response = await updateTask(task.id, task);
            if (response.message === 'Updated Successfully') {
                console.log(response.message);
                editTaskClose();
                getAllTasksApi();
                toast.success('Task Updated successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                console.log("handleEditTask");
                toast.error(response.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("handleEditTask error:", error);
            toast.error("Task Updatation failed", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleEditStatus = async (id: string, status: string) => {
        try {
            const response = await updateStatus(id, status);
            if (response.message === 'Updated Status Successfully') {
                console.log(response.message);
                getAllTasksApi();
                toast.success('Task Status Updated successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                console.log("handleEditStatus");
                toast.error(response.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("Updatation error:", error);
            toast.error("Task Status Updatation failed", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            const response = await deleteTask(id);
            if (response === 'Deleted Successfully') {
                console.log(response.message);
                getAllTasksApi();
                toast.success('Task Deleted successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                console.log("handleDeleteTask");
                toast.error(response.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("handleDeleteTask error:", error);
            toast.error("Task Deteletion failed", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginMessage");
        localStorage.removeItem("loginTime");
        updateUser(null);
        // navigate("/signIn"); 
        setOpen(false)
        toast.success('User logged out successfully', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    function todoTask() {
        if (!localStorage.getItem("authToken")) return [];

        if (filter || search) {
            return tasks.filter((task: Task) => {
                if (filter === 'title' || filter === 'description') {
                    return (task[filter as TaskKey] as string)?.toLowerCase().includes(search.toLowerCase());
                } else if (filter === 'deadline') {
                    return (task["deadline"] as string)?.toLowerCase().includes(search);
                } else {
                    // Filter by all categories
                    return (categories as TaskKey[]).some((category) =>
                        (task[category] as string)?.toLowerCase().includes(search.toLowerCase())
                    );
                }
            });
        }

        return tasks;
    }

    const getAllTasksApi = useCallback(async () => {
        try {
            const response = await getAllTasks();

            if (response) {
                setTasks(response);
            } else {
                console.log("Login failed: No response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }, [setTasks]);

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 12,
        borderRadius: 6,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 6,
            backgroundColor: taskCompletionPercent > 49.9 ? '#10B981' : '#F43F5E',
            transition: 'transform .4s ease-in-out',
        },
    }));

    function calculateCompletionRate(tasks: any) {
        if (tasks.length === 0) return 0;

        const completedTasks = tasks.filter((task: { status: string; }) => task.status === "done").length;
        const completionRate = (completedTasks / tasks.length) * 100;

        return completionRate.toFixed(2) as any;
    }


    useEffect(() => {
        if (token) {
            const decoded: any = jwtDecode(token);

            const userData: any = {
                userId: decoded.id,
                email: decoded.email,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                profilePicture: decoded.profilePicture,
            };

            updateUser(userData);

            toast.success('User logged in successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            localStorage.setItem("authToken", token);

            navigate("/", { replace: true });
        }
    }, [token, navigate, updateUser]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                localStorage.removeItem("user");
                localStorage.removeItem("authToken");
                localStorage.removeItem("loginMessage");
                localStorage.removeItem("loginTime");
            } else {
                getAllTasksApi();
            }
        }

        const loginMessage = localStorage.getItem("loginMessage");

        if (loginMessage) {
            toast.success('User logged in successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            localStorage.removeItem("loginMessage");
        }
    }, [getAllTasksApi]);

    return (
        <ThemeProvider>
            <ToastContainer />
            <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-black' : 'bg-gray-100 text-gray-900'} transition-colors duration-300 hidden-scrollbar`}>
                <header className='sticky top-0 left-0 right-0 z-10'>
                    <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} setOpen={() => { setOpen(!open) }} />
                </header>
                <main className='overflow-y-scroll hidden-scrollbar'>
                    {user ? (
                        <main className="container mx-auto p-4 overflow-y-auto flex-1">
                            {/* <div className="mb-6">
                            <h1 className={`flex items-center gap-2 text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                <AssignmentIcon /> TaskBuddy
                            </h1>
                        </div> */}

                            <div className="flex items-center gap-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                                <button
                                    className={`flex items-center gap-2 pb-2 font-bold transition-colors border-b-2 ${viewMode === 'list' ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <ViewListIcon fontSize="small" /> List
                                </button>
                                <button
                                    className={`flex items-center gap-2 pb-2 font-bold transition-colors border-b-2 ${viewMode === 'board' ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                                    onClick={() => setViewMode('board')}
                                >
                                    <ViewColumnIcon fontSize="small" /> Board
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                                <div className={`text-sm font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Filter by:</div>

                                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full md:w-auto">
                                    <div className='w-full sm:w-[140px]'>
                                        <CategoryFilter categories={categories} onFilter={(filter) => { setFilter(filter); setSearch('') }} />
                                    </div>
                                    {filter === 'deadline' ? (
                                        <div className='w-full sm:w-[140px]'>
                                            <input
                                                type="date"
                                                name="deadline"
                                                value={search}
                                                onChange={(e) => setSearch(e?.target?.value)}
                                                className={`w-full p-2.5 rounded-full border focus:ring-2 focus:ring-indigo-500 transition-colors outline-none text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                            />
                                        </div>
                                    ) : (
                                        <div className='w-full sm:w-[200px]'>
                                            <SearchBar onSearch={setSearch} />
                                        </div>
                                    )}
                                </div>

                                {/* {viewMode === 'board' && ( */}
                                <button
                                    className="mt-2 md:mt-0 md:ml-auto flex items-center justify-center gap-2 px-5 py-2.5 w-full sm:w-auto bg-indigo-600 text-white font-medium rounded-full shadow-sm hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5"
                                    onClick={openModal}
                                >
                                    <span className="text-xl leading-none">+</span>
                                    <span>New Task</span>
                                </button>
                                {/* )} */}
                            </div>

                            {viewMode === 'board' && (
                                <div className={`p-5 rounded-2xl shadow-sm mb-6 border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="w-full">
                                            <div className="flex justify-between items-end mb-2">
                                                <div className={`font-semibold text-lg ${isDarkMode ? "text-white" : 'text-gray-800'}`}>
                                                    Your Progress
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-2xl font-bold ${taskCompletionPercent > 49.9 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {taskCompletionPercent}%
                                                    </span>
                                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Completed
                                                    </span>
                                                </div>
                                            </div>
                                            <BorderLinearProgress variant="determinate" value={Number(taskCompletionPercent)} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {viewMode === 'list' ? (
                                <TaskList
                                    tasks={todoTask()}
                                    addTask={handleSaveTask}
                                    updateTaskStatus={(taskId: string, newStatus: string) => { handleEditStatus(taskId, newStatus) }}
                                    editTaskModel={(id: string) => { setIsEditTaskModal({ id: id, isOpen: true }); }}
                                />
                            ) : (
                                <TaskGrid tasks={todoTask()} deleteTask={(id: string) => { handleDeleteTask(id); }} editTaskModel={(id: string) => { setIsEditTaskModal({ id: id, isOpen: true }); }} viewTaskModal={(id: string) => { setIsViewTaskModal({ id: id, isOpen: true }); }} updateTaskStatus={(taskId: string, newStatus: string) => { handleEditStatus(taskId, newStatus) }} />
                            )}
                            <TaskModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveTask} />
                            <ViewTaskModal isOpen={isViewTaskModal?.isOpen} id={isViewTaskModal?.id} onClose={viewTaskClose} />
                            <EditTaskModal isOpen={isEditTaskModal?.isOpen} id={isEditTaskModal?.id} onClose={editTaskClose} onSave={handleEditTask} />
                        </main>) :
                        <main className='flex flex-col justify-center items-center space-y-6 p-10'>
                            <div className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                                No User Found
                            </div>
                            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-center max-w-md`}>
                                It seems you’re not logged in. If you already have an account, please log in below. Otherwise, create a new account to get started.
                            </p>
                            <div className="flex flex-col items-center space-y-4">
                                <Link
                                    className="px-6 py-2 text-lg font-semibold text-blue-600 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors duration-300"
                                    to="/signIn"
                                >
                                    Login
                                </Link>
                                <span className="text-lg font-medium text-gray-500">or</span>
                                <Link
                                    className="px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors duration-300"
                                    to="/signUp"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </main>
                    }
                </main>
                <Drawer open={open} anchor="right" onClose={() => setOpen(false)}>
                    <div className={`w-[85vw] sm:w-[350px] flex flex-col h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
                        {/* Drawer Header with Close Button */}
                        <div className={`p-4 flex justify-between items-center border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                            <h2 className="text-xl font-bold tracking-tight">My Profile</h2>
                            <button 
                                onClick={() => setOpen(false)}
                                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'}`}
                            >
                                <CloseIcon fontSize="small" />
                            </button>
                        </div>
                        
                        {/* Drawer Body */}
                        <div className="flex-1 overflow-y-auto">
                            {user ? (
                                <div className="flex flex-col items-center p-6 space-y-6">
                                    
                                    {/* Avatar section with gradient ring */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-sm opacity-70 animate-pulse"></div>
                                        <div className={`relative p-1 rounded-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                            <Avatar
                                                src={user?.gender === "Male"
                                                    ? "https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg"
                                                    : user?.gender === "Female" ? "https://w7.pngwing.com/pngs/4/736/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png" : user?.profilePicture ? user?.profilePicture : ''}
                                                sx={{ height: 110, width: 110 }}
                                                className="object-cover shadow-lg"
                                                alt={`${user?.gender} Avatar`}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* User Details */}
                                    <div className="text-center w-full space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h3>
                                            <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full capitalize ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                                                {user?.gender || 'User'}
                                            </span>
                                        </div>
                                        
                                        <div className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
                                            <EmailIcon fontSize="small" className="text-indigo-500" />
                                            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                                {user?.email}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Action Button */}
                                    <button
                                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-xl font-bold transition-all duration-300 hover:shadow-sm group"
                                        onClick={handleLogout}
                                    >
                                        <LogoutIcon fontSize="small" className="group-hover:-translate-x-1 transition-transform" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col justify-center items-center px-8 py-10 h-full">
                                    <div className={`p-4 rounded-full mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-indigo-50'}`}>
                                        <PersonOutlineIcon sx={{ fontSize: 60 }} className="text-indigo-500" />
                                    </div>
                                    
                                    <h3 className='text-2xl font-bold mb-3'>Welcome</h3>
                                    
                                    <p className={`text-center text-sm mb-8 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        You are currently not logged in. Join us to manage your tasks effectively!
                                    </p>
                                    
                                    <div className="flex flex-col w-full space-y-3">
                                        <Link
                                            className="w-full text-center px-6 py-3 font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5"
                                            to="/signIn"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            className={`w-full text-center px-6 py-3 font-semibold rounded-xl border transition-all duration-300 ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                                            to="/signUp"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Drawer>
            </div>
        </ThemeProvider>
    );
}

export default Home;

