// Usa la misma IP que en authService.ts
const API_BASE_URL = 'http://10.0.2.2:5000/api';

export interface PropiedadML {
  idExterno: string;
  titulo: string;
  precio: number;
  moneda: string;
  direccion: string;
  descripcion?: string;
  urlImagen?: string;
  urlDetalle: string;
  condicion: string;
  tipoOperacion: string;
}

export interface BusquedaMLResponse {
  source: string;
  total: number;
  results: PropiedadML[];
}

class MercadoLibreService {
  
  async buscarPropiedades(
    query: string,
    siteId: string = 'MLM',
    limit: number = 20
  ): Promise<BusquedaMLResponse> {
    try {
      const url = `${API_BASE_URL}/MercadoLibre/search?siteId=${siteId}&query=${encodeURIComponent(query)}&limit=${limit}`;
      console.log('🔍 Buscando en ML:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log(`📊 ML devolvió ${data.total} resultados`);
      return data;
    } catch (error) {
      console.error('❌ Error buscando en ML:', error);
      return { source: 'mercadolibre', total: 0, results: [] };
    }
  }
  
  async getCategories(siteId: string = 'MLM'): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/MercadoLibre/categories?siteId=${siteId}`);
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      return null;
    }
  }
}

export default new MercadoLibreService();