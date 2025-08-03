const express = require('express');
const pool = require('./config/database');

// Criar app Express para testar
const app = express();
app.use(express.json());

// Middleware para testar conexão em cada requisição
app.use(async (req, res, next) => {
  try {
    const client = await pool.connect();
    req.dbClient = client;
    next();
  } catch (error) {
    console.error('❌ Erro na conexão com banco:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro na conexão com o banco de dados'
    });
  }
});

// Rota de teste que usa o banco
app.get('/test-db', async (req, res) => {
  try {
    const client = req.dbClient;
    
    // Testar query nas tabelas
    const categoriasResult = await client.query('SELECT COUNT(*) as count FROM categorias');
    const perguntasResult = await client.query('SELECT COUNT(*) as count FROM perguntas');
    const usuariosResult = await client.query('SELECT COUNT(*) as count FROM usuarios');
    
    res.json({
      success: true,
      message: 'API conectada ao banco com sucesso!',
      data: {
        categorias: categoriasResult.rows[0].count,
        perguntas: perguntasResult.rows[0].count,
        usuarios: usuariosResult.rows[0].count,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Erro na query:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao consultar banco de dados',
      error: error.message
    });
  } finally {
    if (req.dbClient) {
      req.dbClient.release();
    }
  }
});

// Rota para testar criação de dados
app.post('/test-create', async (req, res) => {
  try {
    const client = req.dbClient;
    
    // Testar inserção de categoria
    const insertResult = await client.query(`
      INSERT INTO categorias (nome, descricao) 
      VALUES ($1, $2) 
      RETURNING id, nome
    `, ['Teste API', 'Categoria criada via API']);
    
    res.json({
      success: true,
      message: 'Dados criados com sucesso via API!',
      data: insertResult.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Erro na criação:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar dados',
      error: error.message
    });
  } finally {
    if (req.dbClient) {
      req.dbClient.release();
    }
  }
});

// Iniciar servidor de teste
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🧪 Servidor de teste rodando na porta ${PORT}`);
  console.log(`📊 Teste de conexão: http://localhost:${PORT}/test-db`);
  console.log(`📝 Teste de criação: POST http://localhost:${PORT}/test-create`);
  console.log('');
  console.log('⏰ Servidor será encerrado em 30 segundos...');
  
  setTimeout(() => {
    console.log('🛑 Encerrando servidor de teste...');
    process.exit(0);
  }, 30000);
}); 