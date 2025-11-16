import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { alunosAPI, transacaoAPI, TransacaoDTO } from '../lib/api'
import { useAuth } from '../context/Auth'
import { useToast } from '../hooks/use-toast'
import { useVantagens } from '../hooks/useVantagens'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { error } = useToast()
  const [aluno, setAluno] = useState<any>(null)
  const [transacoes, setTransacoes] = useState<TransacaoDTO[]>([])
  const [loading, setLoading] = useState(true)
  
  // Hook para carregar vantagens em destaque (primeiras 6)
  const { vantagens, loading: loadingVantagens } = useVantagens({ 
    page: 0, 
    size: 6, 
    sortBy: 'custoMoedas',
    direction: 'asc',
    autoLoad: true 
  })

  useEffect(() => {
    async function loadData() {
      try {
        // Prefer authenticated user if available
        if (user && user.id) {
          const a = await alunosAPI.buscarPorId(user.id)
          setAluno(a)
          // Carregar transações do aluno atual
          const txs = await transacaoAPI.listarPorAluno(user.id)
          setTransacoes(txs.slice(0, 2)) // Mostrar apenas as 2 últimas
        } else {
          const alunos = await alunosAPI.listar()
          if (alunos.length > 0) {
            setAluno(alunos[0])
            const txs = await transacaoAPI.listarPorAluno(alunos[0].id)
            setTransacoes(txs.slice(0, 2))
          }
        }
      } catch (err) {
        error('Erro ao carregar dados do dashboard')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [error, user])

  if (loading || loadingVantagens) return <div className="text-center py-8">Carregando...</div>
  if (!aluno) return <div className="text-center py-8">Nenhum aluno encontrado</div>

  const saldoTotal = aluno.saldoMoedas || 0
  const resgatadas = transacoes.filter(t => t.valor < 0).reduce((a, b) => a + Math.abs(b.valor), 0)
  const recebidas = transacoes.filter(t => t.valor > 0).reduce((a, b) => a + b.valor, 0)

  // Formatar data
  const formatData = (dataStr: string) => {
    const data = new Date(dataStr)
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  // Obter descrição baseada no tipo de transação
  const getDescricao = (tx: TransacaoDTO) => {
    const tiposDescricao: Record<string, string> = {
      'ENVIO': 'Reconhecimento do Professor',
      'RESGATE': 'Resgate de Vantagem',
      'CREDITO': 'Crédito Recebido',
      'prof_envio': 'Reconhecimento do Professor',
      'aluno_resgate': 'Resgate de Vantagem',
      'aluno_recebimento': 'Moedas Recebidas',
    }
    return tiposDescricao[tx.tipo] || tx.motivo || 'Transação'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: profile summary */}
      <div className="lg:col-span-1">
        <div className="card p-5 sticky top-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xl font-semibold">{(aluno.nome || 'U').charAt(0)}</div>
            <div>
              <div className="text-lg font-semibold">{aluno.nome}</div>
              <div className="text-sm text-slate-500">{aluno.email}</div>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-sm text-slate-500">Saldo atual</div>
            <div className="text-3xl font-bold mt-1">{saldoTotal} <span className="text-sm font-medium">moedas</span></div>
            <div className="mt-4">
              <div className="text-sm text-slate-600 mb-2">Progresso para próxima vantagem</div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-sky-600 h-3 rounded-full" style={{ width: `${Math.min(100, (saldoTotal / 1000) * 100)}%` }} />
              </div>
              <div className="text-xs text-slate-500 mt-2">{Math.min(100, Math.round((saldoTotal / 1000) * 100))}%</div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="btn w-full" onClick={() => navigate('/vantagens')}>Ver Vantagens</button>
              <button className="btn bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={() => navigate('/perfil')}>Editar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: stats, transactions and featured advantages */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="card p-5">
            <div className="text-sm text-slate-500">Saldo Total</div>
            <div className="text-2xl font-semibold mt-1">{saldoTotal} moedas</div>
            <div className="text-xs text-slate-400 mt-2">Disponível para resgate</div>
          </div>
          {/* <div className="card p-5">
            <div className="text-sm text-slate-500">Recebidas (30d)</div>
            <div className="text-2xl font-semibold mt-1">{recebidas}</div>
            <div className="text-xs text-slate-400 mt-2">Nos últimos 30 dias</div>
          </div> */}
          {/* <div className="card p-5">
            <div className="text-sm text-slate-500">Resgatadas (30d)</div>
            <div className="text-2xl font-semibold mt-1">{resgatadas}</div>
            <div className="text-xs text-slate-400 mt-2">Nos últimos 30 dias</div>
          </div> */}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Histórico de Transações</div>
            <button className="text-sm text-sky-600 hover:underline" onClick={() => navigate('/transactions')}>Ver tudo</button>
          </div>
          <div className="divide-y">
            {transacoes.length === 0 ? (
              <div className="py-6 text-center text-slate-500">Nenhuma transação encontrada</div>
            ) : (
              transacoes.map((t) => {
                const descricao = getDescricao(t)
                return (
                  <div key={t.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-500">{descricao.charAt(0)}</div>
                      <div>
                        <div className="font-medium">{descricao}</div>
                        <div className="text-sm text-slate-500">{formatData(t.data)}</div>
                      </div>
                    </div>
                    <div className={`font-medium ${t.valor >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.valor >= 0 ? `+${t.valor}` : `${t.valor}`}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Vantagens em Destaque</div>
            <button className="text-sm text-sky-600 hover:underline" onClick={() => navigate('/vantagens')}>Marketplace</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vantagens.length === 0 ? (
              <div className="col-span-3 text-center text-slate-500 py-8">Nenhuma vantagem disponível</div>
            ) : (
              vantagens.map((v) => (
                <div className="card overflow-hidden" key={v.id}>
                  <div className="h-36 bg-gradient-to-br from-slate-100 to-white flex items-center justify-center text-slate-400">
                    {v.foto ? (
                      <img 
                        src={`data:image/jpeg;base64,${v.foto}`} 
                        alt={v.descricao} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      'Imagem'
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-medium line-clamp-2 mb-1">{v.descricao}</div>
                    {v.empresaNome && (
                      <div className="text-xs text-slate-400 mb-2">{v.empresaNome}</div>
                    )}
                    <div className="text-sm text-slate-500 mb-3">{v.custoMoedas} moedas</div>
                    <div className="flex gap-2">
                      <button 
                        className="btn flex-1 text-sm py-2" 
                        onClick={() => navigate(`/vantagens/${v.id}`)}
                      >
                        Ver detalhes
                      </button>
                      <button 
                        className="btn bg-sky-600 text-white flex-1 text-sm py-2 hover:bg-sky-700" 
                        onClick={() => navigate(`/vantagens/${v.id}`)}
                        disabled={saldoTotal < v.custoMoedas}
                      >
                        Resgatar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
