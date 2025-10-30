import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Role } from '../lib/store'
import { useAuth, defaultDashboard } from '../context/Auth'
import { useToast } from '../hooks/use-toast'

export default function Login({ fixedRole }: { fixedRole?: Role }) {
  const [loginInput, setLoginInput] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>(fixedRole || 'aluno')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const loc = useLocation()
  const { login } = useAuth()
  const { success, error } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!loginInput || !password) {
      error('Por favor, preencha todos os campos')
      return
    }

    setLoading(true)
    try {
      await login(loginInput, password)
      success('Login realizado com sucesso!')

      // Get user role from response to determine redirect
      const userData = JSON.parse(localStorage.getItem('lab03-auth') || '{}')
      const userRole = userData.role || role

      const to = (loc.state as any)?.from?.pathname || defaultDashboard(userRole)
      navigate(to, { replace: true })
    } catch (err: any) {
      error(err.message || 'Falha no login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left promotional panel */}
          <div className="hidden md:flex flex-col justify-center px-8 py-12 rounded-lg bg-gradient-to-br from-sky-600 to-indigo-700 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-md bg-white/20 flex items-center justify-center text-white font-bold text-lg">SC</div>
              <div>
                <div className="text-2xl font-bold">Student Coin</div>
                <div className="text-sm opacity-90">Programa de reconhecimento e benefícios para alunos</div>
              </div>
            </div>
            <h3 className="text-3xl font-extrabold leading-tight mb-4">Reconheça, incentive e transforme</h3>
            <p className="opacity-90">Distribua moedas, gere histórico de reconhecimentos e permita resgates por vantagens — tudo pensado para a comunidade acadêmica.</p>
          </div>

          {/* Right: form card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xl">SC</div>
                <h2 className="text-2xl font-semibold mt-3">Entrar</h2>
                <p className="text-sm text-slate-500 mt-1">Acesse sua conta</p>
              </div>

              {/* Role tabs */}
              <div className="grid grid-cols-3 gap-1 mb-4 bg-slate-100 p-1 rounded-md text-sm">
                <Link to="/login/aluno" onClick={() => setRole('aluno')} className={`px-3 py-2 text-center rounded ${role === 'aluno' ? 'bg-white shadow font-medium' : 'text-slate-600 hover:text-slate-800'}`}>Aluno</Link>
                <Link to="/login/professor" onClick={() => setRole('professor')} className={`px-3 py-2 text-center rounded ${role === 'professor' ? 'bg-white shadow font-medium' : 'text-slate-600 hover:text-slate-800'}`}>Professor</Link>
                <Link to="/login/empresa" onClick={() => setRole('empresa')} className={`px-3 py-2 text-center rounded ${role === 'empresa' ? 'bg-white shadow font-medium' : 'text-slate-600 hover:text-slate-800'}`}>Empresa</Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Login</label>
                  <input
                    className="input"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="seu.login ou email"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="label">Senha</label>
                  <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  {role === 'aluno' && (
                    <Link to="/cadastro-aluno" className="text-sky-600 hover:underline text-sm">Novo por aqui? Cadastre-se</Link>
                  )}
                  {role === 'professor' && (
                    <Link to="/cadastro-professor" className="text-sky-600 hover:underline text-sm">Sou professor — Cadastrar</Link>
                  )}
                  {role === 'empresa' && (
                    <Link to="/empresa" className="text-sky-600 hover:underline text-sm">Área da empresa</Link>
                  )}
                  <button type="submit" className="btn bg-sky-600 hover:bg-sky-700 text-white" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
