const pool = require('../config/database');

class Usuario {
  // Buscar todos os usuários
  static async findAll() {
    try {
      const query = 'SELECT * FROM usuarios ORDER BY created_at DESC';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
  }

  // Buscar usuário por ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM usuarios WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM usuarios WHERE email = $1';
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }

  // Criar novo usuário
  static async create(usuarioData) {
    try {
      const { nome, email } = usuarioData;
      const query = 'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *';
      const result = await pool.query(query, [nome, email]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  // Atualizar usuário
  static async update(id, usuarioData) {
    try {
      const { nome, email } = usuarioData;
      const query = 'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING *';
      const result = await pool.query(query, [nome, email, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  // Deletar usuário
  static async delete(id) {
    try {
      const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }

  // Buscar resultados de quiz de um usuário
  static async getResultadosQuiz(usuarioId) {
    try {
      const query = `
        SELECT rq.*, u.nome as usuario_nome 
        FROM resultados_quiz rq 
        LEFT JOIN usuarios u ON rq.usuario_id = u.id 
        WHERE rq.usuario_id = $1 
        ORDER BY rq.data_quiz DESC
      `;
      const result = await pool.query(query, [usuarioId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar resultados do usuário: ${error.message}`);
    }
  }
}

module.exports = Usuario; 