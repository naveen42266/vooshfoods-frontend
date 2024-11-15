import React, { useState, useContext, useEffect } from 'react';
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
import ViewTaskModal from '../../components/viewTask';
import EditTaskModal from '../../components/editTask';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, Drawer, LinearProgress, linearProgressClasses, styled } from '@mui/material';
import Header from '../../components/header';
import { Bounce, toast, ToastContainer } from "react-toastify";
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

    async function getAllTasksApi() {
        try {
            const response = await getAllTasks();
            if (response) {
                setTasks(response)
            } else {
                console.log("Login failed: No response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[400],
            ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.grey[800],
            }),
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: taskCompletionPercent > 49.9 ? '#16a34a' : '#dc2626',
            ...theme.applyStyles('dark', {
                backgroundColor: '#308fe8',
            }),
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
            const userData: any = {};
            userData.userId = decoded.id;
            userData.email = decoded.email;
            userData.firstName = decoded.firstName;
            userData.lastName = decoded.lastName;
            userData.profilePicture = decoded.profilePicture;
            updateUser(userData);
            toast.success('User logged in successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            localStorage.setItem("authToken", token);
            navigate("/", { replace: true });
        }

    }, [token])

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
            }
            else {
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
                progress: undefined,
            });
            localStorage.removeItem("loginMessage");
        }
    }, [])


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
                        <div className="bg-white p-2 md:p-4 rounded shadow-md mb-4 flex justify-between gap-4">
                            {filter === 'deadline' ? <div className='w-[65%] md:w-[67.5%]'>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={search}
                                    onChange={(e) => setSearch(e?.target?.value)}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div> : <div className='w-[65%] md:w-[67.5%]'><SearchBar onSearch={setSearch} /></div>}
                            <div className='w-[25%] md:w-[27.5%] md:max-w-[20%]'><CategoryFilter categories={categories} onFilter={(filter) => { setFilter(filter); setSearch('') }} /></div>
                        </div>
                        <div className="flex flex-col items-center space-y-4 mb-6 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
                            <button
                                className="flex flex-row justify-center items-center gap-2 px-6 py-2 w-full md:w-auto bg-blue-600 text-white text-lg font-bold rounded-md shadow-md hover:bg-blue-500 transition-colors duration-300"
                                onClick={openModal}
                            >
                                <span className="text-2xl">+</span>
                                Add Task
                            </button>
                            <div className="w-full md:w-5/6">
                                <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-4">
                                    <div className={`mb-1 font-semibold ${isDarkMode ? "text-white" : 'text-gray-700'}  text-lg`}>
                                        Progress: <span className={`${taskCompletionPercent > 49.9 ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>{taskCompletionPercent}%</span> done
                                    </div>
                                    <div className={`text-sm ${isDarkMode ? "text-white" : 'text-gray-500'}`}>
                                        <span className="font-medium">Note:</span> Done / (Todo + In Progress + Done) * 100
                                    </div>
                                </div>
                                <BorderLinearProgress variant="determinate" value={Number(taskCompletionPercent)} className="mt-2" />
                            </div>
                        </div>
                        <TaskGrid tasks={todoTask()} deleteTask={(id: string) => { handleDeleteTask(id); }} editTaskModel={(id: string) => { setIsEditTaskModal({ id: id, isOpen: true }); }} viewTaskModal={(id: string) => { setIsViewTaskModal({ id: id, isOpen: true }); }} updateTaskStatus={(taskId: string, newStatus: string) => { handleEditStatus(taskId, newStatus) }} />
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
                    <div className={`px-5 py-4 h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
                        {user ? (
                            <div className="flex flex-col items-center p-6 space-y-4">
                                <h2 className="text-2xl font-bold mb-3">My Profile</h2>

                                <Avatar
                                    src={user?.gender == "Male"
                                        ? "https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg"
                                        : user?.gender == "Female" ? "https://w7.pngwing.com/pngs/4/736/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png" : user?.profilePicture ? user?.profilePicture : ''}
                                    sx={{ height: 120, width: 120 }}
                                    className="object-cover mb-4 shadow-md"
                                    alt={`${user?.gender} Avatar`}
                                />

                                <div className="text-center space-y-1">
                                    <div className="text-xl font-semibold">
                                        {user?.firstName} {user?.lastName}
                                    </div>
                                    <div className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{user?.email}</div>
                                    <div className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} capitalize`}>{user?.gender}</div>
                                </div>

                                <button
                                    className="mt-5 px-4 py-2 bg-red-600 text-white rounded-lg font-medium shadow hover:bg-red-500 transition-colors duration-300"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>

                        ) : (
                            <div className="flex flex-col justify-center items-center px-8">
                                <div className='text-2xl font-medium pb-5'>No User found</div>
                                <img src="https://img.freepik.com/premium-vector/flat-design-no-user-found_108061-1605.jpg" className='max-h-[300px] max-w-[300px]' alt="no user found" />
                                <p className={`text-lg text-center max-w-md mb-4`}>
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
                            </div>
                        )}
                    </div>
                </Drawer>
            </div>
        </ThemeProvider>
    );
}

export default Home;

