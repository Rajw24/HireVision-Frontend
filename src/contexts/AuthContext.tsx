import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AuthState, AuthContextType, LoginCredentials, AuthError } from '../types/auth';
import HttpClientConfig from '../services/HttpClientConfig';
import TokenService from '../services/TokenService';
import toast from 'react-hot-toast';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Action types and reducer
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: any }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { 
        ...state, 
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null 
      };
    case 'AUTH_FAILURE':
      return { 
        ...state, 
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload 
      };
    case 'AUTH_LOGOUT':
      return { 
        ...state, 
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await HttpClientConfig.post('/auth/signin/', { 
        email, 
        password,
        remember_me: rememberMe 
      });

      const { user, tokens } = response.data;
      
      // Store tokens
      TokenService.setTokens(tokens.access, tokens.refresh);
      
      // Update auth state with user info
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      throw new AuthError(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await HttpClientConfig.post('/auth/signout/');
      TokenService.clear();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      // Still clear local state even if server request fails
      TokenService.clear();
      dispatch({ type: 'AUTH_LOGOUT' });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}