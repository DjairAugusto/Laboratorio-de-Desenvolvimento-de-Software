# 🧪 Guia de Teste - Histórico de Transações

## ✅ Checklist de Validação

### 1. Build Frontend
- [ ] Executar `npm run build` no diretório `frontend/`
- [ ] Confirmar saída: "built in X.XXs" sem erros
- [ ] Arquivo dist/index.html criado

**Comando:**
```bash
cd src/frontend
npm run build
```

**Resultado esperado:**
```
✓ 1631 modules transformed.
dist/index.html                    0.42 kB
dist/assets/index-DOxqq9ae.css    19.95 kB
dist/assets/index-DCYZqUoZ.js    246.90 kB
✓ built in 3.64s
```

---

### 2. Dashboard - Verificação Visual

#### Pré-requisitos
- [ ] Backend rodando (http://localhost:8080)
- [ ] Banco de dados com dados de transação
- [ ] Aluno autenticado no sistema

#### Teste
1. **Fazer login**
   - Email: (aluno válido)
   - Senha: (correta)

2. **Navegar para Dashboard**
   - URL: http://localhost:3000/
   - Visualizar seção "Histórico de Transações"

3. **Verificações**
   - [ ] Mostram 2 últimas transações
   - [ ] Cada transação mostra:
     - [ ] Data formatada (dd/mm/yyyy)
     - [ ] Descrição da transação
     - [ ] Valor com cor (verde=+, vermelho=-)
   - [ ] Não há erro no console
   - [ ] Saldo, Recebidas, Resgatadas calculados corretamente

#### Dados Esperados (Exemplo)
```
Histórico de Transações

[📄] Resgate de Vantagem
     15/01/2025
     -300

[📄] Reconhecimento do Professor
     12/01/2025
     +250
```

---

### 3. Página de Transações - Funcionalidades

#### Pré-requisitos
- [ ] Estar logado como aluno
- [ ] Ter pelo menos 3 transações no banco

#### Teste 1: Carregar Página
1. Dashboard → "Ver tudo"
2. Ou URL direta: http://localhost:3000/transactions

**Verificações:**
- [ ] Tabela carrega sem erro
- [ ] Todas as transações aparecem
- [ ] Colunas: Data, Descrição, Usuário, Valor
- [ ] Valores formatados corretamente

#### Teste 2: Filtro por Tipo
1. Abrir dropdown "Todos"
2. Selecionar "Recebimento"
   - [ ] Tabela mostra apenas ENVIO (+)
   - [ ] Estatísticas atualizam

3. Selecionar "Resgate"
   - [ ] Tabela mostra apenas RESGATE (-)
   - [ ] Estatísticas atualizam

4. Selecionar "Todos"
   - [ ] Volta a mostrar todas

#### Teste 3: Busca por Descrição
1. Digitar no campo "Buscar por descrição/usuario"
2. Exemplo: "Reconhecimento"
   - [ ] Filtra transações com essa palavra
   - [ ] "Prof" também filtra (nome do professor)

3. Deletar texto
   - [ ] Volta a mostrar todas

#### Teste 4: Filtro por Data
1. Clicar campo "De"
   - [ ] Selecionar data 01/01/2025
   - [ ] Tabela mostra apenas a partir dessa data

2. Clicar campo "Até"
   - [ ] Selecionar data 31/12/2025
   - [ ] Tabela mostra apenas até essa data

3. Limpar ambas
   - [ ] Volta a mostrar todas

#### Teste 5: Estatísticas
- [ ] "Saldo Atual" = soma de todos os valores
- [ ] "Recebidas" = soma de valores > 0
- [ ] "Resgatadas" = soma de valores < 0 (em módulo)

**Fórmula de Validação:**
```
Saldo = Recebidas - Resgatadas
```

---

### 4. Modo Demo (Backend Offline)

#### Pré-requisitos
- [ ] Backend está **PARADO**

#### Teste
1. Fazer login (credenciais persistem em localStorage)
2. Navegar para Dashboard
   - [ ] Mostram dados de exemplo
   - [ ] Nenhum erro no console
   - [ ] Interface funcional

3. Navegar para Transactions
   - [ ] Mostram array de demo com 3 items
   - [ ] Filtros funcionam
   - [ ] Sem erros

**Dados de Demo Esperados:**
```
1. Reconhecimento: Projeto X - Prof. João - +250
2. Resgate: Curso Online - -300
3. Reconhecimento: Monitoria - Prof. Carla - +150
```

---

### 5. Formatação de Datas

#### Verificação Manual
Abrir Console (F12) e executar:
```javascript
// Deve retornar em formato pt-BR
new Date('2025-01-15').toLocaleDateString('pt-BR', { 
  day: '2-digit', 
  month: '2-digit', 
  year: 'numeric' 
})
// Resultado esperado: "15/01/2025"
```

#### Verificação Visual
- [ ] Datas aparecem como "DD/MM/YYYY"
- [ ] Não aparecem em ISO (2025-01-15)
- [ ] Não aparecem em en-US (01/15/2025)

---

### 6. Performance

#### Teste 1: Carregamento
1. Abrir Transactions.tsx
2. Medir tempo até mostrar dados
   - [ ] Deve ser < 2 segundos em conexão normal

#### Teste 2: Filtros
1. Com 50+ transações, filtrar por tipo
   - [ ] Resposta imediata (< 100ms)
   - [ ] Sem lag perceptível

#### Teste 3: Console Performance
1. Abrir DevTools → Performance tab
2. Fazer reload de Transactions
3. Verificar:
   - [ ] Nenhum erro de console
   - [ ] Nenhum warning de dependencies
   - [ ] FCP < 1.5s
   - [ ] LCP < 2.5s

---

### 7. Responsividade

#### Desktop (> 1024px)
- [ ] Dashboard em 3 colunas
- [ ] Transactions table com scroll horizontal se necessário
- [ ] Filtros em uma linha

#### Tablet (768px - 1024px)
- [ ] Dashboard em 2 colunas
- [ ] Transactions em grid responsivo
- [ ] Filtros em 2 linhas

#### Mobile (< 768px)
- [ ] Dashboard em 1 coluna
- [ ] Transactions table com scroll horizontal
- [ ] Filtros em 4 linhas
- [ ] Valores visíveis
- [ ] Sem overflow indesejado

---

### 8. TypeScript / Erros

#### Build Verifications
```bash
# 1. Type checking
tsc --noEmit

# Resultado esperado: (0 errors)

# 2. Build completo
npm run build

# Resultado esperado: built in X.XXs (sem TS errors)
```

#### Console Verifications (Runtime)
1. Abrir F12 → Console
2. Recarregar página
   - [ ] Nenhum erro TS em tempo real
   - [ ] Nenhum "Cannot read property"
   - [ ] Nenhum "is not a function"

---

### 9. Integração com Features Existentes

#### Vantagens Exchange
1. Fazer login como aluno
2. Navegar para /vantagens
3. Resgatar uma vantagem
4. Voltar para Dashboard
   - [ ] Nova transação aparece em "Histórico de Transações"
   - [ ] Saldo foi debilitado
   - [ ] Tipo é "RESGATE"

#### Coin Transfer (Professor)
1. Fazer login como professor
2. Enviar moedas para aluno
3. Aluno faz login
4. Verifica Dashboard
   - [ ] Nova transação aparece
   - [ ] Saldo foi creditado
   - [ ] Tipo é "ENVIO"

---

### 10. Edge Cases

#### Sem Transações
- [ ] Aluno novo (0 transações)
  - Dashboard: "Nenhuma transação encontrada"
  - Transactions: Tabela vazia
  - Estatísticas: 0 / 0 / 0

#### Com Muitas Transações
- [ ] 100+ transações
  - Dashboard: Mostra últimas 2 OK
  - Transactions: Pagina rapidamente
  - Filtros: Responsivos

#### Datas Extremas
- [ ] Transação de 1970
  - [ ] Formata corretamente
- [ ] Transação do futuro
  - [ ] Formata corretamente
- [ ] Timezone diferente
  - [ ] Data local respeita timezone

---

## 🐛 Troubleshooting

### Problema: Nenhuma transação mostra

**Solução:**
1. Verificar se backend está rodando
2. Testar endpoint:
   ```bash
   curl http://localhost:8080/api/transacoes
   ```
3. Se vazio, inserir dados no banco
4. Se erro, verificar logs do backend

---

### Problema: Erro "transacaoAPI is undefined"

**Solução:**
1. Verificar `src/lib/api.ts` tem `transacaoAPI`
2. Executar `npm run build` novamente
3. Limpar cache:
   ```bash
   npm run build -- --force
   ```

---

### Problema: Datas erradas (3 horas de diferença)

**Solução:**
1. Verificar se backend envia ISO UTC
2. Verificar timezone do navegador
3. Confirmar função `formatData()` em Dashboard.tsx

---

### Problema: Filtro não funciona

**Solução:**
1. Verificar type do filtro (ENVIO, RESGATE, etc)
2. Confirmar tipo no banco é maiúsculo
3. Testar no console:
   ```javascript
   transacoes.filter(t => t.tipo === 'ENVIO')
   ```

---

## 📊 Relatório de Teste

Use este template para documentar teste:

```markdown
### Teste: [Nome]
Data: YYYY-MM-DD
Ambiente: [dev/staging/prod]

| Item | Status | Observação |
|------|--------|-----------|
| Build | ✅/❌ | ... |
| Dashboard | ✅/❌ | ... |
| Transactions | ✅/❌ | ... |
| Demo Mode | ✅/❌ | ... |
| Performance | ✅/❌ | ... |

Resultado Final: PASSOU / FALHOU
Observações: ...
```

---

## ✨ Checklist Final

- [ ] Build completo sem erros
- [ ] Dashboard mostra transações reais
- [ ] Transactions com todos filtros funcionando
- [ ] Modo demo funciona
- [ ] Sem erros no console
- [ ] Formatação correta de datas
- [ ] Responsividade OK
- [ ] Integração com vantagens OK
- [ ] TypeScript sem erros
- [ ] Performance OK

**Pronto para produção quando todos os itens estão ✅**

---

**Criado:** 2025-01-15  
**Versão:** 1.0  
**Status:** Guia Completo ✅
