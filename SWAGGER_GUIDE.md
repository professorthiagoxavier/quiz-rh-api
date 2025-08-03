# Guia da Documentação Swagger - API Quiz RH

## 🚀 Como Acessar a Documentação

### 1. Inicie o servidor
```bash
npm start
# ou
npm run dev
```

### 2. Acesse a documentação
Abra seu navegador e acesse:

- **Documentação Swagger**: http://localhost:3000/api-docs
- **Redirecionamento**: http://localhost:3000/api (redireciona para /api-docs)

## 📚 O que você encontrará na documentação

### 🏷️ **Tags Organizadas:**
- **Sistema**: Endpoints de health check
- **Categorias**: CRUD completo de categorias
- **Perguntas**: CRUD completo de perguntas + filtros
- **Respostas**: CRUD completo de respostas + múltiplas
- **Usuários**: CRUD completo de usuários
- **Resultados**: CRUD completo de resultados + estatísticas

### 🔧 **Funcionalidades da Documentação:**

#### 1. **Teste Direto na Interface**
- Clique em qualquer endpoint
- Clique em "Try it out"
- Preencha os parâmetros
- Execute a requisição
- Veja a resposta em tempo real

#### 2. **Exemplos Prontos**
- Todos os endpoints têm exemplos de requisição
- Schemas bem definidos para cada entidade
- Códigos de resposta documentados

#### 3. **Validações Visuais**
- Campos obrigatórios marcados
- Tipos de dados especificados
- Enums para valores específicos

## 🎯 **Endpoints Principais Documentados:**

### **Categorias**
- `GET /api/categorias` - Listar todas
- `GET /api/categorias/{id}` - Buscar por ID
- `POST /api/categorias` - Criar nova
- `PUT /api/categorias/{id}` - Atualizar
- `DELETE /api/categorias/{id}` - Remover

### **Perguntas**
- `GET /api/perguntas` - Listar todas
- `GET /api/perguntas/categoria/{categoriaId}` - Por categoria
- `GET /api/perguntas/dificuldade/{dificuldade}` - Por dificuldade
- `POST /api/perguntas` - Criar nova

### **Respostas**
- `GET /api/respostas/pergunta/{perguntaId}` - Por pergunta
- `POST /api/respostas/multiple` - Criar múltiplas
- `GET /api/respostas/pergunta/{perguntaId}/correta` - Resposta correta

### **Usuários**
- `GET /api/usuarios` - Listar todos
- `GET /api/usuarios/email/{email}` - Por email
- `POST /api/usuarios` - Criar novo

### **Resultados**
- `GET /api/resultados/top-scores` - Melhores pontuações
- `GET /api/resultados/estatisticas` - Estatísticas gerais
- `POST /api/resultados` - Registrar resultado

## 🧪 **Como Testar na Interface:**

### **Exemplo: Criar uma Categoria**

1. **Acesse**: http://localhost:3000/api-docs
2. **Expanda**: Seção "Categorias"
3. **Clique**: `POST /api/categorias`
4. **Clique**: "Try it out"
5. **Preencha**:
   ```json
   {
     "nome": "Gestão de Pessoas",
     "descricao": "Perguntas sobre gestão de recursos humanos"
   }
   ```
6. **Clique**: "Execute"
7. **Veja**: A resposta com status 201

### **Exemplo: Criar Pergunta com Respostas**

1. **Crie uma categoria** (passo anterior)
2. **Crie uma pergunta**:
   ```json
   {
     "categoria_id": 1,
     "texto": "Qual é o principal objetivo do RH?",
     "dificuldade": "facil"
   }
   ```
3. **Crie múltiplas respostas**:
   ```json
   {
     "pergunta_id": 1,
     "respostas": [
       {"texto": "Contratar funcionários", "correta": false},
       {"texto": "Gerenciar pessoas", "correta": true},
       {"texto": "Apenas pagar salários", "correta": false},
       {"texto": "Fazer demissões", "correta": false}
     ]
   }
   ```

## 📊 **Schemas Documentados:**

### **Categoria**
```json
{
  "id": 1,
  "nome": "Gestão de Pessoas",
  "descricao": "Perguntas sobre gestão de recursos humanos",
  "created_at": "2024-01-23T10:30:00.000Z"
}
```

### **Pergunta**
```json
{
  "id": 1,
  "categoria_id": 1,
  "categoria_nome": "Gestão de Pessoas",
  "texto": "Qual é o principal objetivo do RH?",
  "dificuldade": "facil",
  "created_at": "2024-01-23T10:30:00.000Z"
}
```

### **Resposta**
```json
{
  "id": 1,
  "pergunta_id": 1,
  "pergunta_texto": "Qual é o principal objetivo do RH?",
  "texto": "Gerenciar pessoas",
  "correta": true
}
```

### **Usuario**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "created_at": "2024-01-23T10:30:00.000Z"
}
```

### **ResultadoQuiz**
```json
{
  "id": 1,
  "usuario_id": 1,
  "usuario_nome": "João Silva",
  "pontuacao": 8,
  "total_perguntas": 10,
  "data_quiz": "2024-01-23T10:30:00.000Z"
}
```

## 🔍 **Códigos de Resposta:**

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro de validação
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

## 🎨 **Personalização:**

A documentação está personalizada com:
- Título: "API Quiz RH - Documentação"
- Remoção da barra superior padrão
- Schemas bem organizados
- Exemplos práticos

## 🚨 **Importante:**

- Certifique-se de que o banco PostgreSQL está configurado
- As variáveis de ambiente estão corretas no arquivo `.env`
- O servidor está rodando na porta 3000

## 🔗 **Links Úteis:**

- **Documentação**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **API Base**: http://localhost:3000/api

---

**Status**: ✅ Documentação Swagger funcionando
**Versão**: 1.0.0 