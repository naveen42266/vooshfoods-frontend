import axios from 'axios';

// Set up base URL and Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api/todoapp/', // replace with your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token for authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // or sessionStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization Header:", config.headers.Authorization);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Get all notes for the authenticated user
export const getAllTasks = async () => {
  try {
    const response = await api.get('/GetNotes');
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

// Add a new note
export const addTask = async (description: any) => {
  try {
    const response = await api.post('/AddNotes', { newNotes: description });
    return response.data;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

// Update a note by ID
export const updateTask = async (noteId: any, updatedDescription: any) => {
  try {
    const response = await api.put('/UpdateNotes', { updatedNotes: updatedDescription }, {
      params: { id: noteId }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

// Delete a note by ID
export const deleteTask = async (noteId: any) => {
  try {
    const response = await api.delete('/DeleteNotes', {
      params: { id: noteId }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};
