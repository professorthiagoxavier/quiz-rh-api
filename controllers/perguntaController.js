const Pergunta = require('../models/Pergunta');

class PerguntaController {
  /**
   * @swagger
   * /api/perguntas:
   *   get:
   *     summary: Lista todas as perguntas
   *     description: Retorna uma lista de todas as perguntas com informações da categoria
   *     tags: [Perguntas]
   *     responses:
   *       200:
   *         description: Lista de perguntas retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Pergunta'
   *                 message:
   *                   type: string
   *                   example: Perguntas listadas com sucesso
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  static async listarPerguntas(req, res) {
    try {
      const perguntas = await Pergunta.findAll();
      res.json({
        success: true,
        data: perguntas,
        message: 'Perguntas listadas com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/perguntas/:id - Buscar pergunta por ID
  static async buscarPergunta(req, res) {
    try {
      const { id } = req.params;
      const pergunta = await Pergunta.findById(id);
      
      if (!pergunta) {
        return res.status(404).json({
          success: false,
          message: 'Pergunta não encontrada'
        });
      }

      res.json({
        success: true,
        data: pergunta,
        message: 'Pergunta encontrada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/perguntas/categoria/:categoriaId - Buscar perguntas por categoria
  static async buscarPorCategoria(req, res) {
    try {
      const { categoriaId } = req.params;
      const perguntas = await Pergunta.findByCategoria(categoriaId);
      
      res.json({
        success: true,
        data: perguntas,
        message: 'Perguntas da categoria listadas com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/perguntas/dificuldade/:dificuldade - Buscar perguntas por dificuldade
  static async buscarPorDificuldade(req, res) {
    try {
      const { dificuldade } = req.params;
      const perguntas = await Pergunta.findByDificuldade(dificuldade);
      
      res.json({
        success: true,
        data: perguntas,
        message: `Perguntas de dificuldade ${dificuldade} listadas com sucesso`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/perguntas:
   *   post:
   *     summary: Cria uma nova pergunta
   *     description: Cria uma nova pergunta no sistema
   *     tags: [Perguntas]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               categoria_id:
   *                 type: integer
   *                 description: ID da categoria
   *                 example: 1
   *               texto:
   *                 type: string
   *                 description: Texto da pergunta
   *                 example: Qual é o principal objetivo do RH?
   *               dificuldade:
   *                 type: string
   *                 enum: [facil, medio, dificil]
   *                 description: Nível de dificuldade da pergunta
   *                 example: facil
   *             required:
   *               - texto
   *               - dificuldade
   *     responses:
   *       201:
   *         description: Pergunta criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Pergunta'
   *                 message:
   *                   type: string
   *                   example: Pergunta criada com sucesso
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  static async criarPergunta(req, res) {
    try {
      const { categoria_id, texto, dificuldade } = req.body;

      // Validação básica
      if (!texto) {
        return res.status(400).json({
          success: false,
          message: 'Texto da pergunta é obrigatório'
        });
      }

      if (!dificuldade || !['facil', 'medio', 'dificil'].includes(dificuldade)) {
        return res.status(400).json({
          success: false,
          message: 'Dificuldade deve ser: facil, medio ou dificil'
        });
      }

      const novaPergunta = await Pergunta.create({ categoria_id, texto, dificuldade });
      
      res.status(201).json({
        success: true,
        data: novaPergunta,
        message: 'Pergunta criada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/perguntas/:id - Atualizar pergunta
  static async atualizarPergunta(req, res) {
    try {
      const { id } = req.params;
      const { categoria_id, texto, dificuldade } = req.body;

      // Verificar se a pergunta existe
      const perguntaExistente = await Pergunta.findById(id);
      if (!perguntaExistente) {
        return res.status(404).json({
          success: false,
          message: 'Pergunta não encontrada'
        });
      }

      // Validação básica
      if (!texto) {
        return res.status(400).json({
          success: false,
          message: 'Texto da pergunta é obrigatório'
        });
      }

      if (dificuldade && !['facil', 'medio', 'dificil'].includes(dificuldade)) {
        return res.status(400).json({
          success: false,
          message: 'Dificuldade deve ser: facil, medio ou dificil'
        });
      }

      const perguntaAtualizada = await Pergunta.update(id, { categoria_id, texto, dificuldade });
      
      res.json({
        success: true,
        data: perguntaAtualizada,
        message: 'Pergunta atualizada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/perguntas/:id - Deletar pergunta
  static async deletarPergunta(req, res) {
    try {
      const { id } = req.params;

      // Verificar se a pergunta existe
      const perguntaExistente = await Pergunta.findById(id);
      if (!perguntaExistente) {
        return res.status(404).json({
          success: false,
          message: 'Pergunta não encontrada'
        });
      }

      const perguntaDeletada = await Pergunta.delete(id);
      
      res.json({
        success: true,
        data: perguntaDeletada,
        message: 'Pergunta deletada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = PerguntaController; 