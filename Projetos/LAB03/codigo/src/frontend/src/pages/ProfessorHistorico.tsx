import PageHeader from '../components/PageHeader'
import { useAuth } from '../context/Auth'
import { useMemo, useState, useEffect } from 'react'
import { transacaoAPI, TransacaoDTO } from '../lib/api'

export default function ProfessorHistorico() {
  const { user } = useAuth()

  const [transacoes, setTransacoes] = useState<TransacaoDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')

  useEffect(() => {
    async function carregarEnvios() {
      try {
        setLoading(true)
        let txs: TransacaoDTO[] = []
        
        if (user && user.id) {
          // Carregar envios de moedas feitos por este professor
          txs = await transacaoAPI.listarEnviosProfessor(user.id)
        }
        
        setTransacoes(txs)
      } catch (err) {
        console.error('Erro ao carregar envios:', err)
      } finally {
        setLoading(false)
      }
    }
    
    carregarEnvios()
  }, [user])

  const filtradas = useMemo(() => {
    return transacoes.filter(t => {
      if (q && !(`${t.usuario.nome} ${t.motivo}`.toLowerCase().includes(q.toLowerCase()))) return false
      if (de && t.data < de) return false
      if (ate && t.data > ate) return false
      return true
    })
  }, [transacoes, q, de, ate])

  const totalEnviado = transacoes.reduce((a, b) => a + b.valor, 0)
  const alunosAtendidos = new Set(transacoes.map(x => x.usuario.nome)).size

  const formatData = (dataStr: string) => {
    const data = new Date(dataStr)
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (!user) return <div className="text-center py-8">Faça login para ver seu histórico.</div>

  return (
    <div className="space-y-6">
      <PageHeader title="Extrato do Professor" action={<span className="text-sm text-slate-500">Envios</span>} />

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-xs text-slate-500">Saldo do Semestre</div>
          <div className="text-2xl font-semibold">{1000 - totalEnviado} moedas</div>
          <div className="text-xs text-slate-400 mt-1">Disponível para enviar</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">Total Enviado</div>
          <div className="text-2xl font-semibold">{totalEnviado}</div>
          <div className="text-xs text-slate-400 mt-1">No período</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">Alunos Reconhecidos</div>
          <div className="text-2xl font-semibold">{alunosAtendidos}</div>
          <div className="text-xs text-slate-400 mt-1">Únicos</div>
        </div>
      </div>

      <div className="card p-4">
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <input className="input" placeholder="Buscar por aluno/motivo" value={q} onChange={e => setQ(e.target.value)} />
          <input className="input" type="date" value={de} onChange={e => setDe(e.target.value)} />
          <input className="input" type="date" value={ate} onChange={e => setAte(e.target.value)} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Data</th>
                <th>Aluno</th>
                <th>Motivo</th>
                <th className="text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={4} className="py-6 text-center text-slate-500">Carregando...</td></tr>
              ) : filtradas.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-slate-500">Nenhuma transferência encontrada</td></tr>
              ) : (
                filtradas.map(t => (
                  <tr key={t.id}>
                    <td className="py-2">{formatData(t.data)}</td>
                    <td>{t.usuario.nome}</td>
                    <td>{t.motivo}</td>
                    <td className="text-right text-emerald-600">+{t.valor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
