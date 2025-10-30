import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useToast } from '../hooks/use-toast'
import { vantagensAPI, VantagemDTO } from '../lib/api'
import { useAuth } from '../context/Auth'
import { Trash2 } from 'lucide-react'

export default function EmpresaVantagens() {
  const [vantagens, setVantagens] = useState<VantagemDTO[]>([])
  const [loading, setLoading] = useState(true)
  const { error, success } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    loadVantagens()
  }, [])

  async function loadVantagens() {
    try {
      setLoading(true)
      if (user && user.role === 'empresa') {
        const data = await vantagensAPI.listarPorEmpresa(user.id)
        setVantagens(data)
      }
    } catch (err) {
      error('Erro ao carregar vantagens')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number, descricao: string) {
    if (!confirm(`Deseja realmente excluir a vantagem "${descricao}"?`)) {
      return
    }

    try {
      await vantagensAPI.deletar(id)
      success('Vantagem excluída com sucesso!')
      loadVantagens()
    } catch (err: any) {
      error(err.message || 'Erro ao excluir vantagem')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <div>
      <PageHeader title="Vantagens da Empresa" action={<Link to="/empresa/vantagens/nova" className="btn">Adicionar Nova Vantagem</Link>} />
      <div className="card p-4">
        <h3 className="font-medium mb-4">Todas as Vantagens</h3>
        {vantagens.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            Nenhuma vantagem cadastrada ainda. Clique em "Adicionar Nova Vantagem" para começar.
          </div>
        ) : (
          <div className="space-y-4">
            {vantagens.map(v => (
              <div className="flex gap-4 items-center border-b pb-4 last:border-0" key={v.id}>
                <div className="w-24 h-24 bg-slate-200 rounded-md flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
                  {v.foto ? <img src={v.foto} alt={v.descricao} className="w-full h-full object-cover rounded-md" /> : 'Sem foto'}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{v.descricao}</div>
                  <div className="text-slate-500 text-sm mt-1">{v.custoMoedas} moedas</div>
                </div>
                <button
                  className="btn bg-red-50 text-red-600 hover:bg-red-100"
                  onClick={() => handleDelete(v.id!, v.descricao)}
                  title="Excluir vantagem"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
