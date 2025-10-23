import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { alunosAPI } from '../lib/api'
import { useToast } from '../hooks/use-toast'

export default function CadastroAluno() {
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [email, setEmail] = useState('')
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [rg, setRg] = useState('')
  const [endereco, setEndereco] = useState('')
  const [curso, setCurso] = useState('')
  const [instituicaoId, setInstituicaoId] = useState<number>(1)
  const [loading, setLoading] = useState(false)

  const { success, error } = useToast()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!nome || !documento || !email || !login || !senha || !rg || !endereco || !curso) {
      error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    try {
      await alunosAPI.criar({
        nome,
        documento,
        email,
        login,
        senha,
        rg,
        endereco,
        curso,
        saldoMoedas: 0,
        instituicaoId: instituicaoId,
      })

      success('Cadastro realizado com sucesso! Você já pode entrar.')
      navigate('/login')
    } catch (err: any) {
      // API may return a plain text error
      error(err.message || 'Falha ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="card w-full max-w-md p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-md bg-slate-200 flex items-center justify-center text-slate-400 font-bold">SC</div>
          <div>
            <div className="text-lg font-semibold">Student Coin</div>
            <div className="text-sm text-slate-500">Cadastro de Aluno</div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Criar conta de aluno</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Nome</label>
            <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} />
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
            <label className="label">CPF</label>
            <input className="input" value={documento} onChange={(e) => setDocumento(e.target.value)} placeholder="000.000.000-00" />
          </div>

          <div>
            <label className="label">RG</label>
            <input className="input" value={rg} onChange={(e) => setRg(e.target.value)} placeholder="00.000.000-0" />
          </div>

          <div className="md:col-span-2">
            <label className="label">Endereço</label>
            <input className="input" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua Exemplo, 123 - Centro" />
          </div>

          <div>
            <label className="label">Instituição de Ensino (ID)</label>
            <input className="input" type="number" value={instituicaoId} onChange={(e) => setInstituicaoId(Number(e.target.value))} />
          </div>

          <div>
            <label className="label">Curso</label>
            <input className="input" value={curso} onChange={(e) => setCurso(e.target.value)} placeholder="Engenharia de Software" />
          </div>

          <div className="md:col-span-2 flex justify-between items-center">
            <div className="text-sm text-slate-500">Já tem conta? <a className="text-brand hover:text-brand-dark" href="/login">Entrar</a></div>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Concluir Cadastro'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
