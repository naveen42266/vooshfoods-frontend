import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './context/ThemeContext';
import { UserDetailsProvider } from './context/userDetails';
import { TaskDetailsProvider } from './context/taskDetails';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="410811568267-i3r53unc4ltnsta2mtaem6tc9v9segd7.apps.googleusercontent.com">
      <UserDetailsProvider>
        <TaskDetailsProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </TaskDetailsProvider>
      </UserDetailsProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
