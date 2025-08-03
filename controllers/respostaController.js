const Resposta = require('../models/Resposta');

class RespostaController {
  // GET /api/respostas - Listar todas as respostas
  static async listarRespostas(req, res) {
    try {
      const respostas = await Resposta.findAll();
      res.json({
        success: true,
        data: respostas,
        message: 'Respostas listadas com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/respostas/:id - Buscar resposta por ID
  static async buscarResposta(req, res) {
    try {
      const { id } = req.params;
      const resposta = await Resposta.findById(id);
      
      if (!resposta) {
        return res.status(404).json({
          success: false,
          message: 'Resposta não encontrada'
        });
      }

      res.json({
        success: true,
        data: resposta,
        message: 'Resposta encontrada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/respostas/pergunta/:perguntaId - Buscar respostas por pergunta
  static async buscarPorPergunta(req, res) {
    try {
      const { perguntaId } = req.params;
      const respostas = await Resposta.findByPergunta(perguntaId);
      
      res.json({
        success: true,
        data: respostas,
        message: 'Respostas da pergunta listadas com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/respostas/pergunta/:perguntaId/correta - Buscar resposta correta da pergunta
  static async buscarRespostaCorreta(req, res) {
    try {
      const { perguntaId } = req.params;
      const resposta = await Resposta.findCorretaByPergunta(perguntaId);
      
      if (!resposta) {
        return res.status(404).json({
          success: false,
          message: 'Resposta correta não encontrada'
        });
      }

      res.json({
        success: true,
        data: resposta,
        message: 'Resposta correta encontrada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/respostas - Criar nova resposta
  static async criarResposta(req, res) {
    try {
      const { pergunta_id, texto, correta } = req.body;

      // Validação básica
      if (!pergunta_id) {
        return res.status(400).json({
          success: false,
          message: 'ID da pergunta é obrigatório'
        });
      }

      if (!texto) {
        return res.status(400).json({
          success: false,
          message: 'Texto da resposta é obrigatório'
        });
      }

      const novaResposta = await Resposta.create({ pergunta_id, texto, correta });
      
      res.status(201).json({
        success: true,
        data: novaResposta,
        message: 'Resposta criada com sucesso'
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
   * /api/respostas/multiple:
   *   post:
   *     summary: Cria múltiplas respostas para uma pergunta
   *     description: Cria várias respostas para uma pergunta específica
   *     tags: [Respostas]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               pergunta_id:
   *                 type: integer
   *                 description: ID da pergunta
   *                 example: 1
   *               respostas:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     texto:
   *                       type: string
   *                       description: Texto da resposta
   *                       example: Gerenciar pessoas
   *                     correta:
   *                       type: boolean
   *                       description: Se a resposta está correta
   *                       example: true
   *                   required:
   *                     - texto
   *             required:
   *               - pergunta_id
   *               - respostas
   *     responses:
   *       201:
   *         description: Respostas criadas com sucesso
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
   *                     $ref: '#/components/schemas/Resposta'
   *                 message:
   *                   type: string
   *                   example: Respostas criadas com sucesso
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  static async criarMultiplasRespostas(req, res) {
    try {
      const { pergunta_id, respostas } = req.body;

      // Validação básica
      if (!pergunta_id) {
        return res.status(400).json({
          success: false,
          message: 'ID da pergunta é obrigatório'
        });
      }

      if (!respostas || !Array.isArray(respostas) || respostas.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Lista de respostas é obrigatória'
        });
      }

      // Validar cada resposta
      for (const resposta of respostas) {
        if (!resposta.texto) {
          return res.status(400).json({
            success: false,
            message: 'Texto da resposta é obrigatório'
          });
        }
      }

      const novasRespostas = await Resposta.createMultiple(pergunta_id, respostas);
      
      res.status(201).json({
        success: true,
        data: novasRespostas,
        message: 'Respostas criadas com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/respostas/:id - Atualizar resposta
  static async atualizarResposta(req, res) {
    try {
      const { id } = req.params;
      const { pergunta_id, texto, correta } = req.body;

      // Verificar se a resposta existe
      const respostaExistente = await Resposta.findById(id);
      if (!respostaExistente) {
        return res.status(404).json({
          success: false,
          message: 'Resposta não encontrada'
        });
      }

      // Validação básica
      if (!texto) {
        return res.status(400).json({
          success: false,
          message: 'Texto da resposta é obrigatório'
        });
      }

      const respostaAtualizada = await Resposta.update(id, { pergunta_id, texto, correta });
      
      res.json({
        success: true,
        data: respostaAtualizada,
        message: 'Resposta atualizada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/respostas/:id - Deletar resposta
  static async deletarResposta(req, res) {
    try {
      const { id } = req.params;

      // Verificar se a resposta existe
      const respostaExistente = await Resposta.findById(id);
      if (!respostaExistente) {
        return res.status(404).json({
          success: false,
          message: 'Resposta não encontrada'
        });
      }

      const respostaDeletada = await Resposta.delete(id);
      
      res.json({
        success: true,
        data: respostaDeletada,
        message: 'Resposta deletada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/respostas/pergunta/:perguntaId - Deletar todas as respostas de uma pergunta
  static async deletarPorPergunta(req, res) {
    try {
      const { perguntaId } = req.params;
      const respostasDeletadas = await Resposta.deleteByPergunta(perguntaId);
      
      res.json({
        success: true,
        data: respostasDeletadas,
        message: 'Respostas da pergunta deletadas com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = RespostaController; 