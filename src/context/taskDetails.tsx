import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the types for the context and provider props
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
  createdAt: string;
  userId?: string;
}

interface TaskDetailsContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

interface TaskProviderProps {
  children: ReactNode;
}

// Create the TaskDetails context
export const TaskDetailsContext = createContext<TaskDetailsContextType | undefined>(undefined);

// Provider component
export const TaskDetailsProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Example of initializing tasks from localStorage or API call
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    const initialTasks = storedTasks ? JSON.parse(storedTasks) : [];
    setTasks(initialTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <TaskDetailsContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskDetailsContext.Provider>
  );
};

// Custom hook for accessing the TaskDetailsContext
export const useTaskDetails = () => {
  const context = useContext(TaskDetailsContext);
  if (!context) {
    throw new Error("useTaskDetails must be used within a TaskDetailsProvider");
  }
  return context;
};
