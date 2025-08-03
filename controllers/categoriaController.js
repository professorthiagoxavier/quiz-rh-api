const Categoria = require('../models/Categoria');

class CategoriaController {
  /**
   * @swagger
   * /api/categorias:
   *   get:
   *     summary: Lista todas as categorias
   *     description: Retorna uma lista de todas as categorias cadastradas
   *     tags: [Categorias]
   *     responses:
   *       200:
   *         description: Lista de categorias retornada com sucesso
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
   *                     $ref: '#/components/schemas/Categoria'
   *                 message:
   *                   type: string
   *                   example: Categorias listadas com sucesso
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  static async listarCategorias(req, res) {
    try {
      const categorias = await Categoria.findAll();
      res.json({
        success: true,
        data: categorias,
        message: 'Categorias listadas com sucesso'
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
   * /api/categorias/{id}:
   *   get:
   *     summary: Busca uma categoria por ID
   *     description: Retorna uma categoria específica baseada no ID fornecido
   *     tags: [Categorias]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID da categoria
   *     responses:
   *       200:
   *         description: Categoria encontrada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Categoria'
   *                 message:
   *                   type: string
   *                   example: Categoria encontrada com sucesso
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  static async buscarCategoria(req, res) {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findById(id);
      
      if (!categoria) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      res.json({
        success: true,
        data: categoria,
        message: 'Categoria encontrada com sucesso'
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
   * /api/categorias:
   *   post:
   *     summary: Cria uma nova categoria
   *     description: Cria uma nova categoria no sistema
   *     tags: [Categorias]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nome:
   *                 type: string
   *                 description: Nome da categoria
   *                 example: Gestão de Pessoas
   *               descricao:
   *                 type: string
   *                 description: Descrição da categoria
   *                 example: Perguntas sobre gestão de recursos humanos
   *             required:
   *               - nome
   *     responses:
   *       201:
   *         description: Categoria criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Categoria'
   *                 message:
   *                   type: string
   *                   example: Categoria criada com sucesso
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  static async criarCategoria(req, res) {
    try {
      const { nome, descricao } = req.body;

      // Validação básica
      if (!nome) {
        return res.status(400).json({
          success: false,
          message: 'Nome da categoria é obrigatório'
        });
      }

      const novaCategoria = await Categoria.create({ nome, descricao });
      
      res.status(201).json({
        success: true,
        data: novaCategoria,
        message: 'Categoria criada com sucesso'
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
   * /api/categorias/{id}:
   *   put:
   *     summary: Atualiza uma categoria existente
   *     description: Atualiza os dados de uma categoria específica
   *     tags: [Categorias]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID da categoria
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nome:
   *                 type: string
   *                 description: Nome da categoria
   *                 example: Gestão de Pessoas Atualizada
   *               descricao:
   *                 type: string
   *                 description: Descrição da categoria
   *                 example: Descrição atualizada
   *             required:
   *               - nome
   *     responses:
   *       200:
   *         description: Categoria atualizada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Categoria'
   *                 message:
   *                   type: string
   *                   example: Categoria atualizada com sucesso
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  static async atualizarCategoria(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      // Verificar se a categoria existe
      const categoriaExistente = await Categoria.findById(id);
      if (!categoriaExistente) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      // Validação básica
      if (!nome) {
        return res.status(400).json({
          success: false,
          message: 'Nome da categoria é obrigatório'
        });
      }

      const categoriaAtualizada = await Categoria.update(id, { nome, descricao });
      
      res.json({
        success: true,
        data: categoriaAtualizada,
        message: 'Categoria atualizada com sucesso'
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
   * /api/categorias/{id}:
   *   delete:
   *     summary: Remove uma categoria
   *     description: Remove uma categoria específica do sistema
   *     tags: [Categorias]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID da categoria
   *     responses:
   *       200:
   *         description: Categoria removida com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Categoria'
   *                 message:
   *                   type: string
   *                   example: Categoria deletada com sucesso
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  static async deletarCategoria(req, res) {
    try {
      const { id } = req.params;

      // Verificar se a categoria existe
      const categoriaExistente = await Categoria.findById(id);
      if (!categoriaExistente) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      const categoriaDeletada = await Categoria.delete(id);
      
      res.json({
        success: true,
        data: categoriaDeletada,
        message: 'Categoria deletada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = CategoriaController; 