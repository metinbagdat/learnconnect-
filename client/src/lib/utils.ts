import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Authentication utility functions
export const AuthUtils = {
  // Get the stored user from localStorage
  getStoredUser: () => {
    const storedUser = localStorage.getItem('edulearn_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('Failed to parse stored user', e);
        return null;
      }
    }
    return null;
  },
  
  // Store user in localStorage
  storeUser: (user: any) => {
    localStorage.setItem('edulearn_user', JSON.stringify(user));
  },
  
  // Remove user from localStorage
  removeUser: () => {
    localStorage.removeItem('edulearn_user');
  }
};
