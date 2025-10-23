// Types exported for use in components
export type Role = 'aluno' | 'professor' | 'empresa'

export type User = {
  id: number
  role: Role
  name: string
  email: string
  login?: string
}

const DEMO_DB_KEY = 'lab03-demo-db'

type DemoDB = {
  users: Array<{ id: number; role: Role; name: string; email: string; login: string; senha?: string }>
  students: Array<{ id: number; nome: string; email: string; cpf?: string; rg?: string; instituicao?: string; curso?: string; endereco?: string; saldo?: number }>
  advantages: any[]
  transactions: any[]
}

function defaultDB(): DemoDB {
  return {
    users: [
      { id: 1, role: 'aluno', name: 'Ana Lima', email: 'ana@uni.br', login: 'ana@uni.br', senha: 'demo' },
      { id: 2, role: 'professor', name: 'Carlos Souza', email: 'carlos@uni.br', login: 'carlos@uni.br', senha: 'demo' },
      { id: 3, role: 'empresa', name: 'Empresa Ex', email: 'contato@empresa.com', login: 'contato@empresa.com', senha: 'demo' },
    ],
    students: [
      { id: 1, nome: 'Ana Lima', email: 'ana@uni.br', cpf: '000.000.000-00', rg: '00.000.000-0', instituicao: 'Universidade X', curso: 'Engenharia', endereco: 'Rua Demo, 1', saldo: 1250 },
    ],
    advantages: [],
    transactions: [],
  }
}

function loadDB(): DemoDB {
  try {
    const raw = localStorage.getItem(DEMO_DB_KEY)
    if (!raw) return defaultDB()
    return JSON.parse(raw)
  } catch (e) {
    return defaultDB()
  }
}

function saveDB(db: DemoDB) {
  localStorage.setItem(DEMO_DB_KEY, JSON.stringify(db))
}

// Initialize demo DB on import if missing
const _db = loadDB()
saveDB(_db)

export const demoStore = {
  getDB() {
    return loadDB()
  },

  reset() {
    const d = defaultDB()
    saveDB(d)
    return d
  },

  // Simple login that does not strictly check senha: any non-empty senha is accepted
  login(loginInput: string, senha?: string) {
    const db = loadDB()
    const u = db.users.find((x) => x.login === loginInput || x.email === loginInput)
    if (!u) throw new Error('Usuário não encontrado')
    // If senha is not provided or is empty, accept anyway per demo note
    if (!senha || senha.length === 0) return { id: u.id, nome: u.name, email: u.email, tipo: u.role }
    // If senha present, still accept (demo mode)
    return { id: u.id, nome: u.name, email: u.email, tipo: u.role }
  },

  findUserByLogin(loginInput: string) {
    const db = loadDB()
    return db.users.find((x) => x.login === loginInput || x.email === loginInput)
  },

  // Students helpers
  listarAlunos() {
    const db = loadDB()
    return db.students
  },

  criarAluno(aluno: any) {
    const db = loadDB()
    const nextId = Math.max(0, ...db.students.map((s) => (s as any).id || 0)) + 1
    const record = { id: nextId, ...aluno }
    db.students.push(record)
    saveDB(db)
    return record
  },
}

export function defaultDashboard(role: Role) {
  if (role === 'aluno') return '/dashboard'
  if (role === 'professor') return '/prof/historico'
  return '/empresa'
}
