import { Alert } from 'react-native';
import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  email?: string;
  token: string;
  full_name?: string;
  phone?: string;
} | null;

type AuthContextType = {
  user: User | null;
  isAllowed: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, profileData?: any) => Promise<boolean>;
  updateProfile: (profileData: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe estar dentro de AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión al iniciar
  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const userData = await AsyncStorage.getItem('user_data');
        
       
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            id: parsedUser.id,
            email: parsedUser.email,
            token: token,
            full_name: parsedUser.full_name,
            phone: parsedUser.telefono,
          });
          setIsAllowed(true);
          
        } else {
        
          setUser(null);
          setIsAllowed(false);
        }
      } catch (error) {
       
        setUser(null);
        setIsAllowed(false);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      
      const response = await authService.login({ email, password });
      
      
      // Guardar en AsyncStorage también para consistencia
      await AsyncStorage.setItem('auth_token', response.token);
      await AsyncStorage.setItem('user_data', JSON.stringify({
        id: response.user.id,
        email: response.user.email,
        full_name: response.user.full_name,
        telefono: response.user.phone,
      }));
      
      setUser({
        id: response.user.id,
        email: response.user.email,
        token: response.token,
        full_name: response.user.full_name,
        phone: response.user.phone,
      });
      setIsAllowed(true);
      
    
      return true;
    } catch (error: any) {
      
      Alert.alert("Error", error.message || "Error al iniciar sesión");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, profileData?: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!profileData?.nombre || !profileData?.apellido) {
        Alert.alert("Error", "Nombre y apellido son obligatorios");
        return false;
      }
      
      const response = await authService.register({
        email,
        password,
        nombre: profileData.nombre,
        apellido: profileData.apellido,
        telefono: profileData.telefono || '',
        rol: 'Agente'
      });
      
      if (response.token && response.user) {
        await AsyncStorage.setItem('auth_token', response.token);
        await AsyncStorage.setItem('user_data', JSON.stringify({
          id: response.user.id,
          email: response.user.email,
          full_name: response.user.full_name,
          telefono: response.user.phone,
        }));
        
        setUser({
          id: response.user.id,
          email: response.user.email,
          token: response.token,
          full_name: response.user.full_name,
          phone: response.user.phone,
        });
        setIsAllowed(true);
        
        Alert.alert("Éxito", "Cuenta creada correctamente");
        return true;
      }
      
      return false;
    } catch (error: any) {
      Alert.alert("Error", error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
    await authService.logout();
    setUser(null);
    setIsAllowed(false);
  };

  const updateProfile = async (profileData: any) => {
    // Implementar si es necesario
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAllowed,
      isLoading,
      login,
      logout,
      signUp,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};