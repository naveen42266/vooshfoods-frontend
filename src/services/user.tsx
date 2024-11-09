import axios from "axios";

export async function login(email: string, password: string) {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
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
    const response = await axios.post("http://localhost:8080/api/auth/signup", {
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
