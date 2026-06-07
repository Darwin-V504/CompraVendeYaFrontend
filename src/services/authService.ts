import * as SecureStore from 'expo-secure-store';

// ✅ Para Android Emulator - NO CAMBIAR
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
      console.log('🔐 Intentando login a:', `${API_BASE_URL}/Auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      const data = await response.json();
      console.log('📨 Respuesta login:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
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
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('📝 Intentando registro a:', `${API_BASE_URL}/Auth/register`);
      
      const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.email,
          password: userData.password,
          telefono: userData.telefono || '',
          rol: userData.rol || 'Agente'
        }),
      });

      const data = await response.json();
      console.log('📨 Respuesta registro:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
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
      console.error('❌ Register error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_data');
    console.log('🚪 Sesión cerrada');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync('user_data');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Error getCurrentUser:', error);
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