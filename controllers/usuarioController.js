const Usuario = require('../models/Usuario');

class UsuarioController {
  // GET /api/usuarios - Listar todos os usuários
  static async listarUsuarios(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      res.json({
        success: true,
        data: usuarios,
        message: 'Usuários listados com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/usuarios/:id - Buscar usuário por ID
  static async buscarUsuario(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findById(id);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        data: usuario,
        message: 'Usuário encontrado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/usuarios/email/:email - Buscar usuário por email
  static async buscarPorEmail(req, res) {
    try {
      const { email } = req.params;
      const usuario = await Usuario.findByEmail(email);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        data: usuario,
        message: 'Usuário encontrado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/usuarios/:id/resultados - Buscar resultados de quiz de um usuário
  static async buscarResultados(req, res) {
    try {
      const { id } = req.params;
      const resultados = await Usuario.getResultadosQuiz(id);
      
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

  // POST /api/usuarios - Criar novo usuário
  static async criarUsuario(req, res) {
    try {
      const { nome, email } = req.body;

      // Validação básica
      if (!nome) {
        return res.status(400).json({
          success: false,
          message: 'Nome do usuário é obrigatório'
        });
      }

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email do usuário é obrigatório'
        });
      }

      // Validar formato do email (básico)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de email inválido'
        });
      }

      // Verificar se o email já existe
      const usuarioExistente = await Usuario.findByEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          message: 'Email já cadastrado'
        });
      }

      const novoUsuario = await Usuario.create({ nome, email });
      
      res.status(201).json({
        success: true,
        data: novoUsuario,
        message: 'Usuário criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/usuarios/:id - Atualizar usuário
  static async atualizarUsuario(req, res) {
    try {
      const { id } = req.params;
      const { nome, email } = req.body;

      // Verificar se o usuário existe
      const usuarioExistente = await Usuario.findById(id);
      if (!usuarioExistente) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Validação básica
      if (!nome) {
        return res.status(400).json({
          success: false,
          message: 'Nome do usuário é obrigatório'
        });
      }

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email do usuário é obrigatório'
        });
      }

      // Validar formato do email (básico)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de email inválido'
        });
      }

      // Verificar se o email já existe em outro usuário
      const usuarioComEmail = await Usuario.findByEmail(email);
      if (usuarioComEmail && usuarioComEmail.id != id) {
        return res.status(400).json({
          success: false,
          message: 'Email já cadastrado por outro usuário'
        });
      }

      const usuarioAtualizado = await Usuario.update(id, { nome, email });
      
      res.json({
        success: true,
        data: usuarioAtualizado,
        message: 'Usuário atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/usuarios/:id - Deletar usuário
  static async deletarUsuario(req, res) {
    try {
      const { id } = req.params;

      // Verificar se o usuário existe
      const usuarioExistente = await Usuario.findById(id);
      if (!usuarioExistente) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const usuarioDeletado = await Usuario.delete(id);
      
      res.json({
        success: true,
        data: usuarioDeletado,
        message: 'Usuário deletado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = UsuarioController; 