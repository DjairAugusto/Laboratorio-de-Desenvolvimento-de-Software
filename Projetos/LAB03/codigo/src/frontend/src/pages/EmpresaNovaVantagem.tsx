import PageHeader from '../components/PageHeader'
import { useState } from 'react'
import { useToast } from '../hooks/use-toast'
import { useAuth } from '../context/Auth'
import { useNavigate, Link } from 'react-router-dom'
import { useVantagens } from '../hooks/useVantagens'

export default function EmpresaNovaVantagem() {
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState(100)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const { success, error } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Hook para criar vantagem
  const { criar } = useVantagens({ 
    empresaId: user?.id, 
    autoLoad: false 
  })

  // Converter arquivo de imagem para Base64
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      error('Por favor, selecione um arquivo de imagem válido')
      return
    }

    // Validar tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      error('A imagem deve ter no máximo 2MB')
      return
    }

    setFotoFile(file)

    // Criar preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setFotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!user) {
      error('Você precisa estar logado como empresa')
      return
    }

    if (!desc.trim()) {
      error('Descrição é obrigatória')
      return
    }

    if (price <= 0) {
      error('Custo em moedas deve ser maior que zero')
      return
    }

    try {
      setSubmitting(true)

      // Converter foto para Base64 se houver
      let fotoBase64 = undefined
      if (fotoFile) {
        const reader = new FileReader()
        fotoBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1] // Remover prefixo data:image/...;base64,
            resolve(base64)
          }
          reader.onerror = reject
          reader.readAsDataURL(fotoFile)
        })
      }

      const sucesso = await criar({
        descricao: desc,
        custoMoedas: price,
        foto: fotoBase64,
      })

      if (sucesso) {
        success('Vantagem cadastrada com sucesso!')
        // Navigate back to vantagens list
        setTimeout(() => navigate('/empresa/vantagens'), 1000)
      }
    } catch (err: any) {
      error(err.message || 'Erro ao salvar vantagem. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader 
        title="Nova Vantagem" 
        action={
          <Link to="/empresa/vantagens" className="text-sm text-slate-500 hover:text-slate-700">
            ← Voltar para listagem
          </Link>
        } 
      />
      <div className="card p-6">
        <h3 className="font-medium mb-4">Dados da Vantagem</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label">Descrição da vantagem *</label>
            <textarea
              className="input min-h-[100px]"
              placeholder="Descreva detalhadamente a vantagem oferecida..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              required
              maxLength={500}
            />
            <div className="text-xs text-slate-400 mt-1">
              {desc.length}/500 caracteres
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Custo em moedas *</label>
              <input
                className="input"
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                min="1"
                max="10000"
                required
              />
              <div className="text-xs text-slate-400 mt-1">
                Quantidade de moedas necessárias para resgatar
              </div>
            </div>

            <div>
              <label className="label">Foto da vantagem</label>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="text-xs text-slate-400 mt-1">
                Imagem PNG, JPG ou JPEG (máx. 2MB)
              </div>
            </div>
          </div>

          {/* Preview da foto */}
          {fotoPreview && (
            <div>
              <label className="label">Preview da imagem</label>
              <div className="w-48 h-48 border-2 border-dashed border-slate-300 rounded-lg overflow-hidden">
                <img 
                  src={fotoPreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-700 mt-2"
                onClick={() => {
                  setFotoFile(null)
                  setFotoPreview('')
                }}
              >
                Remover imagem
              </button>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Link 
              to="/empresa/vantagens" 
              className="btn bg-slate-200 text-slate-800 hover:bg-slate-300"
            >
              Cancelar
            </Link>
            <button 
              className="btn bg-sky-600 text-white hover:bg-sky-700" 
              type="submit" 
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Cadastrar Vantagem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
