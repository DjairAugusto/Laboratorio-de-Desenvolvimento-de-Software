# CRUD de Vantagens - Guia Completo

## 📄 Paginação

Todos os endpoints de listagem suportam paginação via query parameters:

- `page`: número da página (default: 0)
- `size`: itens por página (default: 10)
- `sortBy`: campo para ordenação (default: id) - pode ser: id, descricao, custoMoedas
- `direction`: direção - asc ou desc (default: asc)

Exemplos:
```http
# Primeira página com 10 itens, ordenado por descrição
GET /api/vantagens?page=0&size=10&sortBy=descricao&direction=asc

# Segunda página com 5 itens, ordenado por custo decrescente
GET /api/empresas/1/vantagens?page=1&size=5&sortBy=custoMoedas&direction=desc
```

Resposta paginada (estrutura Page):
```json
{
  "content": [ /* array de VantagemResponseDTO */ ],
  "pageable": { "pageNumber": 0, "pageSize": 10 },
  "totalPages": 5,
  "totalElements": 47,
  "last": false,
  "first": true,
  "size": 10,
  "number": 0,
  "numberOfElements": 10,
  "empty": false
}
```

---

## ✅ Como garantir que empresa_id seja persistida

O campo `empresa_id` na tabela `vantagem` **SERÁ** cadastrado quando você:

<!-- ### Opção 1: Usar endpoint aninhado (recomendado)
```http
POST http://localhost:8080/api/empresas/1/vantagens
Content-Type: application/json

{
  "descricao": "10% de desconto",
  "custoMoedas": 50
} -->
```
✅ O `empresaId` é extraído automaticamente do path `/empresas/1/...`

### Opção 2: Usar endpoint geral COM empresaId no body
```http
POST http://localhost:8080/api/vantagens
Content-Type: application/json

{
  "descricao": "10% de desconto",
  "custoMoedas": 50,
  "empresaId": 1  ← IMPORTANTE: incluir este campo!
}
```
✅ O service vincula a empresa se `empresaId` for fornecido

### ❌ O que NÃO funciona:
```http
POST http://localhost:8080/api/vantagens
Content-Type: application/json

{
  "descricao": "10% de desconto",
  "custoMoedas": 50
  // ❌ empresaId ausente = empresa_id será NULL no banco!
}
```

---

## Verificação no banco de dados

Para confirmar que empresa_id está sendo salva, conecte no PostgreSQL:

```sql
SELECT id, descricao, custo_moedas, empresa_id 
FROM vantagem;
```

Resultado esperado:
```
 id |      descricao      | custo_moedas | empresa_id 
----+---------------------+--------------+------------
  1 | 10% de desconto     |           50 |          1
  2 | Café grátis         |           30 |          1
```

---

## Pré-requisito: Empresa deve existir

Antes de criar vantagens, garanta que existe pelo menos uma empresa cadastrada:

```http
### 1. Criar empresa parceira
POST http://localhost:8080/api/empresas
Content-Type: application/json

{
  "nome": "Acme Ltda",
  "documento": "12345678900",
  "email": "contato@acme.com",
  "login": "acme",
  "senha": "senha123",
  "nomeFantasia": "Acme S/A",
  "cnpj": "12.345.678/0001-00"
}
```

Resposta (copie o `id` retornado):
```json
{
  "id": 1,
  "nome": "Acme Ltda",
  "nomeFantasia": "Acme S/A",
  ...
}
```

### 2. Criar vantagem para esta empresa

**Forma 1 - Aninhado (mais seguro)**:
```http
POST http://localhost:8080/api/empresas/1/vantagens
Content-Type: application/json

{
  "descricao": "Desconto especial",
  "foto": null,
  "custoMoedas": 75
}
```

**Forma 2 - Geral com empresaId**:
```http
POST http://localhost:8080/api/vantagens
Content-Type: application/json

{
  "descricao": "Desconto especial",
  "foto": null,
  "custoMoedas": 75,
  "empresaId": 1  ← usar o ID da empresa criada
}
```

---

## Log SQL para debug

O arquivo `application.properties` já tem `spring.jpa.show-sql=true`, então você verá no console:

```
Hibernate: insert into vantagem (custo_moedas,descricao,empresa_id,foto) values (?,?,?,?)
```

Se `empresa_id` aparece no INSERT, o backend está funcionando corretamente! ✅

Se aparecer `empresa_id=null` nos parâmetros, significa que:
- Você não passou `empresaId` no body (opção 2), OU
- Você não usou o endpoint aninhado (opção 1), OU
- A empresa com o ID informado não existe no banco

---

## Casos de uso

### Empresa gerencia suas próprias vantagens
```http
# Listar vantagens da empresa 1
GET http://localhost:8080/api/empresas/1/vantagens

# Criar vantagem para empresa 1
POST http://localhost:8080/api/empresas/1/vantagens
{ "descricao": "...", "custoMoedas": 50 }

# Atualizar vantagem 10 da empresa 1 (com verificação de ownership)
PUT http://localhost:8080/api/empresas/1/vantagens/10
{ "descricao": "...", "custoMoedas": 60 }

# Deletar vantagem 10 da empresa 1 (só se pertencer a ela)
DELETE http://localhost:8080/api/empresas/1/vantagens/10
```

### Admin/sistema gerencia todas as vantagens
```http
# Listar todas
GET http://localhost:8080/api/vantagens

# Criar (precisa informar empresaId no body)
POST http://localhost:8080/api/vantagens
{ "descricao": "...", "custoMoedas": 50, "empresaId": 1 }

# Atualizar (pode mudar de empresa se quiser)
PUT http://localhost:8080/api/vantagens/10
{ "descricao": "...", "custoMoedas": 60, "empresaId": 2 }
```

---

## Resumo

| Endpoint                                    | empresaId vem de      | Ownership verificado? |
|---------------------------------------------|-----------------------|-----------------------|
| POST /api/vantagens                         | Body (opcional)       | ❌ Não                |
| POST /api/empresas/{id}/vantagens           | Path (automático)     | ✅ Sim (na criação)   |
| PUT /api/vantagens/{id}                     | Body (opcional)       | ❌ Não                |
| PUT /api/empresas/{empresaId}/vantagens/{id}| Path (verificado)     | ✅ Sim                |
| DELETE /api/vantagens/{id}                  | —                     | ❌ Não                |
| DELETE /api/empresas/{empresaId}/vantagens/{id}| Path (verificado)  | ✅ Sim                |

**Recomendação**: Use endpoints aninhados (`/api/empresas/{id}/vantagens`) quando a interface for específica da empresa (portal da empresa parceira). Use endpoints gerais (`/api/vantagens`) apenas para admin/sistema.
