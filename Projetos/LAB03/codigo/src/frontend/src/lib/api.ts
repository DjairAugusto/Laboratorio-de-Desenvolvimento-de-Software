export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `API Error: ${response.status}`)
  }

  // Handle empty responses (like DELETE)
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return null as T
  }

  return response.json()
}

export async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`GET ${path} ${res.status}`)
  return res.json().catch(() => res.text())
}

export async function health(): Promise<string> {
  const res = await fetch(`${API_BASE}/`)
  return res.text()
}

// Types
export type AlunoDTO = {
  id?: number
  nome: string
  documento: string
  email: string
  login: string
  senha?: string
  rg: string
  endereco: string
  curso: string
  saldoMoedas: number
  instituicaoId: number
}

export type EmpresaDTO = {
  id?: number
  nome: string
  documento: string
  email: string
  login: string
  senha?: string
  nomeFantasia: string
  cnpj: string
}

export type VantagemDTO = {
  id?: number
  descricao: string
  foto?: string
  custoMoedas: number
  empresaId?: number
  empresaNome?: string
}

// Resposta de resgate de vantagem
export type ResgateResponse = {
  vantagemId: number
  vantagemDescricao: string
  custoMoedas: number
  codigoCupom: string
  dataResgate: string
  novoSaldo: number
  emailAluno: string
  nomeAluno: string
  empresaNome: string
  emailEmpresa: string
  emailEnviado: boolean
}

export type PaginationMetadata = {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

export type PageResponse<T> = {
  items: T[]
  pagination: PaginationMetadata
}

export type LoginRequestDTO = {
  login: string
  senha: string
}

export type LoginResponseDTO = {
  id: number
  nome: string
  email: string
  login: string
  tipo: 'aluno' | 'professor' | 'empresa'
}

export type ProfessorDTO = {
  id?: number
  nome: string
  cpf: string
  departamento: string
  email: string
  login: string
  senha?: string
  instituicaoId: number
}

export type TransacaoDTO = {
  id: number
  usuario: {
    id: number
    nome: string
  }
  usuarioDestino?: {
    id: number
    nome: string
  }
  data: string
  valor: number
  tipo: string
  motivo: string
}

// Auth API
export const authAPI = {
  async login(login: string, senha: string): Promise<LoginResponseDTO> {
    return apiCall<LoginResponseDTO>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, senha }),
    })
  },
}

