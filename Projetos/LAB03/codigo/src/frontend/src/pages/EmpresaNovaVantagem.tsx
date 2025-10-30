import PageHeader from '../components/PageHeader'
import { useState } from 'react'
import { useToast } from '../hooks/use-toast'
import { vantagensAPI } from '../lib/api'
import { useAuth } from '../context/Auth'
import { useNavigate } from 'react-router-dom'

export default function EmpresaNovaVantagem() {
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState(500)
  const [foto, setFoto] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { success, error } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!user || user.role !== 'empresa') {
      error('Apenas empresas podem cadastrar vantagens')
      return
    }

    try {
      setSubmitting(true)
      await vantagensAPI.criar({
        descricao: desc,
        custoMoedas: price,
        foto: foto || undefined,
        empresaId: user.id,
      })

      success('Vantagem cadastrada com sucesso!')

      // Reset form
      setDesc('')
      setPrice(500)
      setFoto('')

      // Navigate back to vantagens list
      setTimeout(() => navigate('/empresa/vantagens'), 1000)
    } catch (err: any) {
      error(err.message || 'Erro ao salvar vantagem. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title="Nova Vantagem" action={<span className="text-sm text-slate-500">Cadastro</span>} />
      <div className="card p-4">
        <h3 className="font-medium mb-4">Dados da Vantagem</h3>
        <form className="grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="label">Descrição do produto/vantagem</label>
            <input
              className="input"
              placeholder="Descreva a vantagem aqui"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Foto (URL)</label>
            <input
              className="input"
              placeholder="URL da imagem"
              value={foto}
              onChange={e => setFoto(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Custo em moedas</label>
            <input
              className="input"
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              min="1"
              required
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar Vantagem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
