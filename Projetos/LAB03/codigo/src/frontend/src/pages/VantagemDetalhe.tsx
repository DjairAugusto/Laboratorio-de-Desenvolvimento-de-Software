import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vantagensService, Vantagem } from '../services/api';

function PageHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}

export default function VantagemDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vantagem, setVantagem] = useState<Vantagem | null>(null);
  const [loading, setLoading] = useState(true);
  const [resgatando, setResgatando] = useState(false);

  useEffect(() => {
    if (id) {
      carregarVantagem(Number(id));
    }
  }, [id]);

  async function carregarVantagem(vantagemId: number) {
    try {
      setLoading(true);
      const response = await vantagensService.buscarPorId(vantagemId);
      setVantagem(response.data);
    } catch (err) {
      console.error('Erro ao carregar vantagem:', err);
      alert('Vantagem não encontrada');
      navigate('/vantagens');
    } finally {
      setLoading(false);
    }
  }

  async function handleResgatar() {
    if (!vantagem) return;
    
    const confirma = window.confirm(
      `Deseja resgatar "${vantagem.descricao}" por ${vantagem.custoMoedas} moedas?`
    );
    
    if (!confirma) return;

    try {
      setResgatando(true);
      // ID do aluno fixo para MVP (Ana = 1)
      await vantagensService.resgatarVantagem(vantagem.id, 1);
      alert('Vantagem resgatada com sucesso! Verifique seu email para instruções.');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Erro ao resgatar:', err);
      alert(err.response?.data?.message || 'Erro ao resgatar vantagem. Verifique seu saldo.');
    } finally {
      setResgatando(false);
    }
  }

  if (loading) {
    return <div className="text-slate-500">Carregando...</div>;
  }

  if (!vantagem) {
    return <div className="text-slate-500">Vantagem não encontrada</div>;
  }

  return (
    <div>
      <PageHeader 
        title="Detalhe da Vantagem" 
        action={<Link to="/vantagens" className="text-sm text-slate-500">← Voltar</Link>} 
      />

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
            <h3 className="text-xl font-semibold mb-1">{vantagem.descricao}</h3>
            <div className="text-slate-700 mb-2">{vantagem.custoMoedas} moedas</div>
            {vantagem.empresaNome && (
              <div className="text-sm text-slate-500 mb-4">
                Oferecido por: {vantagem.empresaNome}
              </div>
            )}

            <div className="flex gap-2 mb-6">
              <button 
                className="btn" 
                onClick={handleResgatar}
                disabled={resgatando}
              >
                {resgatando ? 'Resgatando...' : 'Resgatar Vantagem'}
              </button>
              <Link to="/vantagens" className="btn bg-slate-200 text-slate-800 hover:bg-slate-300">
                Voltar
              </Link>
            </div>

            <div className="text-sm text-orange-700 bg-orange-100 p-3 rounded-md">
              ⚠️ Após o resgate, você receberá instruções por e-mail para utilizar a vantagem.
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-2">Descrição Completa</h4>
          <p className="text-sm text-slate-700">
            Esta vantagem pode ser resgatada utilizando suas moedas acumuladas.
            Após a confirmação, você receberá um código de cupom por e-mail.
          </p>
        </div>
      </div>
    </div>
  );
}
