import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logs (desenvolvimento)
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

// Tipos
export interface Vantagem {
  id: number;
  descricao: string;
  foto: string | null;
  custoMoedas: number;
  empresaId: number | null;
  empresaNome: string | null;
}

export interface PageResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Serviços
export const vantagensService = {
  listarTodas: (page = 0, size = 20) =>
    api.get<PageResponse<Vantagem>>(`/vantagens?page=${page}&size=${size}`),
  
  buscarPorId: (id: number) =>
    api.get<Vantagem>(`/vantagens/${id}`),
  
  resgatarVantagem: (vantagemId: number, alunoId: number) =>
    api.post<Vantagem>(`/vantagens/${vantagemId}/resgatar/${alunoId}`),
};

export const alunosService = {
  buscarPorId: (id: number) =>
    api.get(`/alunos/${id}`),
};

export const professoresService = {
  enviarMoedas: (professorId: number, data: { alunoId: number; quantidade: number; motivo: string }) =>
    api.post(`/professores/${professorId}/enviar-moedas`, data),
};
