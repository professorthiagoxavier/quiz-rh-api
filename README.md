# API Quiz RH

API RESTful para sistema de quiz de Recursos Humanos desenvolvida com Node.js, Express e PostgreSQL.

## 🚀 Funcionalidades

- **CRUD completo** para todas as entidades (Categorias, Perguntas, Respostas, Usuários, Resultados)
- **Validações** de dados de entrada
- **Segurança** com Helmet e Rate Limiting
- **CORS** configurado para desenvolvimento
- **Logging** de requisições
- **Tratamento de erros** global
- **Health check** endpoint

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd quiz-rh-api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
   - Crie um banco PostgreSQL chamado `quiz_rh`
   - Execute os scripts SQL fornecidos para criar as tabelas

4. **Configure as variáveis de ambiente**
```bash
cp env.example .env
```
Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quiz_rh
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
PORT=3000
NODE_ENV=development
```

5. **Execute o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas

```sql
-- Categorias
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Perguntas
CREATE TABLE perguntas (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER REFERENCES categorias(id),
    texto TEXT NOT NULL,
    dificuldade VARCHAR(20) CHECK (dificuldade IN ('facil', 'medio', 'dificil')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Respostas
CREATE TABLE respostas (
    id SERIAL PRIMARY KEY,
    pergunta_id INTEGER REFERENCES perguntas(id),
    texto TEXT NOT NULL,
    correta BOOLEAN DEFAULT FALSE
);

-- Usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resultados de Quiz
CREATE TABLE resultados_quiz (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    pontuacao INTEGER NOT NULL,
    total_perguntas INTEGER NOT NULL,
    data_quiz TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📚 Documentação da API

### Swagger UI
A API possui documentação interativa com Swagger UI:

- **Documentação**: http://localhost:3000/api-docs
- **Redirecionamento**: http://localhost:3000/api

### Health Check
- `GET /health` - Verificar status da API

### Categorias
- `GET /api/categorias` - Listar todas as categorias
- `GET /api/categorias/:id` - Buscar categoria por ID
- `POST /api/categorias` - Criar nova categoria
- `PUT /api/categorias/:id` - Atualizar categoria
- `DELETE /api/categorias/:id` - Deletar categoria

### Perguntas
- `GET /api/perguntas` - Listar todas as perguntas
- `GET /api/perguntas/:id` - Buscar pergunta por ID
- `GET /api/perguntas/categoria/:categoriaId` - Buscar perguntas por categoria
- `GET /api/perguntas/dificuldade/:dificuldade` - Buscar perguntas por dificuldade
- `POST /api/perguntas` - Criar nova pergunta
- `PUT /api/perguntas/:id` - Atualizar pergunta
- `DELETE /api/perguntas/:id` - Deletar pergunta

### Respostas
- `GET /api/respostas` - Listar todas as respostas
- `GET /api/respostas/:id` - Buscar resposta por ID
- `GET /api/respostas/pergunta/:perguntaId` - Buscar respostas por pergunta
- `GET /api/respostas/pergunta/:perguntaId/correta` - Buscar resposta correta
- `POST /api/respostas` - Criar nova resposta
- `POST /api/respostas/multiple` - Criar múltiplas respostas
- `PUT /api/respostas/:id` - Atualizar resposta
- `DELETE /api/respostas/:id` - Deletar resposta
- `DELETE /api/respostas/pergunta/:perguntaId` - Deletar respostas da pergunta

### Usuários
- `GET /api/usuarios` - Listar todos os usuários
- `GET /api/usuarios/:id` - Buscar usuário por ID
- `GET /api/usuarios/email/:email` - Buscar usuário por email
- `GET /api/usuarios/:id/resultados` - Buscar resultados do usuário
- `POST /api/usuarios` - Criar novo usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Deletar usuário

### Resultados de Quiz
- `GET /api/resultados` - Listar todos os resultados
- `GET /api/resultados/:id` - Buscar resultado por ID
- `GET /api/resultados/usuario/:usuarioId` - Buscar resultados por usuário
- `GET /api/resultados/top-scores` - Buscar melhores pontuações
- `GET /api/resultados/estatisticas` - Buscar estatísticas gerais
- `POST /api/resultados` - Criar novo resultado
- `PUT /api/resultados/:id` - Atualizar resultado
- `DELETE /api/resultados/:id` - Deletar resultado
- `DELETE /api/resultados/usuario/:usuarioId` - Deletar resultados do usuário

## 📝 Exemplos de Uso

### Criar uma categoria
```bash
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Gestão de Pessoas",
    "descricao": "Perguntas sobre gestão de recursos humanos"
  }'
```

### Criar uma pergunta
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

### Criar um usuário
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com"
  }'
```

### Registrar resultado de quiz
```bash
curl -X POST http://localhost:3000/api/resultados \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "pontuacao": 8,
    "total_perguntas": 10
  }'
```

## 🔧 Configurações

### Variáveis de Ambiente
- `DB_HOST` - Host do PostgreSQL
- `DB_PORT` - Porta do PostgreSQL
- `DB_NAME` - Nome do banco de dados
- `DB_USER` - Usuário do banco
- `DB_PASSWORD` - Senha do banco
- `PORT` - Porta da API (padrão: 3000)
- `NODE_ENV` - Ambiente (development/production)

### Rate Limiting
- 100 requests por IP a cada 15 minutos

### Segurança
- Helmet para headers de segurança
- CORS configurado
- Validação de entrada
- Sanitização de dados

## 🚨 Tratamento de Erros

A API retorna respostas padronizadas:

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

## 📊 Estrutura do Projeto

```
quiz-rh-api/
├── config/
│   ├── database.js          # Configuração do banco
│   └── swagger.js           # Configuração do Swagger
├── controllers/
│   ├── categoriaController.js
│   ├── perguntaController.js
│   ├── respostaController.js
│   ├── usuarioController.js
│   └── resultadoQuizController.js
├── models/
│   ├── Categoria.js
│   ├── Pergunta.js
│   ├── Resposta.js
│   ├── Usuario.js
│   └── ResultadoQuiz.js
├── server.js                # Arquivo principal
├── package.json
├── env.example
├── database.sql             # Scripts SQL
├── README.md
├── API_DOCS.md              # Documentação detalhada
└── SWAGGER_GUIDE.md         # Guia do Swagger
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Desenvolvido para sistema de quiz de RH.

---

##Postgrees no docker 
docker run --name meu-postgres \
  -e POSTGRES_USER=meuusuario \
  -e POSTGRES_PASSWORD=minhasenha \
  -e POSTGRES_DB=meubanco \
  -p 5432:5432 \
  -d postgres

**Status:** ✅ Pronto para uso
**Versão:** 1.0.0 