import PageHeader from '../components/PageHeader'
import { alunosAPI, professoresAPI, ProfessorDTO } from '../lib/api'
import { useState, useEffect } from 'react'
import { useToast } from '../hooks/use-toast'
import { useAuth } from '../context/Auth'

export default function ProfessorEnviar() {
  const { user } = useAuth()
  const [alunos, setAlunos] = useState<any[]>([])
  const [professorData, setProfessorData] = useState<ProfessorDTO | null>(null)
  const [studentId, setStudentId] = useState<number | null>(null)
  const [value, setValue] = useState(100)
  const [reason, setReason] = useState('Reconhecimento do Professor')
  const [submitting, setSubmitting] = useState(false)
  const { success, error } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Load students
      const alunosData = await alunosAPI.listar()
      setAlunos(alunosData)
      if (alunosData.length > 0) setStudentId(alunosData[0].id!)

      // Load professor data to get saldo
      if (user && user.role === 'professor') {
        const prof = await professoresAPI.buscarPorId(user.id)
        setProfessorData(prof)
      }
    } catch (err) {
      error('Erro ao carregar dados')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!studentId || !user || user.role !== 'professor') return

    try {
      setSubmitting(true)
      await professoresAPI.enviarMoedas(user.id, {
        alunoId: studentId,
        quantidade: value,
        motivo: reason,
      })
      success('Moedas enviadas com sucesso!')
      setValue(100)
      setReason('Reconhecimento do Professor')
      // Reload professor data to update balance
      loadData()
    } catch (err: any) {
      error(err.message || 'Erro ao enviar moedas. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

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
                required
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
              <button className="btn" type="submit" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">Saldo disponível</div>
          <div className="text-2xl font-semibold">{professorData?.saldoMoedas ?? 0} moedas</div>
          <div className="text-xs text-slate-400 mt-1">Semestre atual</div>
          <div className="mt-4 text-sm text-slate-600">Use o campo "Motivo" para explicar o reconhecimento. O aluno será notificado por e-mail.</div>
        </div>
      </div>
    </div>
  )
}
