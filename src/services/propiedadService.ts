import * as SecureStore from 'expo-secure-store';

// ✅ Para Android Emulator - NO CAMBIAR
const API_BASE_URL = 'http://10.0.2.2:5000/api';

export interface Propiedad {
  idPropiedad: number;
  titulo: string;
  descripcion?: string;
  precio: number;
  direccion: string;
  areaConstruida?: number;
  areaTerreno?: number;
  habitaciones?: number;
  banos?: number;
  garajes?: number;
  tipoNombre?: string;
  zonaNombre?: string;
  estadoNombre?: string;
  operacionNombre?: string;
  fotosUrls: string[];
}

class PropiedadService {
  
  async getAll(): Promise<Propiedad[]> {
    try {
      console.log('🏠 Obteniendo propiedades de:', `${API_BASE_URL}/Propiedades`);
      const response = await fetch(`${API_BASE_URL}/Propiedades`);
      const data = await response.json();
      console.log(`📊 Se obtuvieron ${data.length} propiedades`);
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo propiedades:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Propiedad | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/Propiedades/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('❌ Error obteniendo propiedad:', error);
      return null;
    }
  }

  async getTestConnection(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/Propiedades/test-connection`);
      return await response.json();
    } catch (error) {
      console.error('❌ Error test conexión:', error);
      return null;
    }
  }
}

export default new PropiedadService();