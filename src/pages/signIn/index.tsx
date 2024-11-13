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

const SignIn = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { user, updateUser } = useUserDetails();
    const [open, setOpen] = useState<boolean>(false);

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
                <main className="flex-1 container mx-auto p-4">
                    <div className={`flex flex-col items-center justify-center h-[500px] `}>
                        <h2 className="text-3xl font-bold text-blue-600 w-full max-w-md mb-4">Login</h2>
                        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg border-2 border-blue-600">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-600">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 font-semibold text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    Login
                                </button>
                            </form>
                            <div className="flex flex-row justify-center gap-2">Don't have a account? <Link className="text-blue-600" to={'/signUp'}>SignUp</Link></div>
                            <div className="flex flex-row justify-center ">
                                {/* <GoogleOAuth/> */}
                                <span className="flex flex-row gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={() => googleLogin()} >Login with <div className="font-semibold">Google</div></span>
                                <div></div>
                            </div>
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