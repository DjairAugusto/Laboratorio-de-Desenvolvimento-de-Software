const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID_FOR_ME: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_FOR_ME || '',
  TEMPLATE_ID_FOR_SENDER: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_FOR_SENDER || '',
  // Templates opcionais para emails de resgate (aluno e empresa)
  RESGATE_TEMPLATE_ALUNO: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RESGATE_ALUNO || '',
  RESGATE_TEMPLATE_EMPRESA: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RESGATE_EMPRESA || '',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
}

export default EMAILJS_CONFIG
