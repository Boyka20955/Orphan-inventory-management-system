
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

const API_URL = '/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifying: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  verifyCode: (code: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('orphanageToken');
    const storedUser = localStorage.getItem('orphanageUser');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Set axios auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // For development: auto-login as admin
      const mockUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@orphanage.org',
        role: 'admin' as const
      };
      
      setUser(mockUser);
      localStorage.setItem('orphanageUser', JSON.stringify(mockUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (response.data.userId) {
        setUserId(response.data.userId);
        setIsVerifying(true);
        
        toast({
          title: "Verification Required",
          description: "A verification code has been sent to your email",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "Invalid email or password",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "An error occurred during login",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${API_URL}/auth/signup`, {
        firstName,
        lastName,
        email,
        password
      });
      
      if (response.data.user) {
        toast({
          title: "Account Created",
          description: "Your account has been created successfully. You can now log in.",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Signup Error",
          description: response.data.message || "An error occurred during account creation",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Signup Error",
        description: error.response?.data?.message || "An error occurred during account creation",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (code: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!userId) {
        toast({
          variant: "destructive",
          title: "Verification Error",
          description: "User session expired, please login again",
        });
        return false;
      }
      
      const response = await axios.post(`${API_URL}/auth/verify`, {
        userId,
        code
      });
      
      if (response.data.user && response.data.token) {
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('orphanageToken', response.data.token);
        localStorage.setItem('orphanageUser', JSON.stringify(userData));
        
        // Set axios auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        setIsVerifying(false);
        setUserId(null);
        
        toast({
          title: "Authenticated",
          description: "You have successfully logged in",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "Invalid verification code",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: error.response?.data?.message || "An error occurred during verification",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      toast({
        title: "Reset Link Sent",
        description: "If an account exists with this email, a password reset link has been sent",
      });
      
      return true;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      // Don't reveal if the email exists or not for security reasons
      toast({
        title: "Reset Link Sent",
        description: "If an account exists with this email, a password reset link has been sent",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, token: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${API_URL}/auth/reset-password`, { 
        email, 
        token, 
        newPassword 
      });
      
      toast({
        title: "Password Reset",
        description: "Your password has been reset successfully. You can now log in with your new password.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        variant: "destructive",
        title: "Reset Error",
        description: error.response?.data?.message || "An error occurred during password reset",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('orphanageToken');
    localStorage.removeItem('orphanageUser');
    delete axios.defaults.headers.common['Authorization'];
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      isVerifying, 
      login, 
      signUp,
      verifyCode, 
      logout,
      forgotPassword,
      resetPassword
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
