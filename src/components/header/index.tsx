// import DarkModeIcon from '@mui/icons-material/DarkMode';
// import LightModeIcon from '@mui/icons-material/LightMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";
import React from 'react';
import TaskIcon from '@mui/icons-material/Task';

interface HeaderProps {
    toggleTheme: () => void,
    isDarkMode: any,
    setOpen: () => void
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode, setOpen }) => {

    return (
        <div className={`sticky top-0 z-50 w-full transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/80 border-b border-gray-800 text-white' : 'bg-white/80 border-b border-gray-200 text-gray-900'} backdrop-blur-md shadow-sm`}>
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link className="text-2xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity" to={"/"}>
                    <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm flex items-center justify-center">
                        <TaskIcon fontSize='medium' />
                    </div>
                    <span className="tracking-tight text-indigo-600 dark:text-indigo-400 block">Task Buddy</span>
                </Link>
                <div className='flex flex-row justify-end gap-3 items-center'>
                    {/* <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full transition-colors duration-300 ${isDarkMode ? "hover:bg-gray-800 text-gray-300 hover:text-white" : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                        aria-label="Toggle Dark Mode"
                    >
                        {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    </button> */}
                    <button
                        onClick={setOpen}
                        className={`p-1 rounded-full transition-colors duration-300 ${isDarkMode ? "hover:bg-gray-800" : 'hover:bg-gray-100'}`}
                    >
                        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-full p-1 shadow-sm hover:shadow-md transition-shadow">
                            <AccountCircleIcon fontSize='medium' />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )

}

export default Header;