import emailjs from '@emailjs/browser'
import EMAILJS_CONFIG from '../config/emailJsConfig'

// Helper to send two emails when a professor sends coins to a student:
//  - FOR_ME: notification to admin/owner with details
//  - FOR_SENDER: confirmation to the student who received the coins
export async function sendCoinTransferEmails(payload: {
  professorName: string
  professorEmail?: string
  studentName: string
  studentEmail: string
  valor: number
  motivo?: string
  time?: string
}) {
  const { SERVICE_ID, TEMPLATE_ID_FOR_ME, TEMPLATE_ID_FOR_SENDER, PUBLIC_KEY } = EMAILJS_CONFIG
  const time = payload.time || new Date().toLocaleString()

  if (!SERVICE_ID || !PUBLIC_KEY) {
    // EmailJS not configured; skip silently
    console.debug('EmailJS not configured; skipping emails')
    return
  }

  // Template variables - adapt to your EmailJS templates fields
  const forMeVars = {
    name: payload.professorName,
    email: payload.professorEmail || payload.studentEmail,
    student_name: payload.studentName,
    student_email: payload.studentEmail,
    title: `Envio de moedas: ${payload.valor} para ${payload.studentName}`,
    message: payload.motivo || '',
    valor: payload.valor,
    time,
  }

  const forSenderVars = {
    name: payload.studentName,
    email: payload.studentEmail,
    title: 'Você recebeu moedas! 🎉',
    message: `Você recebeu ${payload.valor} moedas de ${payload.professorName}. Motivo: ${payload.motivo || '—'}`,
    valor: payload.valor,
    time,
  }

  try {
    if (TEMPLATE_ID_FOR_ME) {
      emailjs.send(SERVICE_ID, TEMPLATE_ID_FOR_ME, forMeVars, PUBLIC_KEY).then(
        () => console.debug('EmailJS: FOR_ME sent'),
        (err) => console.error('EmailJS error (FOR_ME):', err)
      )
    }
  } catch (e) {
    console.error('Failed to send EmailJS FOR_ME', e)
  }

  try {
    if (TEMPLATE_ID_FOR_SENDER) {
      emailjs.send(SERVICE_ID, TEMPLATE_ID_FOR_SENDER, forSenderVars, PUBLIC_KEY).then(
        () => console.debug('EmailJS: FOR_SENDER sent'),
        (err) => console.error('EmailJS error (FOR_SENDER):', err)
      )
    }
  } catch (e) {
    console.error('Failed to send EmailJS FOR_SENDER', e)
  }
}

// Envia emails após resgate de vantagem (cupom gerado).
// Se os templates não estiverem configurados, apenas registra no console.
export async function sendResgateEmails(params: {
  alunoEmail?: string
  alunoNome?: string
  empresaEmail?: string
  empresaNome?: string
  vantagemDescricao: string
  codigoCupom: string
  custoMoedas: number
}) {
  const { SERVICE_ID, PUBLIC_KEY, RESGATE_TEMPLATE_ALUNO, RESGATE_TEMPLATE_EMPRESA } = EMAILJS_CONFIG
  if (!SERVICE_ID || !PUBLIC_KEY || (!RESGATE_TEMPLATE_ALUNO && !RESGATE_TEMPLATE_EMPRESA)) {
    console.debug('EmailJS resgate: faltam credenciais ou templates; envio ignorado')
    return
  }
  const baseVars = {
    vantagem_descricao: params.vantagemDescricao,
    codigo_cupom: params.codigoCupom,
    custo_moedas: params.custoMoedas.toString(),
  }
  if (RESGATE_TEMPLATE_ALUNO && params.alunoEmail) {
    const alunoVars = {
      to_name: params.alunoNome || params.alunoEmail,
      to_email: params.alunoEmail,
      ...baseVars,
    }
    try {
      emailjs.send(SERVICE_ID, RESGATE_TEMPLATE_ALUNO, alunoVars, PUBLIC_KEY).then(
        () => console.debug('EmailJS: resgate aluno enviado'),
        (err) => console.error('EmailJS erro resgate aluno:', err)
      )
    } catch (e) {
      console.error('Falha envio email resgate aluno', e)
    }
  }
  if (RESGATE_TEMPLATE_EMPRESA && params.empresaEmail) {
    const empresaVars = {
      empresa_nome: params.empresaNome || params.empresaEmail,
      to_email: params.empresaEmail,
      ...baseVars,
    }
    try {
      emailjs.send(SERVICE_ID, RESGATE_TEMPLATE_EMPRESA, empresaVars, PUBLIC_KEY).then(
        () => console.debug('EmailJS: resgate empresa enviado'),
        (err) => console.error('EmailJS erro resgate empresa:', err)
      )
    } catch (e) {
      console.error('Falha envio email resgate empresa', e)
    }
  }
}
