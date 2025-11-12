import { useState, useEffect, useCallback } from 'react'
import { transacaoAPI, TransacaoDTO } from '../lib/api'

export function useTransacoesProfessor(professorId: number | undefined) {
  const [data, setData] = useState<TransacaoDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchTransacoes = useCallback(async () => {
    if (!professorId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const transacoes = await transacaoAPI.listarPorTipo('ENVIO')
      setData(transacoes)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar transações'))
    } finally {
      setIsLoading(false)
    }
  }, [professorId])

  useEffect(() => {
    fetchTransacoes()
  }, [fetchTransacoes])

  return { data, isLoading, error, refetch: fetchTransacoes }
}

export function useTransacoesAluno(alunoId: number | undefined) {
  const [data, setData] = useState<TransacaoDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchTransacoes = useCallback(async () => {
    if (!alunoId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const transacoes = await transacaoAPI.listarPorAluno(alunoId)
      setData(transacoes)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar transações'))
    } finally {
      setIsLoading(false)
    }
  }, [alunoId])

  useEffect(() => {
    fetchTransacoes()
  }, [fetchTransacoes])

  return { data, isLoading, error, refetch: fetchTransacoes }
}
