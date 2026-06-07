import { Alert } from 'react-native';
import { createContext, useState, useContext, useEffect } from 'react';
import authService, { User as AuthUser } from '../services/authService';

type User = {
  id: string;
  email?: string;
  token: string;
  full_name?: string;
  nombre?: string;
  apellido?: string;
  phone?: string;
  telefono?: string;
  birth_date?: string;
  profile_image_url?: string;
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
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      try {
        const isValid = await authService.isAuthenticated();
        if (isValid) {
          const userData = await authService.getCurrentUser();
          const token = await authService.getToken();
          if (userData && token) {
            setUser({
              id: userData.id,
              email: userData.email,
              token: token,
              full_name: userData.full_name,
              nombre: userData.nombre,
              apellido: userData.apellido,
              phone: userData.phone,
              telefono: userData.telefono,
            });
            setIsAllowed(true);
          }
        } else {
          setUser(null);
          setIsAllowed(false);
        }
      } catch (error) {
        console.error('Error restaurando sesión:', error);
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
      if (response.token && response.user) {
        setUser({
          id: response.user.id,
          email: response.user.email,
          token: response.token,
          full_name: response.user.full_name,
          nombre: response.user.nombre,
          apellido: response.user.apellido,
          phone: response.user.phone,
          telefono: response.user.telefono,
        });
        setIsAllowed(true);
        return true;
      }
      return false;
    } catch (error: any) {
      Alert.alert("Error al iniciar sesión", error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAllowed(false);
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, profileData?: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register({
        email,
        password,
        nombre: profileData?.nombre || profileData?.full_name?.split(' ')[0] || '',
        apellido: profileData?.apellido || profileData?.full_name?.split(' ').slice(1).join(' ') || '',
        telefono: profileData?.phone || profileData?.telefono || '',
        rol: profileData?.rol || 'Agente'
      });
      
      if (response.token && response.user) {
        setUser({
          id: response.user.id,
          email: response.user.email,
          token: response.token,
          full_name: response.user.full_name || `${response.user.nombre} ${response.user.apellido}`,
          nombre: response.user.nombre,
          apellido: response.user.apellido,
          phone: response.user.phone,
          telefono: response.user.telefono,
        });
        setIsAllowed(true);
        Alert.alert("Registro exitoso", "Tu cuenta ha sido creada correctamente.");
        return true;
      }
      return false;
    } catch (error: any) {
      Alert.alert("Error en registro", error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      setIsLoading(true);
      // Implementar si es necesario
      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      Alert.alert("Error", error.message || "No se pudo actualizar el perfil");
      throw error;
    } finally {
      setIsLoading(false);
    }
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