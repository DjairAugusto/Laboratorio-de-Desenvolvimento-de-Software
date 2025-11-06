import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useToast } from '../hooks/use-toast'
import { useAuth } from '../context/Auth'
import { useVantagens } from '../hooks/useVantagens'
import { Trash2, Edit } from 'lucide-react'

export default function EmpresaVantagens() {
  const { success } = useToast()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  // Hook para carregar vantagens da empresa com paginação
  const { 
    vantagens, 
    loading, 
    pagination,
    deletar,
    nextPage,
    previousPage,
    goToPage,
    refresh
  } = useVantagens({ 
    empresaId: user?.id,
    page: 0, 
    size: 10,
    sortBy: 'descricao',
    direction: 'asc',
    autoLoad: true 
  })

  async function handleDelete(id: number, descricao: string) {
    if (!confirm(`Deseja realmente excluir a vantagem "${descricao}"?`)) {
      return
    }

    const sucesso = await deletar(id)
    if (sucesso) {
      success('Vantagem excluída com sucesso!')
      refresh()
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  // Filtro local de busca
  const filteredVantagens = vantagens.filter(v => 
    v.descricao.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <PageHeader 
        title="Minhas Vantagens" 
        action={
          <Link to="/empresa/vantagens/nova" className="btn bg-sky-600 text-white hover:bg-sky-700">
            + Adicionar Vantagem
          </Link>
        } 
      />
      
      {/* Barra de busca e informações */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <input 
          className="input flex-1 max-w-md" 
          placeholder="Buscar vantagens..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {pagination && (
          <div className="text-sm text-slate-500">
            Total: {pagination.totalItems} vantagens
          </div>
        )}
      </div>

      <div className="card p-4">
        {filteredVantagens.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            {searchQuery 
              ? 'Nenhuma vantagem encontrada com esse termo de busca.'
              : 'Nenhuma vantagem cadastrada ainda. Clique em "Adicionar Vantagem" para começar.'
            }
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVantagens.map(v => (
              <div className="flex gap-4 items-center border-b pb-4 last:border-0" key={v.id}>
                <div className="w-24 h-24 bg-slate-200 rounded-md flex items-center justify-center text-slate-400 text-xs flex-shrink-0 overflow-hidden">
                  {v.foto ? (
                    <img 
                      src={`data:image/jpeg;base64,${v.foto}`} 
                      alt={v.descricao} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    'Sem foto'
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium line-clamp-2">{v.descricao}</div>
                  <div className="text-slate-500 text-sm mt-1">{v.custoMoedas} moedas</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn bg-red-50 text-red-600 hover:bg-red-100"
                    onClick={() => handleDelete(v.id!, v.descricao)}
                    title="Excluir vantagem"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && !searchQuery && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button 
            className="btn text-sm" 
            onClick={previousPage}
            disabled={!pagination.hasPrevious}
          >
            Anterior
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => {
              // Mostrar apenas 10 páginas por vez, centralizando na página atual
              const start = Math.max(0, pagination.currentPage - 5)
              const pageNum = start + i
              if (pageNum >= pagination.totalPages) return null
              
              return (
                <button
                  key={pageNum}
                  className={`btn text-sm ${pagination.currentPage === pageNum ? 'bg-sky-600 text-white' : ''}`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum + 1}
                </button>
              )
            })}
          </div>
          
          <button 
            className="btn text-sm" 
            onClick={nextPage}
            disabled={!pagination.hasNext}
          >
            Próxima
          </button>
        </div>
      )}

      {pagination && !searchQuery && (
        <div className="text-center text-sm text-slate-500 mt-4">
          Página {pagination.currentPage + 1} de {pagination.totalPages} • {pagination.totalItems} vantagens no total
        </div>
      )}
    </div>
  )
}
