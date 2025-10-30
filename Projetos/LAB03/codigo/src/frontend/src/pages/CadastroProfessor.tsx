import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { professoresAPI } from '../lib/api'
import { useToast } from '../hooks/use-toast'

export default function CadastroProfessor() {
  const navigate = useNavigate()
  const { success, error } = useToast()

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [departamento, setDepartamento] = useState('')
  const [email, setEmail] = useState('')
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [instituicaoId, setInstituicaoId] = useState<number>(1)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome || !cpf || !departamento || !email || !login || !senha) {
      error('Por favor, preencha todos os campos obrigatórios')
      return
    }
    setLoading(true)
    try {
      await professoresAPI.criar({
        nome,
        cpf,
        departamento,
        email,
        login,
        senha,
        instituicaoId,
      })
      success('Cadastro realizado com sucesso! Você já pode entrar.')
      navigate('/login/professor')
    } catch (err: any) {
      error(err.message || 'Falha ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:flex flex-col justify-center px-8 py-12 rounded-lg bg-gradient-to-br from-sky-600 to-indigo-700 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-md bg-white/20 flex items-center justify-center text-white font-bold text-lg">SC</div>
              <div>
                <div className="text-2xl font-bold">Student Coin</div>
                <div className="text-sm opacity-90">Cadastre-se como professor para reconhecer seus alunos</div>
              </div>
            </div>
            <h3 className="text-3xl font-extrabold leading-tight mb-4">Incentive e reconheça</h3>
            <p className="opacity-90">Crie sua conta para enviar moedas e acompanhar seu histórico de reconhecimentos.</p>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xl">SC</div>
                <h2 className="text-2xl font-semibold mt-3">Criar conta de professor</h2>
                <p className="text-sm text-slate-500 mt-1">Preencha os dados para criar sua conta</p>
              </div>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Nome completo</label>
                  <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
                <div>
                  <label className="label">CPF</label>
                  <input className="input" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="label">Departamento</label>
                  <input className="input" value={departamento} onChange={(e) => setDepartamento(e.target.value)} placeholder="Computação" />
                </div>
                <div>
                  <label className="label">E-mail</label>
                  <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="label">Login</label>
                  <input className="input" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="seu.login" />
                </div>
                <div>
                  <label className="label">Senha</label>
                  <input className="input" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
                </div>
                <div>
                  <label className="label">Instituição de Ensino (ID)</label>
                  <input className="input" type="number" value={instituicaoId} onChange={(e) => setInstituicaoId(Number(e.target.value))} />
                </div>
                <div className="md:col-span-2 flex justify-between items-center">
                  <div className="text-sm text-slate-500">Já tem conta? <a className="text-sky-600 hover:underline" href="/login/professor">Entrar</a></div>
                  <button className="btn bg-sky-600 hover:bg-sky-700 text-white" type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Concluir Cadastro'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
