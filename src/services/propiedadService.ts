// services/propiedadService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5000/api';

export interface PropiedadDB {
  idPropiedad: number;
  titulo: string;
  descripcion: string;
  precio: number;
  direccion: string;
  habitaciones: number;
  banos: number;
  areaConstruida: number;
  imagenPrincipal: string;
  imagenesAdicionales?: string[];
  operacionNombre: string;
  tipoNombre: string;
  fechaPublicacion: string;
}

class PropiedadService {
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

  async getAllPropiedades(): Promise<PropiedadDB[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/Propiedades`, { headers });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      const data = await response.json();
     

      
      return data;
    } catch (error) {
   
      return [];
    }
  }

  async getPropiedadById(id: number): Promise<PropiedadDB | null> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/Propiedades/${id}`, { headers });
      
      if (!response.ok) return null;
      
      return await response.json();
    } catch (error) {
   
      return null;
    }
  }

  async getPropiedadesByOperation(operation: 'Venta' | 'Alquiler'): Promise<PropiedadDB[]> {
    const all = await this.getAllPropiedades();
    return all.filter(p => p.operacionNombre === operation);
  }

  async crearPropiedad(data: any): Promise<any> {

    
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error("No hay sesión activa. Inicia sesión primero.");
      }

      const payload = {
        titulo: data.titulo,
        descripcion: data.descripcion || "",
        precio: Number(data.precio),
        direccion: data.direccion,
        areaConstruida: Number(data.areaConstruida) || 0,
        habitaciones: Number(data.habitaciones) || 0,
        banos: Number(data.banos) || 0,
        garajes: Number(data.garajes) || 0,
        idOperacion: data.idOperacion,
        urlImagen: data.urlImagen || null
      };

      

      const response = await fetch(`${API_BASE_URL}/Propiedades/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const text = await response.text();
 
      
      if (!response.ok) {
        let errorMessage = 'Error al crear propiedad';
        try {
          const error = JSON.parse(text);
          errorMessage = error.message || errorMessage;
        } catch (e) {
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
    
      
      return JSON.parse(text);
    } catch (error) {
     
      throw error;
    }
  }
}

export default new PropiedadService();