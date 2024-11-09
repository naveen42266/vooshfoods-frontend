import { useContext, useState } from "react";
import { ThemeContext, ThemeProvider } from "../../context/ThemeContext";
import { Link } from "react-router-dom";
import { signup } from "../../services/user";

const SignUp = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", gender: "", password: "", confirmPassword: "" });

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

        // signup("John", "Doe", "john@example.com", "userpassword", "userpassword", "male");


    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await signup(formData.firstName, formData.lastName, formData?.email, formData?.password, formData?.confirmPassword, formData?.gender);
            if (response) {
                console.log(response.message);  
            } else {
                console.log("Login failed: No response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };
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
                            <Link className='px-2 py-1 text-white  rounded-md' to={'/signIn'}>Login</Link>
                            <Link className='px-3 py-1 text-blue-600 bg-white rounded-md' to={'/signUp'}>SignUp</Link>
                        </div>
                    </div>
                </header>
                <main className="flex-1 container mx-auto p-4">
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                        <h2 className="text-3xl font-bold text-blue-600 w-full max-w-md mb-4">Sign Up</h2>
                        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg border-2 border-blue-600">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-600">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
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
                                <div>
                                    <label className="block text-gray-600">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600">Gender</label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Male"
                                                checked={formData.gender === "Male"}
                                                onChange={handleInputChange}
                                                className="text-blue-500"
                                            />
                                            <span className="ml-2 text-gray-600">Male</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Female"
                                                checked={formData.gender === "Female"}
                                                onChange={handleInputChange}
                                                className="text-blue-500"
                                            />
                                            <span className="ml-2 text-gray-600">Female</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Other"
                                                checked={formData.gender === "Other"}
                                                onChange={handleInputChange}
                                                className="text-blue-500"
                                            />
                                            <span className="ml-2 text-gray-600">Other</span>
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    Sign Up
                                </button>
                            </form>
                            <div className="flex flex-row justify-center gap-2">Already have a account? <div className="text-blue-600">Login</div></div>
                            <div className="flex flex-row justify-center ">
                                <div></div>
                                <span className="flex flex-row gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">SignUp with <div className="font-semibold">Google</div></span>
                                <div></div>
                            </div>
                        </div>
                    </div>


                </main>
                <footer className='p-4 flex justify-between items-center'>
                    <a href="https://github.com/naveen42266" className='underline cursor-pointer hover:text-blue-500' target="_blank" rel="noopener noreferrer">Naveen V</a>
                    <a href="https://github.com/naveen42266/todoTask2-nowDigitalEasy" className='underline cursor-pointer hover:text-blue-500' target="_blank" rel="noopener noreferrer">GitHub Code</a>
                </footer>
            </div>
        </ThemeProvider>
    )
}

export default SignUp;