import axios from "axios";

const api = axios.create({
  baseURL: 'https://vooshfoods-backend.onrender.com/api/auth/', // replace with your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    console.log("Login successful:", response.data);
    return response.data; 
  } catch (error: any) {
    if (error.response) {
      console.error("Login error:", error.response.data.message);
      return { error: error.response.data.message }; 
    } else {
      console.error("Error:", error.message);
      return { error: "Network or server error. Please try again." }; 
    }
  }
}

export async function signup(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  gender: string
) {
  try {
    const response = await api.post("/auth/signup", {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      gender,
    });

    console.log("Signup successful:", response.data);
    return response.data; 
  } catch (error: any) {
    if (error.response) {
      console.error("Signup error:", error.response.data.message);
      return { error: error.response.data.message }; 
    } else {
      console.error("Error:", error.message);
      return { error: "Network or server error. Please try again." }; 
    }
  }
}

export async function googleLoginSignup (credential : any) {
  try {
    const response = await api.post("/auth/google", {
      token : credential
    });
    console.log("Login successful:", response.data);
    return response.data; 
  } catch (error: any) {
    if (error.response) {
      console.error("Login error:", error.response.data.message);
      return { error: error.response.data.message }; 
    } else {
      console.error("Error:", error.message);
      return { error: "Network or server error. Please try again." }; 
    }
  }
}
