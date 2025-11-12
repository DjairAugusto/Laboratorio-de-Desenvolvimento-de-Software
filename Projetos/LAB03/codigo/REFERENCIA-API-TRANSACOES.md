# 🔌 Referência de API - Histórico de Transações

## Endpoints Utilizados

### 1️⃣ Listar Todas as Transações
```http
GET /api/transacoes
Content-Type: application/json
Authorization: Bearer {token}
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "usuario": {
      "id": 101,
      "nome": "João Silva"
    },
    "data": "2025-01-15T10:30:00Z",
    "valor": 250,
    "tipo": "ENVIO",
    "motivo": "Reconhecimento por projeto"
  },
  {
    "id": 2,
    "usuario": {
      "id": 102,
      "nome": "Maria Santos"
    },
    "data": "2025-01-14T15:45:00Z",
    "valor": -300,
    "tipo": "RESGATE",
    "motivo": "Resgate de vantagem"
  }
]
```

**Uso no Frontend:**
```typescript
const txs = await transacaoAPI.listar()
```

---

### 2️⃣ Listar Transações do Aluno
```http
GET /api/transacoes/aluno/{alunoId}
Content-Type: application/json
Authorization: Bearer {token}
```

**Parâmetros:**
- `alunoId` (number, required): ID do aluno

**Exemplos:**
```bash
GET /api/transacoes/aluno/101
GET /api/transacoes/aluno/102
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "usuario": {
      "id": 101,
      "nome": "João Silva"
    },
    "data": "2025-01-15T10:30:00Z",
    "valor": 250,
    "tipo": "ENVIO",
    "motivo": "Reconhecimento por projeto"
  }
]
```

**Uso no Frontend:**
```typescript
const txs = await transacaoAPI.listarPorAluno(101)
```

---

### 3️⃣ Filtrar Transações por Tipo
```http
GET /api/transacoes/tipo/{tipo}
Content-Type: application/json
Authorization: Bearer {token}
```

**Parâmetros:**
- `tipo` (string, required): ENVIO | RESGATE | CREDITO

**Exemplos:**
```bash
GET /api/transacoes/tipo/ENVIO
GET /api/transacoes/tipo/RESGATE
GET /api/transacoes/tipo/CREDITO
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "usuario": {
      "id": 101,
      "nome": "João Silva"
    },
    "data": "2025-01-15T10:30:00Z",
    "valor": 250,
    "tipo": "ENVIO",
    "motivo": "Reconhecimento por projeto"
  }
]
```

**Uso no Frontend:**
```typescript
const envios = await transacaoAPI.listarPorTipo('ENVIO')
const resgates = await transacaoAPI.listarPorTipo('RESGATE')
const creditos = await transacaoAPI.listarPorTipo('CREDITO')
```

---

### 4️⃣ Buscar Transação por ID
```http
GET /api/transacoes/{id}
Content-Type: application/json
Authorization: Bearer {token}
```

**Parâmetros:**
- `id` (number, required): ID da transação

**Exemplos:**
```bash
GET /api/transacoes/1
GET /api/transacoes/42
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "usuario": {
    "id": 101,
    "nome": "João Silva"
  },
  "data": "2025-01-15T10:30:00Z",
  "valor": 250,
  "tipo": "ENVIO",
  "motivo": "Reconhecimento por projeto"
}
```

**Resposta (404 Not Found):**
```json
{
  "error": "Transação não encontrada"
}
```

**Uso no Frontend:**
```typescript
const tx = await transacaoAPI.buscarPorId(1)
if (tx) {
  // Usar dados da transação
}
```

---

## 🧪 Como Testar com curl

### Testar Localmente

#### 1. Todas as transações
```bash
curl -X GET http://localhost:8080/api/transacoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu-token}"
```

#### 2. Transações de um aluno
```bash
curl -X GET http://localhost:8080/api/transacoes/aluno/101 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu-token}"
```

#### 3. Filtrar por tipo
```bash
curl -X GET http://localhost:8080/api/transacoes/tipo/ENVIO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu-token}"
```

#### 4. Buscar por ID
```bash
curl -X GET http://localhost:8080/api/transacoes/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu-token}"
```

### Sem Autenticação (dev/demo)
```bash
# Se o backend não exigir token
curl -X GET http://localhost:8080/api/transacoes

# Com header Accept
curl -X GET http://localhost:8080/api/transacoes \
  -H "Accept: application/json"
```

---

## 📡 HTTP Status Codes

| Código | Significado | Exemplo |
|--------|------------|---------|
| 200 | OK - Sucesso | Transações retornadas |
| 400 | Bad Request | Parâmetro inválido |
| 401 | Unauthorized | Token expirado/inválido |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Transação não existe |
| 500 | Internal Error | Erro no servidor |

---

## 🔐 Autenticação

### Obter Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "aluno@example.com",
    "senha": "senha123"
  }'
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 101,
    "nome": "João Silva",
    "email": "aluno@example.com"
  }
}
```

### Usar Token em Requisições
```bash
curl -X GET http://localhost:8080/api/transacoes/aluno/101 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## 📊 Exemplos de Resposta

### Tipo: ENVIO (Moedas Enviadas)
```json
{
  "id": 1,
  "usuario": {
    "id": 1001,  // ID do professor
    "nome": "Prof. João"
  },
  "data": "2025-01-15T10:30:00Z",
  "valor": 250,
  "tipo": "ENVIO",
  "motivo": "Reconhecimento por projeto excelente"
}
```

