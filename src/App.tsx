import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import { useUserDetails } from './context/userDetails';
import { useEffect } from 'react';

function App() {
  const { user, updateUser } = useUserDetails();
  
  // useEffect(() => {
  //   // Check if user is stored in localStorage
  //   const storedUser = sessionStorage.getItem("user");
  //   const storedToken = localStorage.getItem("authToken");

  //   if (storedUser && storedToken) {
  //     // Parse and set user from localStorage
  //     updateUser(JSON.parse(storedUser));  // Assuming stored user is a JSON string
  //   }
  // }, [updateUser]);
  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route path='/signIn' element={<SignIn />} />
        <Route path='/signUp' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

