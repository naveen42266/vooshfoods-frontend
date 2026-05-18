import { useContext, useEffect, useState } from "react";
import { ThemeContext, ThemeProvider } from "../../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { googleLoginSignup, login } from "../../services/user";
import { useUserDetails } from "../../context/userDetails";
import Header from "../../components/header";
import { Avatar, Drawer } from "@mui/material";
import GoogleOAuth from "../../components/googleOAuth";
import { useGoogleLogin } from '@react-oauth/google';
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { PropagateLoader } from "react-spinners";

const SignIn = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { user, updateUser } = useUserDetails();
    const [open, setOpen] = useState<boolean>(false);
    const [inProgress, setInProgress] = useState(false)

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    console.log(user)

    // login("user@example.com", "userpassword");
    // signup("John", "Doe", "john@example.com", "userpassword", "userpassword", "male");

    // function login(){
    // signup("John", "Doe", "john@example.com", "userpassword", "userpassword", "male");
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        setInProgress(true)
        e.preventDefault();
        try {
            const response = await login(formData.email, formData.password);
            if (response.message === "Login successful") {
                console.log(response.message);
                updateUser(response.user);
                localStorage.setItem("loginMessage", response.message);
                localStorage.setItem("authToken", response.token);
                const loginTime = Date.now();
                localStorage.setItem("loginTime", loginTime.toString());
                navigate("/");
            } else {
                console.log("Login failed:" + response.error);
                toast.error(response.error, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setInProgress(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: tokenResponse => window.location.href = "https://vooshfoods-backend.onrender.com/api/auth/google",
        // "http://localhost:8080/api/auth/google",
        // googleLoginApi(tokenResponse?.access_token),
        onError: error => console.log(error)
    });

    const googleLoginApi = async (credential: any) => {
        console.log(credential, "credential")
        try {
            const response = await googleLoginSignup(credential);
            if (response.message === "Google login successful") {
                console.log(response.message);
                updateUser(response.user);
                localStorage.setItem("loginMessage", response.message);
                localStorage.setItem("authToken", response.token);
                const loginTime = Date.now();
                localStorage.setItem("loginTime", loginTime.toString());
                navigate("/");
            } else {
                console.log("Login failed: No response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
        }

    }

    useEffect(() => {
        // debugger
        const signUpMessage = localStorage.getItem("signUpMessage");
        if (signUpMessage) {
            toast.success('Signed Up successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            localStorage.removeItem("signUpMessage");
        }
    }, []);

    return (
        <ThemeProvider>
            <ToastContainer />
            <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-black' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
                <header>
                    <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} setOpen={() => { setOpen(!open) }} />
                </header>
                <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
                    <div className="w-full max-w-md animate-fade-in">
                        <div className="text-center mb-8">
                            <h2 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome back</h2>
                            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please enter your details to sign in.</p>
                        </div>
                        
                        <div className={`p-8 space-y-6 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' : 'bg-white border-gray-100'}`}>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                {inProgress ?
                                    <button
                                        disabled
                                        className="w-full px-4 py-2.5 font-medium text-white bg-indigo-500/70 rounded-lg cursor-not-allowed flex justify-center items-center"
                                    >
                                        <PropagateLoader size={8} color="white" className="mb-2" />
                                    </button> :
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2.5 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow"
                                    >
                                        Sign in
                                    </button>}
                            </form>
                            
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => googleLogin()}
                                className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 border rounded-lg font-medium transition-colors ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-white hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm'}`}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                            
                            <p className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Don't have an account? <Link className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors" to={'/signUp'}>Sign up</Link>
                            </p>
                        </div>
                    </div>
                </main>
                {/* <Drawer open={open} anchor="right" onClose={() => setOpen(false)}>
                        <div className="px-20 py-4">
                            {user ? (
                                <div className="flex flex-col items-center">
                                    <div className='text-2xl font-medium pb-5'>My Profile</div>
                                    {user?.gender !== "Male" ? (
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
                    </Drawer> */}
            </div>
        </ThemeProvider>
    )
}

export default SignIn;