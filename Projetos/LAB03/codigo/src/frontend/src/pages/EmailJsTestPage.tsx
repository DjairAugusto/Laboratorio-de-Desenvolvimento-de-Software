import { useState } from 'react'
import { sendCoinTransferEmails, sendResgateEmails } from '../lib/emailJs'
import EMAILJS_CONFIG from '../config/emailJsConfig'

export default function EmailJsTestPage() {
  const cfg = EMAILJS_CONFIG
  const [alunoEmail, setAlunoEmail] = useState('')
  const [alunoNome, setAlunoNome] = useState('Aluno Teste')
  const [empresaEmail, setEmpresaEmail] = useState('')
  const [empresaNome, setEmpresaNome] = useState('Empresa Teste')
  const [profEmail, setProfEmail] = useState('')
  const [profNome, setProfNome] = useState('Professor Teste')
  const [log, setLog] = useState<string[]>([])
  const pushLog = (m: string) => setLog(l => [m, ...l].slice(0, 40))

  const disabledResgate = !cfg.RESGATE_TEMPLATE_ALUNO && !cfg.RESGATE_TEMPLATE_EMPRESA
  const disabledTransfer = !cfg.TEMPLATE_ID_FOR_ME && !cfg.TEMPLATE_ID_FOR_SENDER

  async function testResgate() {
    pushLog('Iniciando teste de resgate...')
    try {
      await sendResgateEmails({
        alunoEmail: alunoEmail || undefined,
        alunoNome: alunoNome || undefined,
        empresaEmail: empresaEmail || undefined,
        empresaNome: empresaNome || undefined,
        vantagemDescricao: 'Vantagem Demonstrativa',
        codigoCupom: 'CUPOM-TEST-' + Date.now(),
        custoMoedas: 50,
      })
      pushLog('Disparo de emails de resgate concluído (ver console para status).')
    } catch (e: any) {
      pushLog('Erro no teste de resgate: ' + (e.message || e.toString()))
    }
  }

  async function testTransfer() {
    pushLog('Iniciando teste de transferência...')
    try {
      await sendCoinTransferEmails({
        professorName: profNome,
        professorEmail: profEmail || undefined,
        studentName: alunoNome,
        studentEmail: alunoEmail || '',
        valor: 25,
        motivo: 'Teste manual',
      })
      pushLog('Disparo de emails de transferência concluído (ver console).')
    } catch (e: any) {
      pushLog('Erro no teste de transferência: ' + (e.message || e.toString()))
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Teste EmailJS</h1>
      <p className="text-sm text-slate-600">Use esta página para validar rapidamente o envio de emails. Os botões disparam as funções já existentes. Verifique também o console do navegador para logs detalhados.</p>

      <section className="p-4 border rounded-md bg-white space-y-4">
        <h2 className="font-medium">Configuração Detectada</h2>
        <ul className="text-xs grid gap-1">
          <li>SERVICE_ID: <code>{cfg.SERVICE_ID || '(vazio)'}</code></li>
          <li>PUBLIC_KEY: <code>{cfg.PUBLIC_KEY ? '•••' : '(vazio)'}</code></li>
          <li>TRANSFER (ME): <code>{cfg.TEMPLATE_ID_FOR_ME || '(não)'}</code></li>
          <li>TRANSFER (SENDER): <code>{cfg.TEMPLATE_ID_FOR_SENDER || '(não)'}</code></li>
          <li>RESGATE (ALUNO): <code>{cfg.RESGATE_TEMPLATE_ALUNO || '(não)'}</code></li>
          <li>RESGATE (EMPRESA): <code>{cfg.RESGATE_TEMPLATE_EMPRESA || '(não)'}</code></li>
        </ul>
        {(!cfg.SERVICE_ID || !cfg.PUBLIC_KEY) && (
          <div className="text-red-600 text-sm">Credenciais incompletas: defina SERVICE_ID e PUBLIC_KEY no .env.</div>
        )}
      </section>

      <section className="p-4 border rounded-md bg-white space-y-3">
        <h2 className="font-medium">Destinatários</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm">Aluno Email
              <input value={alunoEmail} onChange={e => setAlunoEmail(e.target.value)} placeholder="aluno@exemplo.com" className="input mt-1 w-full" />
            </label>
            <label className="block text-sm">Aluno Nome
              <input value={alunoNome} onChange={e => setAlunoNome(e.target.value)} className="input mt-1 w-full" />
            </label>
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Empresa Email
              <input value={empresaEmail} onChange={e => setEmpresaEmail(e.target.value)} placeholder="empresa@exemplo.com" className="input mt-1 w-full" />
            </label>
            <label className="block text-sm">Empresa Nome
              <input value={empresaNome} onChange={e => setEmpresaNome(e.target.value)} className="input mt-1 w-full" />
            </label>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm">Professor Email
              <input value={profEmail} onChange={e => setProfEmail(e.target.value)} placeholder="prof@exemplo.com" className="input mt-1 w-full" />
            </label>
            <label className="block text-sm">Professor Nome
              <input value={profNome} onChange={e => setProfNome(e.target.value)} className="input mt-1 w-full" />
            </label>
          </div>
        </div>
      </section>

      <section className="p-4 border rounded-md bg-white space-y-3">
        <h2 className="font-medium">Ações</h2>
        <div className="flex flex-wrap gap-3">
          <button disabled={disabledResgate || !cfg.SERVICE_ID || !cfg.PUBLIC_KEY} onClick={testResgate} className="btn">Testar Resgate</button>
          <button disabled={disabledTransfer || !cfg.SERVICE_ID || !cfg.PUBLIC_KEY} onClick={testTransfer} className="btn">Testar Transferência</button>
        </div>
        {(disabledResgate || disabledTransfer) && (
          <p className="text-xs text-slate-500">Configure os templates necessários no painel EmailJS para habilitar todos os testes.</p>
        )}
      </section>

      <section className="p-4 border rounded-md bg-white space-y-2">
        <h2 className="font-medium">Log (mais recente primeiro)</h2>
        <div className="text-xs font-mono whitespace-pre-wrap bg-slate-50 border rounded p-2 h-48 overflow-auto">
          {log.length === 0 ? 'Nenhum evento ainda.' : log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </section>
    </div>
  )
}
