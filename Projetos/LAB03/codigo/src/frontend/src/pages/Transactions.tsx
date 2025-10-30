import PageHeader from '../components/PageHeader'
import { useAuth } from '../context/Auth'
import { useMemo, useState, useEffect } from 'react'
import { transacoesAPI, TransacaoDTO, alunosAPI } from '../lib/api'
import { useToast } from '../hooks/use-toast'

export default function Transactions() {
  const { user } = useAuth()
  const { error } = useToast()
  const [transacoes, setTransacoes] = useState<TransacaoDTO[]>([])
  const [saldoAtual, setSaldoAtual] = useState(0)
  const [loading, setLoading] = useState(true)

  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState<'todos' | 'ENVIO' | 'RESGATE' | 'CREDITO'>('todos')
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')

  useEffect(() => {
    if (user && user.role === 'aluno') {
      loadData()
    }
  }, [user])

  async function loadData() {
    try {
      setLoading(true)
      if (user && user.role === 'aluno') {
        // Load transactions
        const txs = await transacoesAPI.listarPorAluno(user.id)
        setTransacoes(txs)

        // Load current balance
        const aluno = await alunosAPI.buscarPorId(user.id)
        setSaldoAtual(aluno.saldoMoedas)
      }
    } catch (err) {
      error('Erro ao carregar transações')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtradas = useMemo(() => {
    return transacoes.filter(t => {
      if (tipo !== 'todos' && t.tipo !== tipo) return false
      const searchText = `${t.motivo} ${t.usuarioNome || ''}`.toLowerCase()
      if (q && !searchText.includes(q.toLowerCase())) return false
      const dataStr = new Date(t.data).toISOString().split('T')[0]
      if (de && dataStr < de) return false
      if (ate && dataStr > ate) return false
      return true
    })
  }, [transacoes, q, tipo, de, ate])

  const creditos30 = transacoes
    .filter(t => t.tipo === 'ENVIO' || t.tipo === 'CREDITO')
    .reduce((a, b) => a + b.valor, 0)

  const debitos30 = transacoes
    .filter(t => t.tipo === 'RESGATE')
    .reduce((a, b) => a + Math.abs(b.valor), 0)

  if (!user) return <div className="text-center py-8">Faça login para ver seu extrato.</div>
  if (loading) return <div className="text-center py-8">Carregando...</div>

  return (
    <div className="space-y-6">
      <PageHeader title="Extrato" action={<span className="text-sm text-slate-500">Aluno</span>} />

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-xs text-slate-500">Saldo Atual</div>
          <div className="text-2xl font-semibold">{saldoAtual} moedas</div>
          <div className="text-xs text-slate-400 mt-1">Disponível para resgate</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">Recebidas</div>
          <div className="text-2xl font-semibold">{creditos30}</div>
          <div className="text-xs text-slate-400 mt-1">Últimos lançamentos</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">Resgatadas</div>
          <div className="text-2xl font-semibold">{debitos30}</div>
          <div className="text-xs text-slate-400 mt-1">Últimos lançamentos</div>
        </div>
      </div>

      <div className="card p-4">
        <div className="grid md:grid-cols-4 gap-3 mb-4">
          <input className="input" placeholder="Buscar por descrição/origem" value={q} onChange={e => setQ(e.target.value)} />
          <select className="input" value={tipo} onChange={e => setTipo(e.target.value as any)}>
            <option value="todos">Todos</option>
            <option value="ENVIO">Recebimento</option>
            <option value="RESGATE">Resgate</option>
            <option value="CREDITO">Crédito</option>
          </select>
          <input className="input" type="date" value={de} onChange={e => setDe(e.target.value)} />
          <input className="input" type="date" value={ate} onChange={e => setAte(e.target.value)} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Data</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th className="text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtradas.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-slate-500">Nenhuma transação encontrada</td></tr>
              ) : (
                filtradas.map(t => {
                  const dataStr = new Date(t.data).toLocaleDateString('pt-BR')
                  const valorDisplay = t.tipo === 'RESGATE' ? -Math.abs(t.valor) : t.valor
                  return (
                    <tr key={t.id}>
                      <td className="py-2">{dataStr}</td>
                      <td>{t.motivo}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-xs ${t.tipo === 'ENVIO' ? 'bg-green-100 text-green-700' :
                            t.tipo === 'RESGATE' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                          }`}>
                          {t.tipo}
                        </span>
                      </td>
                      <td className={`text-right font-medium ${valorDisplay >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {valorDisplay >= 0 ? `+${valorDisplay}` : valorDisplay}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
