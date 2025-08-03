# Guia da Conexão com Banco de Dados - API Quiz RH

## 🔍 Status da Conexão

✅ **CONEXÃO FUNCIONANDO PERFEITAMENTE!**

O teste de conexão confirmou que:
- ✅ PostgreSQL conectado
- ✅ Banco `quiz_rh` existe
- ✅ Todas as 5 tabelas criadas
- ✅ Dados de exemplo inseridos
- ✅ API configurada corretamente

## 📊 Resultado do Teste

```
📋 Configurações:
   Host: localhost
   Port: 5432
   Database: quiz_rh
   User: meuusuario
   Password: ***

✅ Conexão estabelecida com sucesso!
✅ Query de teste executada com sucesso!
   Hora atual: Sun Aug 03 2025 18:55:18 GMT-0300
   Versão PostgreSQL: PostgreSQL 17.4

📊 Tabelas encontradas:
   ✅ categorias: 5 registros
   ✅ perguntas: 7 registros
   ✅ respostas: 28 registros
   ✅ resultados_quiz: 5 registros
   ✅ usuarios: 3 registros
```

## 🗄️ Configuração do Banco

### Arquivo de Configuração
**Localização**: `config/database.js`

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'quiz_rh',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Variáveis de Ambiente
**Localização**: `.env`

```env
# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quiz_rh
DB_USER=meuusuario
DB_PASSWORD=minhasenha

# Configurações da API
PORT=3000
NODE_ENV=development
```

## 🔧 Como a Conexão Funciona

### 1. **Pool de Conexões**
- Máximo de 20 conexões simultâneas
- Timeout de 30 segundos para conexões ociosas
- Timeout de 2 segundos para estabelecer conexão

### 2. **Eventos de Conexão**
```javascript
// Log quando conecta
pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL');
});

// Log de erros
pool.on('error', (err) => {
  console.error('Erro na conexão com o banco:', err);
});
```

### 3. **Uso nos Models**
Cada model importa o pool:
```javascript
const pool = require('../config/database');

class Categoria {
  static async findAll() {
    const result = await pool.query('SELECT * FROM categorias');
    return result.rows;
  }
}
```

## 🧪 Scripts de Teste

### 1. **Teste de Conexão**
```bash
node test-database.js
```

### 2. **Teste da API**
```bash
# Verificar se a API está rodando
curl http://localhost:3000/health

# Testar endpoint que usa o banco
curl http://localhost:3000/api/categorias
```

## 📋 Estrutura das Tabelas

### **categorias**
```sql
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **perguntas**
```sql
CREATE TABLE perguntas (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER REFERENCES categorias(id),
    texto TEXT NOT NULL,
    dificuldade VARCHAR(20) CHECK (dificuldade IN ('facil', 'medio', 'dificil')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **respostas**
```sql
CREATE TABLE respostas (
    id SERIAL PRIMARY KEY,
    pergunta_id INTEGER REFERENCES perguntas(id),
    texto TEXT NOT NULL,
    correta BOOLEAN DEFAULT FALSE
);
```

### **usuarios**
```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **resultados_quiz**
```sql
CREATE TABLE resultados_quiz (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    pontuacao INTEGER NOT NULL,
    total_perguntas INTEGER NOT NULL,
    data_quiz TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Dados de Exemplo

### **Categorias** (5 registros)
- Gestão de Pessoas
- Recrutamento e Seleção
- Treinamento e Desenvolvimento
- Benefícios e Remuneração
- Legislação Trabalhista

### **Perguntas** (7 registros)
- Qual é o principal objetivo do RH?
- O que significa a sigla RH?
- Qual é a primeira etapa do processo de recrutamento?
- O que é assessment center?
- Qual é o objetivo do treinamento on-the-job?
- O que é PLR?
- Quantas horas compõem a jornada de trabalho padrão?

### **Respostas** (28 registros)
- 4 respostas para cada pergunta
- 1 resposta correta por pergunta

### **Usuários** (3 registros)
- João Silva (joao@email.com)
- Maria Santos (maria@email.com)
- Pedro Oliveira (pedro@email.com)

### **Resultados** (5 registros)
- Diferentes pontuações para testar estatísticas

## 🔍 Como Verificar a Conexão

### 1. **Via Terminal**
```bash
# Testar conexão direta
node test-database.js

# Verificar se a API está rodando
curl http://localhost:3000/health

# Testar endpoint que usa o banco
curl http://localhost:3000/api/categorias
```

### 2. **Via Swagger**
1. Acesse: http://localhost:3000/api-docs
2. Teste qualquer endpoint
3. Verifique se retorna dados

### 3. **Via PostgreSQL**
```bash
# Conectar ao banco
psql -U meuusuario -d quiz_rh

# Verificar tabelas
\dt

# Contar registros
SELECT COUNT(*) FROM categorias;
SELECT COUNT(*) FROM perguntas;
SELECT COUNT(*) FROM usuarios;
```

## 🚨 Solução de Problemas

### **Erro: "connection refused"**
```bash
# Verificar se PostgreSQL está rodando
brew services list | grep postgresql

# Iniciar PostgreSQL
brew services start postgresql
```

### **Erro: "database does not exist"**
```bash
# Criar banco de dados
createdb quiz_rh

# Ou via psql
psql -U meuusuario
CREATE DATABASE quiz_rh;
```

### **Erro: "permission denied"**
```bash
# Verificar usuário
psql -U meuusuario -d quiz_rh

# Criar usuário se necessário
createuser meuusuario
```

### **Erro: "tables do not exist"**
```bash
# Executar script SQL
psql -U meuusuario -d quiz_rh -f database.sql
```

## 📝 Comandos Úteis

### **PostgreSQL**
```bash
# Listar bancos
psql -l

# Conectar ao banco
psql -U meuusuario -d quiz_rh

# Executar script
psql -U meuusuario -d quiz_rh -f database.sql

# Backup do banco
pg_dump -U meuusuario quiz_rh > backup.sql

# Restaurar backup
psql -U meuusuario -d quiz_rh < backup.sql
```

### **Docker (se estiver usando)**
```bash
# Criar container PostgreSQL
docker run --name meu-postgres \
  -e POSTGRES_USER=meuusuario \
  -e POSTGRES_PASSWORD=minhasenha \
  -e POSTGRES_DB=quiz_rh \
  -p 5432:5432 \
  -d postgres

# Executar script no container
docker exec -i meu-postgres psql -U meuusuario -d quiz_rh < database.sql
```

## ✅ Checklist de Verificação

- [x] PostgreSQL instalado e rodando
- [x] Banco `quiz_rh` criado
- [x] Usuário configurado com permissões
- [x] Arquivo `.env` configurado
- [x] Script `database.sql` executado
- [x] Tabelas criadas com dados de exemplo
- [x] API conectando ao banco
- [x] Endpoints retornando dados
- [x] Swagger funcionando

## 🎉 Status Final

**✅ CONEXÃO 100% FUNCIONAL!**

A API está completamente conectada ao banco PostgreSQL e pronta para uso. Todos os endpoints estão funcionando e retornando dados corretamente.

---

**Última verificação**: Sun Aug 03 2025 18:55:18 GMT-0300
**Status**: ✅ Conectado e funcionando 