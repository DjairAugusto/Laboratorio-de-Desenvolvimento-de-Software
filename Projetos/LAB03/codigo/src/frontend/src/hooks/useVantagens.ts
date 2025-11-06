import { useState, useEffect } from 'react'
import { vantagensAPI, VantagemDTO, PageResponse } from '../lib/api'
import { useToast } from './use-toast'

interface UseVantagensParams {
  empresaId?: number
  page?: number
  size?: number
  sortBy?: string
  direction?: 'asc' | 'desc'
  autoLoad?: boolean
}

export function useVantagens(params: UseVantagensParams = {}) {
  const { empresaId, page = 0, size = 10, sortBy = 'id', direction = 'asc', autoLoad = true } = params
  const { error } = useToast()
  
  const [vantagens, setVantagens] = useState<VantagemDTO[]>([])
  const [pagination, setPagination] = useState<PageResponse<VantagemDTO>['pagination'] | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(page)

  const loadVantagens = async (pageNum: number = currentPage) => {
    try {
      setLoading(true)
      
      const response = empresaId
        ? await vantagensAPI.listarPorEmpresa(empresaId, { page: pageNum, size, sortBy, direction })
        : await vantagensAPI.listar({ page: pageNum, size, sortBy, direction })
      
      setVantagens(response.items)
      setPagination(response.pagination)
      setCurrentPage(pageNum)
    } catch (err) {
      error('Erro ao carregar vantagens')
      console.error('Erro ao carregar vantagens:', err)
    } finally {
      setLoading(false)
    }
  }

  const buscarPorId = async (id: number): Promise<VantagemDTO | null> => {
    try {
      return await vantagensAPI.buscarPorId(id)
    } catch (err) {
      error('Erro ao buscar vantagem')
      console.error('Erro ao buscar vantagem:', err)
      return null
    }
  }

  const criar = async (data: Omit<VantagemDTO, 'id'>): Promise<boolean> => {
    if (!empresaId) {
      error('ID da empresa é necessário para criar vantagem')
      return false
    }
    
    try {
      await vantagensAPI.criar(empresaId, data)
      await loadVantagens(currentPage)
      return true
    } catch (err) {
      error('Erro ao criar vantagem')
      console.error('Erro ao criar vantagem:', err)
      return false
    }
  }

  const atualizar = async (id: number, data: Partial<VantagemDTO>): Promise<boolean> => {
    if (!empresaId) {
      error('ID da empresa é necessário para atualizar vantagem')
      return false
    }
    
    try {
      await vantagensAPI.atualizar(empresaId, id, data)
      await loadVantagens(currentPage)
      return true
    } catch (err) {
      error('Erro ao atualizar vantagem')
      console.error('Erro ao atualizar vantagem:', err)
      return false
    }
  }

  const deletar = async (id: number): Promise<boolean> => {
    if (!empresaId) {
      error('ID da empresa é necessário para deletar vantagem')
      return false
    }
    
    try {
      await vantagensAPI.deletar(empresaId, id)
      await loadVantagens(currentPage)
      return true
    } catch (err) {
      error('Erro ao deletar vantagem')
      console.error('Erro ao deletar vantagem:', err)
      return false
    }
  }

  const resgatar = async (vantagemId: number, alunoId: number): Promise<boolean> => {
    try {
      await vantagensAPI.resgatar(vantagemId, alunoId)
      return true
    } catch (err) {
      error('Erro ao resgatar vantagem')
      console.error('Erro ao resgatar vantagem:', err)
      return false
    }
  }

  const nextPage = () => {
    if (pagination?.hasNext) {
      loadVantagens(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (pagination?.hasPrevious) {
      loadVantagens(currentPage - 1)
    }
  }

  const goToPage = (pageNum: number) => {
    if (pagination && pageNum >= 0 && pageNum < pagination.totalPages) {
      loadVantagens(pageNum)
    }
  }

  useEffect(() => {
    if (autoLoad) {
      loadVantagens()
    }
  }, [empresaId, size, sortBy, direction]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    vantagens,
    pagination,
    loading,
    currentPage,
    loadVantagens,
    buscarPorId,
    criar,
    atualizar,
    deletar,
    resgatar,
    nextPage,
    previousPage,
    goToPage,
    refresh: () => loadVantagens(currentPage),
  }
}
