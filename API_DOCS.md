# Documentação da API Quiz RH

## Base URL
```
http://localhost:3000
```

## Autenticação
Esta API não requer autenticação para as operações básicas.

## Formato de Resposta
Todas as respostas seguem o formato padrão:

**Sucesso:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operação realizada com sucesso"
}
```

**Erro:**
```json
{
  "success": false,
  "message": "Descrição do erro"
}
```

## Endpoints

### 1. Health Check

#### GET /health
Verifica se a API está funcionando.

**Resposta:**
```json
{
  "success": true,
  "message": "API Quiz RH está funcionando!",
  "timestamp": "2024-01-23T10:30:00.000Z"
}
```

---

### 2. Categorias

#### GET /api/categorias
Lista todas as categorias.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Gestão de Pessoas",
      "descricao": "Perguntas sobre gestão de recursos humanos",
      "created_at": "2024-01-23T10:30:00.000Z"
    }
  ],
  "message": "Categorias listadas com sucesso"
}
```

#### GET /api/categorias/:id
Busca uma categoria específica.

**Parâmetros:**
- `id` (number): ID da categoria

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Gestão de Pessoas",
    "descricao": "Perguntas sobre gestão de recursos humanos",
    "created_at": "2024-01-23T10:30:00.000Z"
  },
  "message": "Categoria encontrada com sucesso"
}
```

#### POST /api/categorias
Cria uma nova categoria.

**Body:**
```json
{
  "nome": "Recrutamento e Seleção",
  "descricao": "Perguntas sobre processos de R&S"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "nome": "Recrutamento e Seleção",
    "descricao": "Perguntas sobre processos de R&S",
    "created_at": "2024-01-23T10:30:00.000Z"
  },
  "message": "Categoria criada com sucesso"
}
```

#### PUT /api/categorias/:id
Atualiza uma categoria existente.

**Parâmetros:**
- `id` (number): ID da categoria

**Body:**
```json
{
  "nome": "Gestão de Pessoas Atualizada",
  "descricao": "Descrição atualizada"
}
```

#### DELETE /api/categorias/:id
Remove uma categoria.

**Parâmetros:**
- `id` (number): ID da categoria

---

### 3. Perguntas

#### GET /api/perguntas
Lista todas as perguntas com informações da categoria.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "categoria_id": 1,
      "categoria_nome": "Gestão de Pessoas",
      "texto": "Qual é o principal objetivo do RH?",
      "dificuldade": "facil",
      "created_at": "2024-01-23T10:30:00.000Z"
    }
  ],
  "message": "Perguntas listadas com sucesso"
}
```

#### GET /api/perguntas/:id
Busca uma pergunta específica.

#### GET /api/perguntas/categoria/:categoriaId
Lista perguntas de uma categoria específica.

#### GET /api/perguntas/dificuldade/:dificuldade
Lista perguntas por dificuldade (facil, medio, dificil).

#### POST /api/perguntas
Cria uma nova pergunta.

**Body:**
```json
{
  "categoria_id": 1,
  "texto": "Qual é o principal objetivo do RH?",
  "dificuldade": "facil"
}
```

#### PUT /api/perguntas/:id
Atualiza uma pergunta existente.

#### DELETE /api/perguntas/:id
Remove uma pergunta.

---

### 4. Respostas

#### GET /api/respostas
Lista todas as respostas com informações da pergunta.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "pergunta_id": 1,
      "pergunta_texto": "Qual é o principal objetivo do RH?",
      "texto": "Gerenciar pessoas",
      "correta": true
    }
  ],
  "message": "Respostas listadas com sucesso"
}
```

#### GET /api/respostas/:id
Busca uma resposta específica.

#### GET /api/respostas/pergunta/:perguntaId
Lista respostas de uma pergunta específica.

#### GET /api/respostas/pergunta/:perguntaId/correta
Busca a resposta correta de uma pergunta.

#### POST /api/respostas
Cria uma nova resposta.

**Body:**
```json
{
  "pergunta_id": 1,
  "texto": "Gerenciar pessoas",
  "correta": true
}
```

#### POST /api/respostas/multiple
Cria múltiplas respostas para uma pergunta.

**Body:**
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

#### PUT /api/respostas/:id
Atualiza uma resposta existente.

#### DELETE /api/respostas/:id
Remove uma resposta.

#### DELETE /api/respostas/pergunta/:perguntaId
Remove todas as respostas de uma pergunta.

---

### 5. Usuários

#### GET /api/usuarios
Lista todos os usuários.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "created_at": "2024-01-23T10:30:00.000Z"
    }
  ],
  "message": "Usuários listados com sucesso"
}
```

