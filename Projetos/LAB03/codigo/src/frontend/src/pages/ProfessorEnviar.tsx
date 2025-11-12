import PageHeader from '../components/PageHeader'
import { alunosAPI, professoresAPI, transacaoAPI } from '../lib/api'
import { useState, useEffect } from 'react'
import { useToast } from '../hooks/use-toast'
import { useAuth } from '../context/Auth'

export default function ProfessorEnviar() {
  const { user } = useAuth()
  const [alunos, setAlunos] = useState<any[]>([])
  const [studentId, setStudentId] = useState<number | null>(null)
  const [value, setValue] = useState(100)
  const [turma, setTurma] = useState('')
  const [reason, setReason] = useState('Reconhecimento do Professor')
  const [saldoEnviado, setSaldoEnviado] = useState(0)
  const [loading, setLoading] = useState(false)
  const { success, error } = useToast()
  

  useEffect(() => {
    async function loadData() {
      try {
        const data = await alunosAPI.listar()
        setAlunos(data)
        if (data.length > 0) setStudentId(data[0].id!)
      } catch (err) {
        error('Erro ao carregar lista de alunos')
      }
    }
    loadData()
  }, [error])

  // Carregar saldo enviado (total enviado no período)
  useEffect(() => {
    async function loadSaldoEnviado() {
      if (!user?.id) return
      try {
        const envios = await transacaoAPI.listarEnviosProfessor(user.id)
        const total = envios.reduce((acc, t) => acc + t.valor, 0)
        setSaldoEnviado(total)
      } catch (err) {
        console.error('Erro ao carregar saldo enviado:', err)
      }
    }
    loadSaldoEnviado()
  }, [user?.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!studentId || !user?.id) return

    try {
      setLoading(true)
      await alunosAPI.enviarMoedas(user.id, studentId, value, reason)
      success('Moedas enviadas com sucesso!')
      setValue(100)
      setTurma('')
      setReason('Reconhecimento do Professor')
      
      // Recarregar saldo enviado
      const envios = await transacaoAPI.listarEnviosProfessor(user.id)
      const total = envios.reduce((acc, t) => acc + t.valor, 0)
      setSaldoEnviado(total)
    } catch (err) {
      error('Erro ao enviar moedas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const saldoDisponivel = 1000 - saldoEnviado

  return (
    <div>
      <PageHeader title="Enviar Moedas" action={<span className="text-sm text-slate-500">Formulário</span>} />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-4 md:col-span-2">
          <h3 className="font-medium mb-4">Reconhecer Aluno</h3>
        <form className="grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="label">Aluno</label>
            <select
              className="input"
              value={studentId || ''}
              onChange={e => setStudentId(Number(e.target.value))}
              required
            >
              <option value="">Selecione um aluno</option>
              {alunos.map(s => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Quantidade de moedas</label>
            <input
              className="input"
              type="number"
              value={value}
              onChange={e => setValue(Number(e.target.value))}
              min="1"
              max={saldoDisponivel}
              required
              disabled={saldoDisponivel <= 0}
            />
          </div>
          <div>
            <label className="label">Turma (opcional)</label>
            <input
              className="input"
              placeholder="ENG-2025"
              value={turma}
              onChange={e => setTurma(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Motivo do reconhecimento</label>
            <textarea
              className="input min-h-[96px]"
              placeholder="Descreva o motivo aqui..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button 
              className="btn" 
              type="submit"
              disabled={loading || !studentId || saldoDisponivel <= 0}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">Saldo disponível (semestre)</div>
          <div className="text-2xl font-semibold">{saldoDisponivel} moedas</div>
          <div className="text-xs text-slate-400 mt-1">Total enviado: {saldoEnviado}</div>
          <div className="mt-4 text-sm text-slate-600">Use o campo "Motivo" para explicar o reconhecimento. O aluno será notificado por e-mail (quando integrado).</div>
        </div>
      </div>
    </div>
  )
}
