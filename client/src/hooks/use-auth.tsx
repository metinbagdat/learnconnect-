import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, RegisterData>;
};

type LoginData = Pick<InsertUser, "username" | "password">;
type RegisterData = InsertUser;

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      // Store user in localStorage as fallback mechanism
      localStorage.setItem('edulearn_user', JSON.stringify(user));
      
      // Update query cache with user data
      queryClient.setQueryData(["/api/user"], user);
      
      // Force cache invalidation of other queries after login
      queryClient.invalidateQueries({ queryKey: ["/api/user/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      
      // Show success toast
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.displayName}`,
      });
      
      // Manually redirect to main dashboard page (protected route)
      window.location.href = '/';
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", userData);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      // Store user in localStorage as fallback mechanism
      localStorage.setItem('edulearn_user', JSON.stringify(user));
      
      // Update query cache with user data
      queryClient.setQueryData(["/api/user"], user);
      
      // Force cache invalidation of other queries after registration
      queryClient.invalidateQueries({ queryKey: ["/api/user/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      
      toast({
        title: "Registration successful",
        description: `Welcome to EduLearn, ${user.displayName}`,
      });
      
      // Manually redirect to main dashboard page (protected route)
      window.location.href = '/';
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      // Remove user from local storage
      localStorage.removeItem('edulearn_user');
      
      // Clear query cache
      queryClient.setQueryData(["/api/user"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/user/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      // Redirect to auth page
      window.location.href = '/auth';
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
