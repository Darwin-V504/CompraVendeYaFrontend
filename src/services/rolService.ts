// services/rolService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5000/api';

export interface UsuarioPerfil {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  telefono?: string;
  numeroCuenta?: string;
  esPropietario: boolean;
}

class RolService {
  private async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await this.getToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async getPerfil(): Promise<UsuarioPerfil | null> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/Rol/perfil`, { headers });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async activarPropietario(numeroCuenta: string): Promise<UsuarioPerfil | null> {
    try {
        const headers = await this.getHeaders();
        
        const response = await fetch(`${API_BASE_URL}/Rol/activar-propietario`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ numeroCuenta })
        });
        
       
        
        const text = await response.text();
     
        
        if (!response.ok) {
            let errorMessage = 'Error al activar propietario';
            try {
                const error = JSON.parse(text);
                errorMessage = error.message || errorMessage;
            } catch (e) {
                errorMessage = text || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Error parseando JSON:', e);
            throw new Error('Respuesta inválida del servidor');
        }
        
        // Si la respuesta tiene la estructura correcta
        if (data.usuario) {
            return data.usuario;
        }
        
        return data;
    } catch (error) {
        
        throw error;
    }
}
  
  }


export default new RolService();