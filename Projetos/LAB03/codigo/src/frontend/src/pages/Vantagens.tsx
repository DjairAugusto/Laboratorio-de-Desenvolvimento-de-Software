import PageHeader from '../components/PageHeader'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useVantagens } from '../hooks/useVantagens'
import { useAuth } from '../context/Auth'

export default function Vantagens() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [q, setQ] = useState('')
  
  // Carrega todas as vantagens da empresa logada
  const { 
    vantagens, 
    loading, 
    pagination, 
    nextPage, 
    previousPage, 
    goToPage 
  } = useVantagens({ 
    empresaId: user?.role === 'empresa' ? user.id : undefined,
    page: 0, 
    size: 12, 
    sortBy: 'custoMoedas',
    direction: 'asc',
    autoLoad: true 
  })

  if (loading) return <div className="text-center py-8">Carregando...</div>

  const filtered = vantagens.filter(v => v.descricao.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <PageHeader 
        title="Vantagens" 
        action={<div className="text-sm text-slate-500">{user?.role === 'empresa' ? 'Meus Produtos' : 'Marketplace'}</div>} 
      />

      <div className="mb-4 flex items-center gap-3">
        <input className="input flex-1" placeholder="Buscar vantagens..." value={q} onChange={e => setQ(e.target.value)} />
        <button className="btn" onClick={() => setQ('')}>Limpar</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center text-slate-500 py-8">Nenhuma vantagem disponível no momento</div>
        ) : (
          filtered.map(v => (
            <div key={v.id} className="card overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-white to-slate-100 flex items-center justify-center text-slate-400">
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
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium line-clamp-2">{v.descricao}</div>
                    {v.empresaNome && (
                      <div className="text-xs text-slate-400 mt-1">{v.empresaNome}</div>
                    )}
                    <div className="text-sm text-slate-500 mt-1">{v.custoMoedas} moedas</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="btn flex-1" onClick={() => navigate(`/vantagens/${v.id}`)}>Ver detalhes</button>
                  <button 
                    className="btn bg-sky-600 text-white flex-1 hover:bg-sky-700" 
                    onClick={() => navigate(`/vantagens/${v.id}`)}
                  >
                    Resgatar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button 
            className="btn" 
            onClick={previousPage}
            disabled={!pagination.hasPrevious}
          >
            Anterior
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i).map(pageNum => (
              <button
                key={pageNum}
                className={`btn ${pagination.currentPage === pageNum ? 'bg-sky-600 text-white' : ''}`}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum + 1}
              </button>
            ))}
          </div>
          
          <button 
            className="btn" 
            onClick={nextPage}
            disabled={!pagination.hasNext}
          >
            Próxima
          </button>
        </div>
      )}

      {pagination && (
        <div className="text-center text-sm text-slate-500 mt-4">
          Mostrando {filtered.length} de {pagination.totalItems} vantagens
        </div>
      )}
    </div>
  )
}
