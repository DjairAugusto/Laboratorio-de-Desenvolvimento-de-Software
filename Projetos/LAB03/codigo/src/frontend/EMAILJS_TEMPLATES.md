# EmailJS Templates (FOR_ME, FOR_SENDER e FOR_PROFESSOR)

This file contains ready-to-paste templates for EmailJS. Create two templates in the EmailJS dashboard and copy the HTML or plain text below into each template's body. Make sure to set the "To Email" for each template as described.

---

## Template 1 — FOR_ME (notification to the admin/owner)

- Template ID: (use the generated ID after you create the template)
- To Email: your fixed email address (example: `seu.email@exemplo.com`)
- Variables available (use these in the template):
  - `{{name}}` — professor name
  - `{{email}}` — professor email
  - `{{student_name}}` — student name
  - `{{student_email}}` — student email
  - `{{title}}` — subject/title string (sent by client)
  - `{{message}}` — reason / message text
  - `{{valor}}` — number of coins sent
  - `{{time}}` — human-readable timestamp

Suggested Subject (set in template subject field):
```
{{title}} — {{student_name}} ← {{name}}
```

HTML body (copy into template body):

```html
<div style="font-family: Arial, sans-serif; color:#111;">
  <h2 style="color:#0b6;">Novo envio de moedas</h2>
  <p><strong>Professor:</strong> {{name}} &lt;{{email}}&gt;</p>
  <p><strong>Aluno:</strong> {{student_name}} &lt;{{student_email}}&gt;</p>
  <p><strong>Quantidade:</strong> {{valor}} moedas</p>
  <p><strong>Motivo:</strong></p>
  <blockquote style="background:#f7f7f7;padding:12px;border-left:4px solid #ddd">{{message}}</blockquote>
  <p style="font-size:0.9rem;color:#666">Enviado em: {{time}}</p>
  <hr />
  <p style="font-size:0.85rem;color:#888">Student Coin — Notificação automática</p>
</div>
```

Plain-text fallback (optional):

```
Novo envio de moedas

Professor: {{name}} <{{email}}>
Aluno: {{student_name}} <{{student_email}}>
Quantidade: {{valor}} moedas
Motivo:
{{message}}

Enviado em: {{time}}

Student Coin — Notificação automática
```

---

## Template 2 — FOR_SENDER (confirmation email to the student)

- Template ID: (use the generated ID after you create the template)
- To Email: use the variable `{{student_email}}` (or `{{email}}`) so the message goes to the student who received the coins
- Variables available:
  - `{{name}}` — student name (we send student's name as `name`)
  - `{{email}}` — student email
  - `{{title}}` — subject/title
  - `{{message}}` — short message or reason
  - `{{valor}}` — number of coins
  - `{{time}}` — timestamp

Suggested Subject:
```
Você recebeu {{valor}} moedas — Student Coin
```

HTML body (copy into template body):

```html
<div style="font-family: Arial, sans-serif; color:#111;">
  <h2 style="color:#0b6;">Parabéns, {{name}}! 🎉</h2>
  <p>Você recebeu <strong>{{valor}} moedas</strong> pelo seguinte motivo:</p>
  <blockquote style="background:#f7f7f7;padding:12px;border-left:4px solid #ddd">{{message}}</blockquote>
  <p>Envio realizado em: <span style="color:#666">{{time}}</span></p>
  <p>Agora você pode checar seu saldo e usar suas moedas para resgatar vantagens na plataforma.</p>
  <hr />
  <p style="font-size:0.85rem;color:#888">Student Coin — Confirmação automática</p>
</div>
```

Plain-text fallback (optional):

```
Olá {{name}},

Você recebeu {{valor}} moedas!

Motivo:
{{message}}

Enviado em: {{time}}

Acesse sua conta para ver seu saldo e resgatar vantagens.

Student Coin
```

---

## Template 3 — FOR_PROFESSOR (confirmação para o professor)

- Template ID: (use o ID gerado ao criar o template)
- To Email: use a variável `{{professor_email}}` (ou `{{email}}`) para enviar ao professor que realizou o envio
- Variáveis disponíveis:
  - `{{name}}` — nome do professor (enviado também como `professor_name`)
  - `{{email}}` — e‑mail do professor (enviado também como `professor_email`)
  - `{{student_name}}` — nome do aluno
  - `{{student_email}}` — e‑mail do aluno
  - `{{title}}` — assunto/título
  - `{{message}}` — mensagem de confirmação
  - `{{valor}}` — quantidade de moedas
  - `{{time}}` — data/hora

Assunto sugerido:
```
Confirmação: você enviou {{valor}} moedas — Student Coin
```

HTML (corpo do template):

```html
<div style="font-family: Arial, sans-serif; color:#111;">
  <h2 style="color:#0b6;">Confirmação de envio</h2>
  <p>Olá, <strong>{{name}}</strong>.</p>
  <p>Você enviou <strong>{{valor}} moedas</strong> para <strong>{{student_name}}</strong> (<a href="mailto:{{student_email}}">{{student_email}}</a>).</p>
  <p><strong>Motivo:</strong></p>
  <blockquote style="background:#f7f7f7;padding:12px;border-left:4px solid #ddd">{{message}}</blockquote>
  <p style="margin-top:8px;">Data/hora: <span style="color:#666">{{time}}</span></p>
  <hr />
  <p style="font-size:0.85rem;color:#888">Student Coin — Confirmação automática para professor</p>
  <p style="font-size:0.8rem;color:#999">Se você não reconhece este envio, entre em contato com o suporte.</p>
  
</div>
```

Texto simples (opcional):

```
Olá {{name}},

Confirmação de envio de moedas:
- Aluno: {{student_name}} <{{student_email}}>
- Quantidade: {{valor}} moedas
- Motivo:
{{message}}

Enviado em: {{time}}

Student Coin — Confirmação automática para professor
Se você não reconhece este envio, contate o suporte.
```

---

## Como usar esses templates

1. Crie os dois templates na área "Email Templates" do EmailJS.
2. Cole o HTML (ou o texto) correspondente no corpo do template. Configure o Subject conforme recomendado.
3. Em FOR_ME coloque seu e‑mail fixo em "To Email" (para receber todas as notificações).
4. Em FOR_SENDER coloque `{{student_email}}` (ou `{{email}}`) em "To Email".
5. Em FOR_PROFESSOR coloque `{{professor_email}}` (ou `{{email}}`) em "To Email".
6. Salve os Template IDs e coloque nos env vars do frontend conforme orientado (inclusive o novo `VITE_EMAILJS_TEMPLATE_ID_FOR_PROFESSOR`).

Se quiser, eu copio esses blocos já para arquivos no projeto (por exemplo `EMAILJS_FOR_ME.html`, `EMAILJS_FOR_SENDER.html` e `EMAILJS_FOR_PROFESSOR.html`) para facilitar copiar/colar no painel do EmailJS — quer que eu adicione esses arquivos ao repositório para você?