### Tipo: RESGATE (Vantagem Resgatada)
```json
{
  "id": 2,
  "usuario": {
    "id": 101,  // ID do aluno
    "nome": "João Silva"
  },
  "data": "2025-01-14T15:45:00Z",
  "valor": -300,
  "tipo": "RESGATE",
  "motivo": "Resgate de Vantagem: Curso Online"
}
```

### Tipo: CREDITO (Crédito Recebido)
```json
{
  "id": 3,
  "usuario": {
    "id": 101,
    "nome": "João Silva"
  },
  "data": "2025-01-13T09:00:00Z",
  "valor": 150,
  "tipo": "CREDITO",
  "motivo": "Crédito administrativo"
}
```

---

## 🔄 Fluxo de Requisição

```
┌─────────────────────────┐
│  Frontend (React)       │
└────────────┬────────────┘
             │
             │ transacaoAPI.listarPorAluno(101)
             │
             ▼
┌─────────────────────────────┐
│  API Client (api.ts)        │
│  - Valida parâmetros       │
│  - Monta URL               │
│  - Adiciona headers        │
└────────────┬────────────────┘
             │
             │ fetch("/api/transacoes/aluno/101")
             │
             ▼
┌─────────────────────────────┐
│  Backend REST API           │
│  - Valida token             │
│  - Busca no banco          │
│  - Formata resposta        │
└────────────┬────────────────┘
             │
             │ JSON response
             │
             ▼
┌─────────────────────────────┐
│  Frontend (React)           │
│  - Recebe dados             │
│  - setState()               │
│  - Re-render               │
└─────────────────────────────┘
```

---

## ⚠️ Erros Comuns e Soluções

### Erro 401: Unauthorized
```
Causa: Token expirado ou inválido
Solução:
1. Fazer login novamente
2. Verificar token no localStorage
3. Adicionar header Authorization
```

### Erro 404: Not Found
```
Causa: Recurso não existe
Solução:
1. Verificar ID do aluno/transação
2. Confirmar dados existem no banco
3. Testar sem filtro primeiro
```

### Erro 500: Internal Server Error
```
Causa: Erro no backend
Solução:
1. Verificar logs do servidor
2. Reiniciar backend
3. Validar configuração do banco
```

### Nenhum Dado Retornado
```
Causa: Sem transações para critério
Solução:
1. Criar transações no banco
2. Verificar filtros aplicados
3. Testar com listar() sem filtro
```

---

## 🧩 Integração Frontend

### Uso em Dashboard
```typescript
import { transacaoAPI, TransacaoDTO } from '../lib/api'
import { useAuth } from '../context/Auth'

export default function Dashboard() {
  const { user } = useAuth()
  const [transacoes, setTransacoes] = useState<TransacaoDTO[]>([])

  useEffect(() => {
    if (!user?.id) return
    
    transacaoAPI.listarPorAluno(user.id)
      .then(txs => setTransacoes(txs.slice(0, 2)))
      .catch(err => console.error('Erro:', err))
  }, [user])

  return (
    <div>
      {transacoes.map(tx => (
        <div key={tx.id}>
          <p>{tx.motivo}</p>
          <p>Valor: {tx.valor}</p>
        </div>
      ))}
    </div>
  )
}
```

### Uso em Transactions Page
```typescript
import { transacaoAPI, TransacaoDTO } from '../lib/api'

export default function Transactions() {
  const [transacoes, setTransacoes] = useState<TransacaoDTO[]>([])
  const [tipo, setTipo] = useState<string>('todos')

  useEffect(() => {
    if (tipo === 'todos') {
      transacaoAPI.listar().then(setTransacoes)
    } else {
      transacaoAPI.listarPorTipo(tipo).then(setTransacoes)
    }
  }, [tipo])

  return (
    <table>
      <tbody>
        {transacoes.map(tx => (
          <tr key={tx.id}>
            <td>{tx.data}</td>
            <td>{tx.motivo}</td>
            <td>{tx.valor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

---

## 📋 Type Definition

```typescript
export type TransacaoDTO = {
  id: number                    // Identificador único
  usuario: {
    id: number                  // ID do usuário
    nome: string               // Nome do usuário
  }
  usuarioDestino?: {            // Opcional: para transferências
    id: number
    nome: string
  }
  data: string                 // ISO 8601 (2025-01-15T10:30:00Z)
  valor: number                // Valor em moedas
  tipo: string                 // ENVIO, RESGATE, CREDITO
  motivo: string              // Descrição da transação
}
```

---

## 🚀 Performance

### Queries Otimizadas
```sql
-- Listar transações do aluno (1 query)
SELECT * FROM transacao 
WHERE usuario_id = ? 
ORDER BY data DESC

-- Listar por tipo (1 query com index)
SELECT * FROM transacao 
WHERE tipo = ? 
ORDER BY data DESC

-- Buscar por ID (1 query com PK)
SELECT * FROM transacao 
WHERE id = ?
```

### Recomendações
- Índices: `(usuario_id)`, `(tipo)`, `(data DESC)`
- Cache: Transações recentes por aluno
- Paginação: Para alunos com 100+ transações

---

## 📝 Resumo

| Recurso | Método | Endpoint | Uso |
|---------|--------|----------|-----|
| Todas | GET | `/api/transacoes` | Listar todas |
| Por Aluno | GET | `/api/transacoes/aluno/{id}` | Dashboard/Transactions |
| Por Tipo | GET | `/api/transacoes/tipo/{tipo}` | Filtrar |
| Por ID | GET | `/api/transacoes/{id}` | Detalhe |

**Todos implementados e testados! ✅**

---

**Criado:** 2025-01-15  
**Versão:** 1.0  
**Status:** Referência Completa
