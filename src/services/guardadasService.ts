// services/guardadasService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5000/api';

export interface PropiedadGuardada {
  idGuardado: number;
  propiedadIdExterno: string;
  titulo: string;
  precio: number;
  direccion: string;
  ciudad: string;
  barrio: string;
  habitaciones: number;
  banos: number;
  area: number;
  urlImagen: string;
  tipoOperacion: string;
  claseSocial: string;
  descripcion?: string;
  caracteristicas?: string[];
  fechaGuardado: string;
}

class GuardadasService {
  private async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('auth_token');

      return token;
    } catch (error) {
      return null;
    }
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
    }
    
    return headers;
  }

  async getMisGuardadas(): Promise<PropiedadGuardada[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/PropiedadesGuardadas`, { 
        method: 'GET',
        headers 
      });
      
      
      
      if (!response.ok) {
        if (response.status === 401) {
          return [];
        }
        return [];
      }
      
      const text = await response.text();
      if (!text) return [];
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Error obteniendo guardadas:', error);
      return [];
    }
  }

  async guardarPropiedad(data: any): Promise<PropiedadGuardada | null> {
    try {
      const token = await this.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa. Inicia sesión primero.');
      }
      
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const payload = {
        propiedadIdExterno: String(data.propiedadIdExterno || ''),
        titulo: String(data.titulo || 'Sin título'),
        precio: Number(data.precio) || 0,
        direccion: String(data.direccion || ''),
        ciudad: String(data.ciudad || ''),
        barrio: String(data.barrio || ''),
        habitaciones: Number(data.habitaciones) || 0,
        banos: Number(data.banos) || 0,
        area: Number(data.area) || 0,
        urlImagen: data.urlImagen || '',
        tipoOperacion: String(data.tipoOperacion || 'venta'),
        claseSocial: String(data.claseSocial || 'media'),
        descripcion: String(data.descripcion || ''),
        caracteristicas: data.caracteristicas || []
      };
      
      
      const response = await fetch(`${API_BASE_URL}/PropiedadesGuardadas`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      
      
      
      const text = await response.text();
     
      
      if (response.status === 401) {
        throw new Error('Tu sesión ha expirado. Inicia sesión nuevamente.');
      }
      
      if (!response.ok) {
        let errorMessage = 'Error al guardar';
        try {
          const error = JSON.parse(text);
          errorMessage = error.message || errorMessage;
        } catch (e) {
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      if (!text) {
        throw new Error('Respuesta vacía del servidor');
      }
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Error guardando propiedad:', error);
      throw error;
    }
  }

  async eliminarGuardada(idGuardado: number): Promise<boolean> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/PropiedadesGuardadas/${idGuardado}`, {
        method: 'DELETE',
        headers
      });
      return response.ok;
    } catch (error) {
      console.error('Error eliminando guardada:', error);
      return false;
    }
  }

  async isPropiedadGuardada(propiedadIdExterno: string): Promise<boolean> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/PropiedadesGuardadas/check/${encodeURIComponent(propiedadIdExterno)}`, { 
        method: 'GET',
        headers 
      });
      
      if (response.status === 401) return false;
      if (!response.ok) return false;
      
      const text = await response.text();
      if (!text) return false;
      
      const data = JSON.parse(text);
      return data.isGuardada === true;
    } catch (error) {
      
      return false;
    }
  }
}

export default new GuardadasService();