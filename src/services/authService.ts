import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  birth_date?: string;
  profile_image_url?: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!credentials.email || !credentials.password) {
      throw new Error('Email y contraseña son requeridos');
    }
    
    if (credentials.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    
    const mockUser: User = {
      id: 'mock_' + Date.now(),
      email: credentials.email,
      full_name: credentials.email.split('@')[0],
      phone: '5512345678',
    };
    
    const mockToken = 'mock_token_' + Date.now();
    
    await SecureStore.setItemAsync('auth_token', mockToken);
    await SecureStore.setItemAsync('user_data', JSON.stringify(mockUser));
    
    return {
      token: mockToken,
      user: mockUser,
    };
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!userData.email || !userData.password || !userData.full_name) {
      throw new Error('Todos los campos son requeridos');
    }
    
    if (userData.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    
    const mockUser: User = {
      id: 'mock_' + Date.now(),
      email: userData.email,
      full_name: userData.full_name,
      phone: userData.phone || '',
    };
    
    const mockToken = 'mock_token_' + Date.now();
    
    await SecureStore.setItemAsync('auth_token', mockToken);
    await SecureStore.setItemAsync('user_data', JSON.stringify(mockUser));
    
    return {
      token: mockToken,
      user: mockUser,
    };
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_data');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync('user_data');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('auth_token');
    return token !== null;
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentUser = await this.getCurrentUser();
    const updatedUser = { ...currentUser, ...profileData } as User;
    
    await SecureStore.setItemAsync('user_data', JSON.stringify(updatedUser));
    
    return updatedUser;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (newPassword.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('auth_token');
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();