#### GET /api/usuarios/:id
Busca um usuário específico.

#### GET /api/usuarios/email/:email
Busca um usuário por email.

#### GET /api/usuarios/:id/resultados
Lista resultados de quiz de um usuário específico.

#### POST /api/usuarios
Cria um novo usuário.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com"
}
```

#### PUT /api/usuarios/:id
Atualiza um usuário existente.

#### DELETE /api/usuarios/:id
Remove um usuário.

---

### 6. Resultados de Quiz

#### GET /api/resultados
Lista todos os resultados com informações do usuário.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "usuario_id": 1,
      "usuario_nome": "João Silva",
      "pontuacao": 8,
      "total_perguntas": 10,
      "data_quiz": "2024-01-23T10:30:00.000Z"
    }
  ],
  "message": "Resultados listados com sucesso"
}
```

#### GET /api/resultados/:id
Busca um resultado específico.

#### GET /api/resultados/usuario/:usuarioId
Lista resultados de um usuário específico.

#### GET /api/resultados/top-scores
Lista melhores pontuações.

**Query Parameters:**
- `limit` (number, opcional): Número de resultados (padrão: 10)

#### GET /api/resultados/estatisticas
Retorna estatísticas gerais dos resultados.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total_resultados": 25,
    "media_pontuacao": 7.2,
    "maior_pontuacao": 10,
    "menor_pontuacao": 3,
    "total_usuarios": 15
  },
  "message": "Estatísticas calculadas com sucesso"
}
```

#### POST /api/resultados
Cria um novo resultado de quiz.

**Body:**
```json
{
  "usuario_id": 1,
  "pontuacao": 8,
  "total_perguntas": 10
}
```

#### PUT /api/resultados/:id
Atualiza um resultado existente.

#### DELETE /api/resultados/:id
Remove um resultado.

#### DELETE /api/resultados/usuario/:usuarioId
Remove todos os resultados de um usuário.

---

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## Validações

### Categorias
- Nome é obrigatório

### Perguntas
- Texto é obrigatório
- Dificuldade deve ser: facil, medio, dificil
- Categoria_id é opcional

### Respostas
- Texto é obrigatório
- Pergunta_id é obrigatório
- Correta é opcional (padrão: false)

### Usuários
- Nome é obrigatório
- Email é obrigatório e deve ser único
- Email deve ter formato válido

### Resultados
- Usuario_id é obrigatório
- Pontuacao é obrigatória
- Total_perguntas é obrigatório
- Pontuacao não pode ser maior que total_perguntas

## Exemplos de Uso com cURL

### Criar categoria
```bash
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Gestão de Pessoas",
    "descricao": "Perguntas sobre gestão de recursos humanos"
  }'
```

### Criar pergunta
```bash
curl -X POST http://localhost:3000/api/perguntas \
  -H "Content-Type: application/json" \
  -d '{
    "categoria_id": 1,
    "texto": "Qual é o principal objetivo do RH?",
    "dificuldade": "facil"
  }'
```

### Criar múltiplas respostas
```bash
curl -X POST http://localhost:3000/api/respostas/multiple \
  -H "Content-Type: application/json" \
  -d '{
    "pergunta_id": 1,
    "respostas": [
      {"texto": "Contratar funcionários", "correta": false},
      {"texto": "Gerenciar pessoas", "correta": true},
      {"texto": "Apenas pagar salários", "correta": false},
      {"texto": "Fazer demissões", "correta": false}
    ]
  }'
```

### Criar usuário
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com"
  }'
```

### Registrar resultado
```bash
curl -X POST http://localhost:3000/api/resultados \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "pontuacao": 8,
    "total_perguntas": 10
  }'
```

## Rate Limiting

A API possui rate limiting configurado:
- 100 requests por IP a cada 15 minutos
- Resposta de erro quando o limite é excedido

## Segurança

- Headers de segurança com Helmet
- CORS configurado
- Validação de entrada
- Sanitização de dados
- Rate limiting 


