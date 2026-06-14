// services/authService.ts
import * as SecureStore from 'expo-secure-store';

// Para Android Emulator
const API_BASE_URL = 'http://10.0.2.2:5000/api';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  nombre?: string;
  apellido?: string;
  phone?: string;
  telefono?: string;
  rol?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      
      
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Email: credentials.email,
          Password: credentials.password
        }),
      });
      
      const data = await response.json();
    
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      if (!data.token) {
        throw new Error('No se recibió token del servidor');
      }
      
      //  Guardar token REAL 
      await SecureStore.setItemAsync('auth_token', data.token);
      await SecureStore.setItemAsync('user_data', JSON.stringify({
        id: data.user.idUsuario.toString(),
        email: data.user.email,
        nombre: data.user.nombre,
        apellido: data.user.apellido,
        full_name: `${data.user.nombre} ${data.user.apellido}`,
        rol: data.user.rol,
        telefono: data.user.telefono
      }));
      
      
      
      return {
        token: data.token,
        user: {
          id: data.user.idUsuario.toString(),
          email: data.user.email,
          nombre: data.user.nombre,
          apellido: data.user.apellido,
          full_name: `${data.user.nombre} ${data.user.apellido}`,
          rol: data.user.rol,
          phone: data.user.telefono
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
    
      
      const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Nombre: userData.nombre,
          Apellido: userData.apellido,
          Email: userData.email,
          Password: userData.password,
          Telefono: userData.telefono || '',
          Rol: userData.rol || 'Agente'
        }),
      });
      
      const data = await response.json();
      
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar');
      }
      
      if (!data.token) {
        throw new Error('No se recibió token del servidor');
      }
      
      await SecureStore.setItemAsync('auth_token', data.token);
      await SecureStore.setItemAsync('user_data', JSON.stringify({
        id: data.user.idUsuario.toString(),
        email: data.user.email,
        nombre: data.user.nombre,
        apellido: data.user.apellido,
        full_name: `${data.user.nombre} ${data.user.apellido}`,
        rol: data.user.rol,
        telefono: data.user.telefono
      }));
      
      return {
        token: data.token,
        user: {
          id: data.user.idUsuario.toString(),
          email: data.user.email,
          nombre: data.user.nombre,
          apellido: data.user.apellido,
          full_name: `${data.user.nombre} ${data.user.apellido}`,
          rol: data.user.rol,
          phone: data.user.telefono
        }
      };
    } catch (error) {
      console.error(' Register error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_data');
    console.log(' Sesión cerrada');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('auth_token');
    return token !== null;
  }

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('auth_token');
  }
}

export default new AuthService();