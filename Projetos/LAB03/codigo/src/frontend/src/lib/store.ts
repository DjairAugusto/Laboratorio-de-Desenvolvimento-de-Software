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
  transactions: Array<{ id: number; tipo: 'prof_envio' | 'aluno_recebimento' | 'aluno_resgate'; data: string; professorId?: number; alunoId?: number; valor: number; motivo?: string; descricao?: string }>
}

function defaultDB(): DemoDB {
  return {
    users: [
      { id: 1, role: 'aluno', name: 'Ana Lima', email: 'ana@uni.br', login: 'ana@uni.br', senha: 'demo' },
      { id: 2, role: 'professor', name: 'Carlos Souza', email: 'carlos@uni.br', login: 'carlos@uni.br', senha: 'demo' },
      { id: 4, role: 'professor', name: 'Professor Demo', email: 'prof@uni.br', login: 'prof@uni.br', senha: 'demo' },
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

// Ensure seed users/students exist even if a previous demo DB is present
function ensureSeeds(db: DemoDB): DemoDB {
  // Ensure demo users
  const ensureUser = (role: Role, name: string, email: string, login: string) => {
    const exists = db.users.some((u) => u.login === login || u.email === email)
    if (!exists) {
      const nextId = Math.max(0, ...db.users.map((u) => u.id)) + 1
      db.users.push({ id: nextId, role, name, email, login, senha: 'demo' })
    }
  }
  ensureUser('aluno', 'Ana Lima', 'ana@uni.br', 'ana@uni.br')
  ensureUser('professor', 'Professor Demo', 'prof@uni.br', 'prof@uni.br')

  // Ensure Ana student exists
  const alunoAna = db.students.some((s: any) => s.email === 'ana@uni.br')
  if (!alunoAna) {
    const nextId = Math.max(0, ...db.students.map((s: any) => s.id || 0)) + 1
    db.students.push({ id: nextId, nome: 'Ana Lima', email: 'ana@uni.br', cpf: '000.000.000-00', rg: '00.000.000-0', instituicao: 'Universidade X', curso: 'Engenharia', endereco: 'Rua Demo, 1', saldo: 1250 })
  }
  return db
}

// Initialize/repair demo DB on import
const _db = ensureSeeds(loadDB())
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

  criarProfessor({ nome, cpf, departamento, email, login, senha, instituicaoId }: { nome: string; cpf: string; departamento: string; email: string; login: string; senha?: string; instituicaoId: number }) {
    const db = loadDB()
    if (db.users.some(u => u.login === login || u.email === email)) {
      // Avoid duplicates in demo; append suffix to login
      login = `${login}.${Date.now()}`
    }
    const nextId = Math.max(0, ...db.users.map(u => u.id)) + 1
    const user = { id: nextId, role: 'professor' as Role, name: nome, email, login, senha }
    db.users.push(user)
    saveDB(db)
    return user
  },

  // Professor sends coins to a student (demo mode)
  sendCoins({ professorId, alunoId, valor, motivo }: { professorId: number; alunoId: number; valor: number; motivo: string }) {
    const db = loadDB()
    // Update student's saldo
    const aluno = db.students.find((s) => (s as any).id === alunoId)
    if (aluno) {
      aluno.saldo = (aluno.saldo ?? 0) + Math.max(0, valor)
    }
    // Record transactions (both sides)
    const idBase = Math.max(0, ...db.transactions.map((t) => t.id)) + 1
    const today = new Date().toISOString().slice(0, 10)
    db.transactions.push({ id: idBase, tipo: 'prof_envio', data: today, professorId, alunoId, valor: Math.max(0, valor), motivo, descricao: `Envio para aluno ${aluno?.nome ?? alunoId}` })
    db.transactions.push({ id: idBase + 1, tipo: 'aluno_recebimento', data: today, professorId, alunoId, valor: Math.max(0, valor), motivo, descricao: `Reconhecimento do professor` })
    saveDB(db)
    return { ok: true }
  },

  listarTransacoesAluno(alunoId: number) {
    const db = loadDB()
    return db.transactions.filter((t) => t.alunoId === alunoId && (t.tipo === 'aluno_recebimento' || t.tipo === 'aluno_resgate'))
  },

  listarEnviosProfessor(professorId: number) {
    const db = loadDB()
    return db.transactions.filter((t) => t.professorId === professorId && t.tipo === 'prof_envio')
  },
}

export function defaultDashboard(role: Role) {
  if (role === 'aluno') return '/dashboard'
  if (role === 'professor') return '/prof/dashboard'
  return '/empresa'
}
