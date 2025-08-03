const ResultadoQuiz = require('../models/ResultadoQuiz');

class ResultadoQuizController {
  // GET /api/resultados - Listar todos os resultados
  static async listarResultados(req, res) {
    try {
      const resultados = await ResultadoQuiz.findAll();
      res.json({
        success: true,
        data: resultados,
        message: 'Resultados listados com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/resultados/:id - Buscar resultado por ID
  static async buscarResultado(req, res) {
    try {
      const { id } = req.params;
      const resultado = await ResultadoQuiz.findById(id);
      
      if (!resultado) {
        return res.status(404).json({
          success: false,
          message: 'Resultado não encontrado'
        });
      }

      res.json({
        success: true,
        data: resultado,
        message: 'Resultado encontrado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/resultados/usuario/:usuarioId - Buscar resultados por usuário
  static async buscarPorUsuario(req, res) {
    try {
      const { usuarioId } = req.params;
      const resultados = await ResultadoQuiz.findByUsuario(usuarioId);
      
      res.json({
        success: true,
        data: resultados,
        message: 'Resultados do usuário listados com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/resultados/top-scores - Buscar melhores pontuações
  static async buscarTopScores(req, res) {
    try {
      const { limit = 10 } = req.query;
      const resultados = await ResultadoQuiz.findTopScores(parseInt(limit));
      
      res.json({
        success: true,
        data: resultados,
        message: 'Melhores pontuações listadas com sucesso'
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
   * /api/resultados/estatisticas:
   *   get:
   *     summary: Retorna estatísticas gerais dos resultados
   *     description: Calcula e retorna estatísticas como média, maior e menor pontuação
   *     tags: [Resultados]
   *     responses:
   *       200:
   *         description: Estatísticas calculadas com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     total_resultados:
   *                       type: integer
   *                       description: Total de resultados
   *                       example: 25
   *                     media_pontuacao:
   *                       type: number
   *                       format: float
   *                       description: Média das pontuações
   *                       example: 7.2
   *                     maior_pontuacao:
   *                       type: integer
   *                       description: Maior pontuação
   *                       example: 10
   *                     menor_pontuacao:
   *                       type: integer
   *                       description: Menor pontuação
   *                       example: 3
   *                     total_usuarios:
   *                       type: integer
   *                       description: Total de usuários únicos
   *                       example: 15
   *                 message:
   *                   type: string
   *                   example: Estatísticas calculadas com sucesso
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  static async buscarEstatisticas(req, res) {
    try {
      const estatisticas = await ResultadoQuiz.getEstatisticas();
      
      res.json({
        success: true,
        data: estatisticas,
        message: 'Estatísticas calculadas com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/resultados - Criar novo resultado
  static async criarResultado(req, res) {
    try {
      const { usuario_id, pontuacao, total_perguntas } = req.body;

      // Validação básica
      if (!usuario_id) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório'
        });
      }

      if (pontuacao === undefined || pontuacao === null) {
        return res.status(400).json({
          success: false,
          message: 'Pontuação é obrigatória'
        });
      }

      if (!total_perguntas) {
        return res.status(400).json({
          success: false,
          message: 'Total de perguntas é obrigatório'
        });
      }

      // Validar se a pontuação não é maior que o total de perguntas
      if (pontuacao > total_perguntas) {
        return res.status(400).json({
          success: false,
          message: 'Pontuação não pode ser maior que o total de perguntas'
        });
      }

      const novoResultado = await ResultadoQuiz.create({ usuario_id, pontuacao, total_perguntas });
      
      res.status(201).json({
        success: true,
        data: novoResultado,
        message: 'Resultado criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/resultados/:id - Atualizar resultado
  static async atualizarResultado(req, res) {
    try {
      const { id } = req.params;
      const { usuario_id, pontuacao, total_perguntas } = req.body;

      // Verificar se o resultado existe
      const resultadoExistente = await ResultadoQuiz.findById(id);
      if (!resultadoExistente) {
        return res.status(404).json({
          success: false,
          message: 'Resultado não encontrado'
        });
      }

      // Validação básica
      if (pontuacao === undefined || pontuacao === null) {
        return res.status(400).json({
          success: false,
          message: 'Pontuação é obrigatória'
        });
      }

      if (!total_perguntas) {
        return res.status(400).json({
          success: false,
          message: 'Total de perguntas é obrigatório'
        });
      }

      // Validar se a pontuação não é maior que o total de perguntas
      if (pontuacao > total_perguntas) {
        return res.status(400).json({
          success: false,
          message: 'Pontuação não pode ser maior que o total de perguntas'
        });
      }

      const resultadoAtualizado = await ResultadoQuiz.update(id, { usuario_id, pontuacao, total_perguntas });
      
      res.json({
        success: true,
        data: resultadoAtualizado,
        message: 'Resultado atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/resultados/:id - Deletar resultado
  static async deletarResultado(req, res) {
    try {
      const { id } = req.params;

      // Verificar se o resultado existe
      const resultadoExistente = await ResultadoQuiz.findById(id);
      if (!resultadoExistente) {
        return res.status(404).json({
          success: false,
          message: 'Resultado não encontrado'
        });
      }

      const resultadoDeletado = await ResultadoQuiz.delete(id);
      
      res.json({
        success: true,
        data: resultadoDeletado,
        message: 'Resultado deletado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/resultados/usuario/:usuarioId - Deletar todos os resultados de um usuário
  static async deletarPorUsuario(req, res) {
    try {
      const { usuarioId } = req.params;
      const resultadosDeletados = await ResultadoQuiz.deleteByUsuario(usuarioId);
      
      res.json({
        success: true,
        data: resultadosDeletados,
        message: 'Resultados do usuário deletados com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ResultadoQuizController; 