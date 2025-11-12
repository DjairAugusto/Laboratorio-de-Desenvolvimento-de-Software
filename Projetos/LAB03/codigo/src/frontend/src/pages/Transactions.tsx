import PageHeader from '../components/PageHeader'
import { useAuth } from '../context/Auth'
import { useMemo, useState, useEffect } from 'react'
import { transacaoAPI, TransacaoDTO, alunosAPI, AlunoDTO } from '../lib/api'

export default function Transactions() {
  const { user } = useAuth()

  const [transacoes, setTransacoes] = useState<TransacaoDTO[]>([])
  const [aluno, setAluno] = useState<AlunoDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState<'todos' | 'ENVIO' | 'RESGATE' | 'CREDITO'>('todos')
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true)
        let txs: TransacaoDTO[] = []
        let alunoData: AlunoDTO | null = null
        
        if (user && user.id) {
          // Carregar transações do aluno autenticado
          txs = await transacaoAPI.listarPorAluno(user.id)
          // Carregar dados do aluno para obter saldoMoedas
          alunoData = await alunosAPI.buscarPorId(user.id)
        } else {
          // Fallback: carregar todas
          txs = await transacaoAPI.listar()
        }
        
        setTransacoes(txs)
        setAluno(alunoData)
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      } finally {
        setLoading(false)
      }
    }
    
    carregarDados()
  }, [user])

  const filtradas = useMemo(() => {
    return transacoes.filter(t => {
      if (tipo !== 'todos' && t.tipo !== tipo && t.tipo.toUpperCase() !== tipo) return false
      if (q && !(`${t.motivo} ${t.usuario.nome}`.toLowerCase().includes(q.toLowerCase()))) return false
      if (de && t.data < de) return false
      if (ate && t.data > ate) return false
      return true
    })
  }, [transacoes, q, tipo, de, ate])

  const saldo = transacoes.reduce((acc, t) => acc + t.valor, 0)
  const creditos = transacoes.filter(t => t.valor > 0).reduce((a, b) => a + b.valor, 0)
  const debitos = transacoes.filter(t => t.valor < 0).reduce((a, b) => a + Math.abs(b.valor), 0)

  const formatData = (dataStr: string) => {
    const data = new Date(dataStr)
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (!user) return <div className="text-center py-8">Faça login para ver seu extrato.</div>

  return (
    <div className="space-y-6">
      <PageHeader title="Extrato" action={<span className="text-sm text-slate-500">Aluno</span>} />

      <div className="grid md:gridgap-4">
        <div className="card p-4">
          <div className="text-xs text-slate-500">Saldo Atual</div>
          <div className="text-2xl font-semibold">{aluno?.saldoMoedas ?? 0} moedas</div>
          <div className="text-xs text-slate-400 mt-1">Quantidade total de moedas</div>
        </div>
        {/* <div className="card p-4">
          <div className="text-xs text-slate-500">Recebidas</div>
          <div className="text-2xl font-semibold">{creditos}</div>
          <div className="text-xs text-slate-400 mt-1">Últimos lançamentos</div>
        </div> */}
        {/* <div className="card p-4">
          <div className="text-xs text-slate-500">Resgatadas</div>
          <div className="text-2xl font-semibold">{debitos}</div>
          <div className="text-xs text-slate-400 mt-1">Últimos lançamentos</div>
        </div> */}
      </div>

      <div className="card p-4">
        <div className="grid md:grid-cols-4 gap-3 mb-4">
          <input className="input" placeholder="Buscar por descrição/usuario" value={q} onChange={e => setQ(e.target.value)} />
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
                <th>Usuário</th>
                <th className="text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={4} className="py-6 text-center text-slate-500">Carregando...</td></tr>
              ) : filtradas.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-slate-500">Nenhuma transação encontrada</td></tr>
              ) : (
                filtradas.map(t => (
                  <tr key={t.id}>
                    <td className="py-2">{formatData(t.data)}</td>
                    <td>{t.motivo}</td>
                    <td>{t.usuario.nome}</td>
                    <td className={`text-right ${t.valor >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{t.valor >= 0 ? `+${t.valor}` : t.valor}</td>
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
