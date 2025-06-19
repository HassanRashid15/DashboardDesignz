import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      const requiresVerification = error.response?.data?.requiresVerification;
      const userEmail = error.response?.data?.email;

      return {
        success: false,
        message: errorMessage,
        requiresVerification,
        email: userEmail,
      };
    }
  };

  const signup = async (firstName, lastName, email, password) => {
    try {
      const response = await api.post("/auth/signup", {
        firstName,
        lastName,
        email,
        password,
      });

      // Don't store token or user data until email is verified
      return {
        success: true,
        message: response.data.message,
        requiresVerification: response.data.requiresVerification,
        email: response.data.email,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      await api.post("/auth/forgot-password", {
        email,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to process request",
      };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await api.post("/auth/reset-password", {
        token,
        password,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to reset password",
      };
    }
  };

  const resendVerification = async (email) => {
    try {
      await api.post("/auth/resend-verification", {
        email,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to send verification email",
      };
    }
  };

  const verifyResetToken = async (token) => {
    try {
      await api.get(`/auth/verify-reset-token/${token}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid or expired token",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        resendVerification,
        verifyResetToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
