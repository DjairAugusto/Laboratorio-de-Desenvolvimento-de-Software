import { useParams, Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useState, useEffect } from 'react'
import { alunosAPI, VantagemDTO, vantagensAPI } from '../lib/api'
import { useAuth } from '../context/Auth'
import { useToast } from '../hooks/use-toast'

export default function VantagemDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error, warning } = useToast()
  const [vantagem, setVantagem] = useState<VantagemDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [aluno, setAluno] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Carregar aluno atual
        if (user && user.id) {
          const a = await alunosAPI.buscarPorId(user.id)
          setAluno(a)
        } else {
          const alunos = await alunosAPI.listar()
          if (alunos.length > 0) setAluno(alunos[0])
        }

        // Carregar vantagem
        if (id) {
          const v = await vantagensAPI.buscarPorId(Number(id))
          setVantagem(v)
        }
      } catch (err) {
        error('Erro ao carregar detalhes da vantagem')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, error, user])

  async function handleRedeem() {
    if (!vantagem || !aluno) return

    try {
      if (aluno.saldoMoedas < vantagem.custoMoedas) {
        warning('Saldo insuficiente para resgatar esta vantagem')
        return
      }

      // Resgatar vantagem via API
      await vantagensAPI.resgatar(vantagem.id!, aluno.id!)
      
      success('Vantagem resgatada com sucesso!')
      navigate('/dashboard')
    } catch (err) {
      error('Erro ao resgatar vantagem. Tente novamente.')
    }
  }

  if (loading) return <div className="text-center py-8">Carregando...</div>

  if (!vantagem) {
    return (
      <div className="text-center py-8">
        <div className="text-slate-500 mb-4">Vantagem não encontrada</div>
        <Link to="/vantagens" className="btn">Voltar para Vantagens</Link>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Detalhe da Vantagem" action={<Link to="/vantagens" className="text-sm text-slate-500">Voltar ao Marketplace</Link>} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center text-slate-400">
                {vantagem.foto ? (
                  <img 
                    src={`data:image/jpeg;base64,${vantagem.foto}`} 
                    alt={vantagem.descricao} 
                    className="w-full h-full object-cover rounded-md" 
                  />
                ) : (
                  'Imagem'
                )}
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">{vantagem.descricao}</h3>
                {vantagem.empresaNome && (
                  <div className="text-sm text-slate-500 mb-2">
                    Empresa: {vantagem.empresaNome}
                  </div>
                )}
                <div className="text-slate-700 mb-4 text-lg">{vantagem.custoMoedas} moedas</div>
                {aluno && (
                  <div className="text-sm text-slate-600 mb-4">
                    Seu saldo: <span className={`font-semibold ${aluno.saldoMoedas >= vantagem.custoMoedas ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {aluno.saldoMoedas} moedas
                    </span>
                  </div>
                )}
                <div className="flex gap-2 mb-6">
                  <button 
                    className="btn btn-lg bg-sky-600 text-white hover:bg-sky-700" 
                    onClick={handleRedeem}
                    disabled={!aluno || aluno.saldoMoedas < vantagem.custoMoedas}
                  >
                    Resgatar
                  </button>
                  <Link to="/vantagens" className="btn bg-slate-200 text-slate-800 hover:bg-slate-300">Voltar</Link>
                </div>
                <div className="text-sm text-orange-700 bg-orange-100 p-3 rounded-md">
                  Após o resgate, você receberá instruções por e-mail para utilizar a vantagem.
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Descrição Completa</h4>
              <p className="text-sm text-slate-700">{vantagem.descricao || 'Descrição não informada.'}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="card p-4">
            <div className="text-sm text-slate-500 mb-2">Resumo</div>
            <div className="font-medium mb-3">{vantagem.descricao}</div>
            <div className="text-sm text-slate-600">Custo: <span className="font-semibold">{vantagem.custoMoedas} moedas</span></div>
            <div className="mt-4">
              <div className="text-sm text-slate-500">Regras</div>
              <ul className="list-disc list-inside text-sm text-slate-600 mt-2">
                <li>Válido por 30 dias após resgate</li>
                <li>Uso pessoal, intransferível</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
