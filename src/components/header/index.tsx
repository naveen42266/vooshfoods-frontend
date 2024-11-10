import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
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
        <div className="p-4 bg-blue-600 text-white shadow-md sticky top-0">
            <div className="container mx-auto flex justify-between items-center">
                <Link className="text-3xl font-bold flex" to={"/"}>
                    <TaskIcon  fontSize='large'/>
                    Todo
                </Link>
                <div className='flex flex-row justify-end gap-4 items-center'>
                    <button
                        onClick={toggleTheme}
                        className={`px-1 pb-1 ${!isDarkMode ? " text-white hover:bg-gray-100 hover:text-black" : ' text-white hover:bg-slate-700 hover:text-white'}  rounded transition-colors duration-300`}
                    >
                        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </button>
                    <AccountCircleIcon fontSize='medium' onClick={setOpen} />
                </div>
            </div>
        </div>
    )

}

export default Header;