// Alunos API
export const alunosAPI = {
  async listar(): Promise<AlunoDTO[]> {
    try {
      return await apiCall<AlunoDTO[]>('/api/alunos')
    } catch {
      // Fallback demo: map demoStore students to AlunoDTO
      const { demoStore } = await import('./store')
      const alunos = demoStore.listarAlunos()
      return alunos.map((s: any, idx: number) => ({
        id: s.id ?? idx + 1,
        nome: s.nome,
        documento: s.cpf || '000.000.000-00',
        email: s.email,
        login: s.email,
        rg: s.rg || '00.000.000-0',
        endereco: s.endereco || 'Endereço não informado',
        curso: s.curso || 'Curso',
        saldoMoedas: s.saldo ?? 0,
        instituicaoId: 1,
      }))
    }
  },

  async buscarPorId(id: number): Promise<AlunoDTO> {
    try {
      return await apiCall<AlunoDTO>(`/api/alunos/${id}`)
    } catch {
      const { demoStore } = await import('./store')
      const alunos = demoStore.listarAlunos() as any[]
      const s = alunos.find((a) => (a.id ?? 0) === id) || alunos[0]
      if (!s) throw new Error('Aluno demo não encontrado')
      return {
        id: s.id ?? 1,
        nome: s.nome,
        documento: s.cpf || '000.000.000-00',
        email: s.email,
        login: s.email,
        rg: s.rg || '00.000.000-0',
        endereco: s.endereco || 'Endereço não informado',
        curso: s.curso || 'Curso',
        saldoMoedas: s.saldo ?? 0,
        instituicaoId: 1,
      }
    }
  },

  async criar(data: Omit<AlunoDTO, 'id'>): Promise<AlunoDTO> {
    return apiCall<AlunoDTO>('/api/alunos', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async atualizar(id: number, data: Omit<AlunoDTO, 'id'>): Promise<AlunoDTO> {
    return apiCall<AlunoDTO>(`/api/alunos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deletar(id: number): Promise<void> {
    return apiCall<void>(`/api/alunos/${id}`, {
      method: 'DELETE',
    })
  },

  async adicionarMoedas(id: number, quantidade: number): Promise<string> {
    try {
      return await apiCall<string>(`/api/alunos/${id}/adicionar-moedas?quantidade=${quantidade}`, { method: 'PATCH' })
    } catch {
      const { demoStore } = await import('./store')
      // Find current user as professor (best-effort using auth in localStorage)
      const authRaw = localStorage.getItem('lab03-auth')
      const auth = authRaw ? JSON.parse(authRaw) : undefined
      const profId = auth?.id || 2
      demoStore.sendCoins({ professorId: profId, alunoId: id, valor: quantidade, motivo: 'Reconhecimento (demo)' })
      try {
        // attempt to send emails via EmailJS helper (non-blocking)
        const { sendCoinTransferEmails } = await import('./emailJs')
        const db = demoStore.getDB()
        const prof = db.users.find((u: any) => u.id === profId)
        const aluno = db.students.find((s: any) => s.id === id)
        sendCoinTransferEmails({
          professorName: prof?.name || 'Professor',
          professorEmail: prof?.email,
          studentName: aluno?.nome || aluno?.email || 'Aluno',
          studentEmail: aluno?.email || '',
          valor: quantidade,
          motivo: 'Reconhecimento (demo)'
        }).catch((e: any) => console.debug('Email send failed (demo):', e))
      } catch (e) {
        console.debug('Email helper import failed or not configured', e)
      }
      return 'OK'
    }
  },

  async enviarMoedas(professorId: number, alunoId: number, quantidade: number, motivo: string): Promise<any> {
    try {
      const response = await apiCall<any>(`/api/professores/${professorId}/enviar-moedas`, {
        method: 'POST',
        body: JSON.stringify({
          alunoId: alunoId,
          quantidade: quantidade,
          motivo: motivo
        })
      })
      return response
    } catch (err) {
      console.error('Erro ao enviar moedas:', err)
      // Fallback: usar adicionarMoedas (compatibilidade)
      await this.adicionarMoedas(alunoId, quantidade)
      return { success: true }
    }
  },

  async debitarMoedas(id: number, quantidade: number): Promise<string> {
    try {
      return await apiCall<string>(`/api/alunos/${id}/debitar-moedas?quantidade=${quantidade}`, { method: 'PATCH' })
    } catch {
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      const aluno = db.students.find((s: any) => s.id === id)
      if (aluno) {
        aluno.saldo = (aluno.saldo ?? 0) - Math.max(0, quantidade)
        // Record resgate
        const idBase = Math.max(0, ...db.transactions.map((t: any) => t.id)) + 1
        const today = new Date().toISOString().slice(0, 10)
        db.transactions.push({ id: idBase, tipo: 'aluno_resgate', data: today, alunoId: id, valor: Math.max(0, quantidade), descricao: 'Resgate (demo)' })
        localStorage.setItem('lab03-demo-db', JSON.stringify(db))
      }
      return 'OK'
    }
  },
}

// Empresas API
export const empresasAPI = {
  async listar(): Promise<EmpresaDTO[]> {
    return apiCall<EmpresaDTO[]>('/api/empresas')
  },

  async buscarPorId(id: number): Promise<EmpresaDTO> {
    return apiCall<EmpresaDTO>(`/api/empresas/${id}`)
  },

  async criar(data: Omit<EmpresaDTO, 'id'>): Promise<EmpresaDTO> {
    return apiCall<EmpresaDTO>('/api/empresas', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async atualizar(id: number, data: Partial<EmpresaDTO>): Promise<EmpresaDTO> {
    return apiCall<EmpresaDTO>(`/api/empresas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deletar(id: number): Promise<void> {
    return apiCall<void>(`/api/empresas/${id}`, {
      method: 'DELETE',
    })
  },
}

// Professores API (stub)
export const professoresAPI = {
  async criar(data: Omit<ProfessorDTO, 'id'>): Promise<ProfessorDTO> {
    try {
      return await apiCall<ProfessorDTO>('/api/professores', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch {
      // Fallback: create user in demo store
      const { demoStore } = await import('./store')
      const created = demoStore.criarProfessor({
        nome: data.nome,
        cpf: data.cpf,
        departamento: data.departamento,
        email: data.email,
        login: data.login,
        senha: data.senha,
        instituicaoId: data.instituicaoId,
      })
      return {
        id: created.id,
        nome: created.name,
        cpf: data.cpf,
        departamento: data.departamento,
        email: created.email,
        login: created.login,
        instituicaoId: data.instituicaoId,
      }
    }
  },

  async buscarPorId(id: number): Promise<ProfessorDTO | null> {
    try {
      return await apiCall<ProfessorDTO>(`/api/professores/${id}`, {
        method: 'GET',
      })
    } catch {
      // Fallback: search in demo store
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      const prof = db.users.find((u: any) => u.id === id && u.role === 'professor')
      if (!prof) return null
      return {
        id: prof.id,
        nome: prof.name,
        cpf: (prof as any).cpf || '',
        departamento: (prof as any).departamento || '',
        email: prof.email,
        login: prof.login || prof.email,
        instituicaoId: (prof as any).instituicaoId || 1,
      }
    }
  },
}

// Vantagens API (empresa) - fallback to demoStore when backend is unavailable
export const vantagensAPI = {
  async listar(params?: { page?: number; size?: number; sortBy?: string; direction?: 'asc' | 'desc' }): Promise<PageResponse<VantagemDTO>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page !== undefined) queryParams.append('page', params.page.toString())
      if (params?.size !== undefined) queryParams.append('size', params.size.toString())
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params?.direction) queryParams.append('direction', params.direction)
      
      const query = queryParams.toString()
      return await apiCall<PageResponse<VantagemDTO>>(`/api/vantagens${query ? `?${query}` : ''}`)
    } catch {
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      const all = (db.advantages || []).map((v: any, idx: number) => ({
        id: v.id ?? idx + 1,
        descricao: v.descricao || v.titulo || 'Vantagem',
        foto: v.foto,
        custoMoedas: v.custoMoedas ?? v.preco ?? 0,
        empresaId: v.empresaId,
        empresaNome: v.empresaNome,
      }))
      
      const page = params?.page ?? 0
      const size = params?.size ?? 10
      const start = page * size
      const items = all.slice(start, start + size)
      
      return {
        items,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(all.length / size),
          totalItems: all.length,
          pageSize: size,
          hasNext: (page + 1) * size < all.length,
          hasPrevious: page > 0,
        },
      }
    }
  },

  async listarPorEmpresa(empresaId: number, params?: { page?: number; size?: number; sortBy?: string; direction?: 'asc' | 'desc' }): Promise<PageResponse<VantagemDTO>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page !== undefined) queryParams.append('page', params.page.toString())
      if (params?.size !== undefined) queryParams.append('size', params.size.toString())
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params?.direction) queryParams.append('direction', params.direction)
      
      const query = queryParams.toString()
      return await apiCall<PageResponse<VantagemDTO>>(`/api/empresas/${empresaId}/vantagens${query ? `?${query}` : ''}`)
    } catch {
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      // demo advantages shape is arbitrary; filter by empresaId if present
      const all = (db.advantages || [])
        .filter((v: any) => !v.empresaId || v.empresaId === empresaId)
        .map((v: any, idx: number) => ({
          id: v.id ?? idx + 1,
          descricao: v.descricao || v.titulo || 'Vantagem',
          foto: v.foto,
          custoMoedas: v.custoMoedas ?? v.preco ?? 0,
          empresaId: v.empresaId,
          empresaNome: v.empresaNome,
        }))
      
      const page = params?.page ?? 0
      const size = params?.size ?? 10
      const start = page * size
      const items = all.slice(start, start + size)
      
      return {
        items,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(all.length / size),
          totalItems: all.length,
          pageSize: size,
          hasNext: (page + 1) * size < all.length,
          hasPrevious: page > 0,
        },
      }
    }
  },

  async buscarPorId(id: number): Promise<VantagemDTO> {
    try {
      return await apiCall<VantagemDTO>(`/api/vantagens/${id}`)
    } catch {
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      const v = (db.advantages || []).find((a: any) => a.id === id)
      if (!v) throw new Error('Vantagem não encontrada')
      return {
        id: v.id,
        descricao: v.descricao || v.titulo || 'Vantagem',
        foto: v.foto,
        custoMoedas: v.custoMoedas ?? v.preco ?? 0,
        empresaId: v.empresaId,
        empresaNome: v.empresaNome,
      }
    }
  },

  async criar(empresaId: number, data: Omit<VantagemDTO, 'id'>): Promise<VantagemDTO> {
    try {
      return await apiCall<VantagemDTO>(`/api/empresas/${empresaId}/vantagens`, { method: 'POST', body: JSON.stringify(data) })
    } catch {
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      const nextId = Math.max(0, ...((db.advantages || []).map((a: any) => a.id || 0))) + 1
      const rec = { id: nextId, empresaId, descricao: data.descricao, foto: data.foto, custoMoedas: data.custoMoedas }
      db.advantages = db.advantages || []
      db.advantages.push(rec)
      localStorage.setItem('lab03-demo-db', JSON.stringify(db))
      return rec
    }
  },

  async atualizar(empresaId: number, id: number, data: Partial<VantagemDTO>): Promise<VantagemDTO> {
    try {
      return await apiCall<VantagemDTO>(`/api/empresas/${empresaId}/vantagens/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(data) 
      })
    } catch {
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      const idx = (db.advantages || []).findIndex((a: any) => a.id === id)
      if (idx >= 0) {
        db.advantages[idx] = { ...db.advantages[idx], ...data }
        localStorage.setItem('lab03-demo-db', JSON.stringify(db))
        return db.advantages[idx]
      }
      throw new Error('Vantagem não encontrada')
    }
  },

  async deletar(empresaId: number, id: number): Promise<void> {
    try {
      return await apiCall<void>(`/api/empresas/${empresaId}/vantagens/${id}`, { method: 'DELETE' })
    } catch {
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      db.advantages = (db.advantages || []).filter((a: any) => a.id !== id)
      localStorage.setItem('lab03-demo-db', JSON.stringify(db))
      return
    }
  },

  async resgatar(vantagemId: number, alunoId: number): Promise<ResgateResponse> {
    try {
      const resp = await apiCall<ResgateResponse>(`/api/vantagens/${vantagemId}/resgatar?alunoId=${alunoId}`, {
        method: 'POST',
      })
      // Disparo de emails de resgate no frontend (não bloqueante)
      try {
        const { sendResgateEmails } = await import('./emailJs')
        sendResgateEmails({
          alunoEmail: resp.emailAluno,
          alunoNome: resp.nomeAluno,
          empresaEmail: resp.emailEmpresa,
          empresaNome: resp.empresaNome,
          vantagemDescricao: resp.vantagemDescricao,
          codigoCupom: resp.codigoCupom,
          custoMoedas: resp.custoMoedas,
        }).catch((e: any) => console.debug('EmailJS resgate (promise catch):', e))
      } catch (e) {
        console.debug('EmailJS resgate não enviado (import/config falhou):', e)
      }
      return resp
    } catch (err) {
      // Fallback para demo
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      const aluno = db.students?.find((a: any) => a.id === alunoId)
      const vantagem = db.advantages?.find((v: any) => v.id === vantagemId)
      
      if (!aluno || !vantagem) {
        throw new Error('Aluno ou vantagem não encontrados')
      }
      
      if (aluno.saldo < vantagem.custoMoedas) {
        throw new Error('Saldo insuficiente')
      }
      
      // Gerar cupom de resgate
      const codigoCupom = `CUPOM-${vantagemId}-${alunoId}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
      
      // Debitar moedas
      aluno.saldo = (aluno.saldo ?? 0) - vantagem.custoMoedas
      db.transactions = db.transactions || []
      db.transactions.push({
        id: Math.max(0, ...db.transactions.map((t: any) => t.id)) + 1,
        tipo: 'aluno_resgate',
        data: new Date().toISOString(),
        alunoId,
        valor: vantagem.custoMoedas,
        descricao: 'Resgate: ' + vantagem.descricao
      })
      
      localStorage.setItem('lab03-demo-db', JSON.stringify(db))
      
      return {
        vantagemId,
        vantagemDescricao: vantagem.descricao,
        custoMoedas: vantagem.custoMoedas,
        codigoCupom,
        dataResgate: new Date().toISOString(),
        novoSaldo: aluno.saldo,
        emailAluno: aluno.email,
        nomeAluno: aluno.nome,
        empresaNome: vantagem.empresaNome || 'Empresa',
        emailEmpresa: 'empresa@example.com',
        emailEnviado: false
      }
    }
  },
}

