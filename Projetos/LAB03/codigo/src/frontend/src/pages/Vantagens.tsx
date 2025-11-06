import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vantagensService, Vantagem } from '../services/api';

function PageHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}

function AdvantageCard({ item, onDetails }: { item: Vantagem; onDetails?: (id: number) => void }) {
  return (
    <div className="card overflow-hidden">
      <div className="h-36 bg-slate-100">
        {item.foto ? (
          <img src={`data:image/jpeg;base64,${item.foto}`} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400">
            Imagem
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="font-medium mb-1 truncate">{item.descricao}</div>
        <div className="text-sm text-slate-600 mb-1">{item.custoMoedas} moedas</div>
        {item.empresaNome && (
          <div className="text-xs text-slate-500 mb-3">Por: {item.empresaNome}</div>
        )}
        <button
          className="btn w-full"
          onClick={() => onDetails?.(item.id)}
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
}

export default function Vantagens() {
  const navigate = useNavigate();
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarVantagens();
  }, []);

  async function carregarVantagens() {
    try {
      setLoading(true);
      setError(null);
      const response = await vantagensService.listarTodas(0, 20);
      setVantagens(response.data.items);
      console.log('📦 Vantagens carregadas:', response.data.items.length);
    } catch (err: any) {
      console.error('❌ Erro ao carregar vantagens:', err);
      setError(err.response?.data?.message || 'Erro ao carregar vantagens');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Carregando vantagens...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 bg-red-50 border-red-200">
        <div className="text-red-800 font-medium mb-2">Erro ao Carregar Vantagens</div>
        <div className="text-red-600 text-sm mb-4">{error}</div>
        <button onClick={carregarVantagens} className="btn bg-red-600 hover:bg-red-700">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Vantagens" 
        action={<span className="text-sm text-slate-500">Marketplace</span>} 
      />
      
      {vantagens.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-slate-500">Nenhuma vantagem disponível no momento</div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vantagens.map((vantagem) => (
            <AdvantageCard
              key={vantagem.id}
              item={vantagem}
              onDetails={(id) => navigate(`/vantagens/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
