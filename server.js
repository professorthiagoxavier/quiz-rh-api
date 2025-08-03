const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Importar configuração do Swagger
const swaggerSpecs = require('./config/swagger');

// Importar controllers
const CategoriaController = require('./controllers/categoriaController');
const PerguntaController = require('./controllers/perguntaController');
const RespostaController = require('./controllers/respostaController');
const UsuarioController = require('./controllers/usuarioController');
const ResultadoQuizController = require('./controllers/resultadoQuizController');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações de segurança
app.use(helmet());

// Configuração do CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests por IP
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em alguns minutos.'
  }
});
app.use(limiter);

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check da API
 *     description: Verifica se a API está funcionando corretamente
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: API funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API Quiz RH está funcionando!
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-23T10:30:00.000Z
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Quiz RH está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Quiz RH - Documentação'
}));

// Rota para acessar a documentação da API
app.get('/api', (req, res) => {
  res.redirect('/api-docs');
});

// Rotas para Categorias
app.get('/api/categorias', CategoriaController.listarCategorias);
app.get('/api/categorias/:id', CategoriaController.buscarCategoria);
app.post('/api/categorias', CategoriaController.criarCategoria);
app.put('/api/categorias/:id', CategoriaController.atualizarCategoria);
app.delete('/api/categorias/:id', CategoriaController.deletarCategoria);

// Rotas para Perguntas
app.get('/api/perguntas', PerguntaController.listarPerguntas);
app.get('/api/perguntas/:id', PerguntaController.buscarPergunta);
app.get('/api/perguntas/categoria/:categoriaId', PerguntaController.buscarPorCategoria);
app.get('/api/perguntas/dificuldade/:dificuldade', PerguntaController.buscarPorDificuldade);
app.post('/api/perguntas', PerguntaController.criarPergunta);
app.put('/api/perguntas/:id', PerguntaController.atualizarPergunta);
app.delete('/api/perguntas/:id', PerguntaController.deletarPergunta);

// Rotas para Respostas
app.get('/api/respostas', RespostaController.listarRespostas);
app.get('/api/respostas/:id', RespostaController.buscarResposta);
app.get('/api/respostas/pergunta/:perguntaId', RespostaController.buscarPorPergunta);
app.get('/api/respostas/pergunta/:perguntaId/correta', RespostaController.buscarRespostaCorreta);
app.post('/api/respostas', RespostaController.criarResposta);
app.post('/api/respostas/multiple', RespostaController.criarMultiplasRespostas);
app.put('/api/respostas/:id', RespostaController.atualizarResposta);
app.delete('/api/respostas/:id', RespostaController.deletarResposta);
app.delete('/api/respostas/pergunta/:perguntaId', RespostaController.deletarPorPergunta);

// Rotas para Usuários
app.get('/api/usuarios', UsuarioController.listarUsuarios);
app.get('/api/usuarios/:id', UsuarioController.buscarUsuario);
app.get('/api/usuarios/email/:email', UsuarioController.buscarPorEmail);
app.get('/api/usuarios/:id/resultados', UsuarioController.buscarResultados);
app.post('/api/usuarios', UsuarioController.criarUsuario);
app.put('/api/usuarios/:id', UsuarioController.atualizarUsuario);
app.delete('/api/usuarios/:id', UsuarioController.deletarUsuario);

// Rotas para Resultados de Quiz
app.get('/api/resultados', ResultadoQuizController.listarResultados);
app.get('/api/resultados/:id', ResultadoQuizController.buscarResultado);
app.get('/api/resultados/usuario/:usuarioId', ResultadoQuizController.buscarPorUsuario);
app.get('/api/resultados/top-scores', ResultadoQuizController.buscarTopScores);
app.get('/api/resultados/estatisticas', ResultadoQuizController.buscarEstatisticas);
app.post('/api/resultados', ResultadoQuizController.criarResultado);
app.put('/api/resultados/:id', ResultadoQuizController.atualizarResultado);
app.delete('/api/resultados/:id', ResultadoQuizController.deletarResultado);
app.delete('/api/resultados/usuario/:usuarioId', ResultadoQuizController.deletarPorUsuario);

// Middleware para tratamento de erros 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Middleware para tratamento de erros globais
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
});

module.exports = app; 