// Helper para enriquecer transações com nomes de alunos
async function enriquecerComNomesAlunos(transacoes: TransacaoDTO[]): Promise<TransacaoDTO[]> {
  return Promise.all(transacoes.map(async (t: TransacaoDTO) => {
    if (!t.usuario.nome && t.usuario.id && t.usuario.id !== 1) {
      try {
        const aluno = await alunosAPI.buscarPorId(t.usuario.id)
        return { ...t, usuario: { ...t.usuario, nome: aluno?.nome || `Aluno #${t.usuario.id}` } }
      } catch {
        return { ...t, usuario: { ...t.usuario, nome: `Aluno #${t.usuario.id}` } }
      }
    }
    return { ...t, usuario: { ...t.usuario, nome: t.usuario.nome || `Aluno #${t.usuario.id}` } }
  }))
}

export const transacaoAPI = {
  async listar(): Promise<TransacaoDTO[]> {
    try {
      const result = await apiCall<any>('/api/transacoes', {
        method: 'GET',
      })
      
      // Mapear resposta do backend para TransacaoDTO
      let transacoes = Array.isArray(result) ? result.map((t: any) => ({
        id: t.id || 0,
        usuario: {
          // Campo correto é usuarioDestinoId (camelCase)
          id: t.usuarioDestinoId || t.usuario_destino_id || t.usuario?.id || t.alunoId || t.usuarioId || 1,
          nome: t.usuarioDestinoNome || t.usuario_destino_nome || t.usuario?.nome || t.usuarioNome || '',
        },
        data: t.data || new Date().toISOString(),
        valor: t.valor || 0,
        tipo: t.tipo || 'CREDITO',
        motivo: t.motivo || t.descricao || '',
      })) : []
      
      // Enriquecer com nomes de alunos quando necessário
      transacoes = await enriquecerComNomesAlunos(transacoes)
      return transacoes
    } catch (err) {
      console.error('Erro na API de transações:', err)
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      return (db.transactions || []).map((t: any) => ({
        id: t.id,
        usuario: {
          id: t.usuarioDestinoId || t.alunoId || t.professorId || 1,
          nome: t.usuarioDestinoNome || 'Usuário',
        },
        data: t.data,
        valor: t.valor,
        tipo: t.tipo,
        motivo: t.descricao || t.motivo || '',
      }))
    }
  },

  async listarPorAluno(alunoId: number): Promise<TransacaoDTO[]> {
    try {
      const result = await apiCall<any>(`/api/transacoes/aluno/${alunoId}`, {
        method: 'GET',
      })
      
      // Mapear resposta do backend para TransacaoDTO
      let transacoes = Array.isArray(result) ? result.map((t: any) => ({
        id: t.id || 0,
        usuario: {
          // Campo correto é usuarioDestinoId (camelCase)
          id: t.usuarioDestinoId || t.usuario_destino_id || t.usuario?.id || t.alunoId || alunoId,
          nome: t.usuarioDestinoNome || t.usuario_destino_nome || t.usuario?.nome || t.usuarioNome || '',
        },
        data: t.data || new Date().toISOString(),
        valor: t.valor || 0,
        tipo: t.tipo || 'CREDITO',
        motivo: t.motivo || t.descricao || '',
      })) : []
      
      // Enriquecer com nomes de alunos quando necessário
      transacoes = await enriquecerComNomesAlunos(transacoes)
      return transacoes
    } catch (err) {
      console.error('Erro na API de transações:', err)
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      return (db.transactions || [])
        .filter((t: any) => t.alunoId === alunoId)
        .map((t: any) => ({
          id: t.id,
          usuario: {
            id: t.usuarioDestinoId || t.alunoId || t.professorId || 1,
            nome: t.usuarioDestinoNome || 'Você',
          },
          data: t.data,
          valor: t.valor,
          tipo: t.tipo,
          motivo: t.descricao || t.motivo || '',
        }))
    }
  },

  async listarPorTipo(tipo: string): Promise<TransacaoDTO[]> {
    try {
      const result = await apiCall<any>(`/api/transacoes/tipo/${tipo}`, {
        method: 'GET',
      })
      
      let transacoes = Array.isArray(result) ? result.map((t: any) => ({
        id: t.id || 0,
        usuario: {
          // Campo correto é usuarioDestinoId (camelCase)
          id: t.usuarioDestinoId || t.usuario_destino_id || t.usuario?.id || t.alunoId || t.usuarioId || 1,
          nome: t.usuarioDestinoNome || t.usuario_destino_nome || t.usuario?.nome || t.usuarioNome || '',
        },
        data: t.data || new Date().toISOString(),
        valor: t.valor || 0,
        tipo: t.tipo || 'CREDITO',
        motivo: t.motivo || t.descricao || '',
      })) : []
      
      // Enriquecer com nomes de alunos quando necessário
      transacoes = await enriquecerComNomesAlunos(transacoes)
      return transacoes
    } catch (err) {
      console.error('Erro na API de transações:', err)
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      return (db.transactions || [])
        .filter((t: any) => t.tipo === tipo)
        .map((t: any) => ({
          id: t.id,
          usuario: {
            id: t.usuarioDestinoId || t.alunoId || t.professorId || 1,
            nome: t.usuarioDestinoNome || 'Usuário',
          },
          data: t.data,
          valor: t.valor,
          tipo: t.tipo,
          motivo: t.descricao || t.motivo || '',
        }))
    }
  },

  async buscarPorId(id: number): Promise<TransacaoDTO | null> {
    try {
      const result = await apiCall<any>(`/api/transacoes/${id}`, {
        method: 'GET',
      })
      
      if (!result) return null
      
      let transacao: TransacaoDTO = {
        id: result.id || 0,
        usuario: {
          // Campo correto é usuarioDestinoId (camelCase)
          id: result.usuarioDestinoId || result.usuario_destino_id || result.usuario?.id || result.alunoId || result.usuarioId || 1,
          nome: result.usuarioDestinoNome || result.usuario_destino_nome || result.usuario?.nome || result.usuarioNome || '',
        },
        data: result.data || new Date().toISOString(),
        valor: result.valor || 0,
        tipo: result.tipo || 'CREDITO',
        motivo: result.motivo || result.descricao || '',
      }
      
      // Enriquecer com nome de aluno quando necessário
      if (!transacao.usuario.nome && transacao.usuario.id && transacao.usuario.id !== 1) {
        try {
          const aluno = await alunosAPI.buscarPorId(transacao.usuario.id)
          transacao.usuario.nome = aluno?.nome || `Aluno #${transacao.usuario.id}`
        } catch {
          transacao.usuario.nome = `Aluno #${transacao.usuario.id}`
        }
      }
      
      return transacao
    } catch {
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      const t = (db.transactions || []).find((tx: any) => tx.id === id)
      if (!t) return null
      return {
        id: t.id,
        usuario: {
          id: t.alunoId || t.professorId || 1,
          nome: 'Usuário',
        },
        data: t.data,
        valor: t.valor,
        tipo: t.tipo,
        motivo: t.descricao || t.motivo || '',
      }
    }
  },

  async listarEnviosProfessor(professorId: number): Promise<TransacaoDTO[]> {
    try {
      const result = await apiCall<any>(`/api/transacoes/professor/${professorId}`, {
        method: 'GET',
      })
      
      // Mapear resposta do backend para TransacaoDTO
      let transacoes = Array.isArray(result) ? result.map((t: any) => ({
        id: t.id || 0,
        usuario: {
          // Campo correto é usuarioDestinoId (camelCase)
          id: t.usuarioDestinoId || t.usuario_destino_id || t.alunoId || t.usuario?.id || 1,
          // Campo correto é usuarioDestinoNome (camelCase)
          nome: t.usuarioDestinoNome || t.usuario_destino_nome || t.alunoNome || t.nomeAluno || '',
        },
        data: t.data || new Date().toISOString(),
        valor: t.valor || 0,
        tipo: t.tipo || 'ENVIO',
        motivo: t.motivo || t.descricao || '',
      })) : []

      // Enriquecer com nomes de alunos quando necessário (se nome estiver vazio)
      transacoes = await enriquecerComNomesAlunos(transacoes)
      return transacoes
    } catch (err) {
      console.error('Erro ao buscar envios do professor:', err)
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      return (db.transactions || [])
        .filter((t: any) => t.tipo === 'ENVIO' && t.professorId === professorId)
        .map((t: any) => ({
          id: t.id,
          usuario: {
            id: t.usuarioDestinoId || t.alunoId || 1,
            nome: t.usuarioDestinoNome || t.alunoNome || 'Aluno',
          },
          data: t.data,
          valor: t.valor,
          tipo: t.tipo,
          motivo: t.descricao || t.motivo || '',
        }))
    }
  },

  async enviarMoedas(professorId: number, alunoId: number, quantidade: number, motivo: string): Promise<any> {
    try {
      const response = await apiCall<any>(`/api/professores/${professorId}/enviar-moedas`, {
        method: 'POST',
        body: JSON.stringify({
          alunoId: alunoId,
          quantidade: quantidade,
          motivo: motivo
        })
      })
      return response
    } catch (err) {
      console.error('Erro ao enviar moedas:', err)
      // Fallback: usar adicionarMoedas (compatibilidade)
      await this.adicionarMoedas(alunoId, quantidade)
      return { id: 0, alunoId, quantidade, motivo }
    }
  },

  async adicionarMoedas(alunoId: number, quantidade: number): Promise<AlunoDTO> {
    try {
      return await apiCall<AlunoDTO>(`/api/alunos/${alunoId}/adicionar-moedas?quantidade=${quantidade}`, {
        method: 'PATCH',
      })
    } catch {
      const { demoStore } = await import('./store')
      const db = demoStore.getDB()
      const aluno = db.users.find((u: any) => u.id === alunoId) as any
      if (aluno) {
        aluno.saldoMoedas = (aluno.saldoMoedas || 0) + quantidade
      }
      return {
        id: alunoId,
        nome: aluno?.name || 'Aluno',
        documento: '',
        email: aluno?.email || '',
        login: aluno?.login || '',
        rg: '',
        endereco: '',
        curso: '',
        saldoMoedas: (aluno?.saldoMoedas || 0) + quantidade,
        instituicaoId: 1,
      }
    }
  },
}
