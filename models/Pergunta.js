const pool = require('../config/database');

class Pergunta {
  // Buscar todas as perguntas
  static async findAll() {
    try {
      const query = `
        SELECT p.*, c.nome as categoria_nome 
        FROM perguntas p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        ORDER BY p.created_at DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar perguntas: ${error.message}`);
    }
  }

  // Buscar pergunta por ID
  static async findById(id) {
    try {
      const query = `
        SELECT p.*, c.nome as categoria_nome 
        FROM perguntas p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        WHERE p.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar pergunta: ${error.message}`);
    }
  }

  // Buscar perguntas por categoria
  static async findByCategoria(categoriaId) {
    try {
      const query = `
        SELECT p.*, c.nome as categoria_nome 
        FROM perguntas p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        WHERE p.categoria_id = $1 
        ORDER BY p.created_at DESC
      `;
      const result = await pool.query(query, [categoriaId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar perguntas por categoria: ${error.message}`);
    }
  }

  // Buscar perguntas por dificuldade
  static async findByDificuldade(dificuldade) {
    try {
      const query = `
        SELECT p.*, c.nome as categoria_nome 
        FROM perguntas p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        WHERE p.dificuldade = $1 
        ORDER BY p.created_at DESC
      `;
      const result = await pool.query(query, [dificuldade]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar perguntas por dificuldade: ${error.message}`);
    }
  }

  // Criar nova pergunta
  static async create(perguntaData) {
    try {
      const { categoria_id, texto, dificuldade } = perguntaData;
      const query = 'INSERT INTO perguntas (categoria_id, texto, dificuldade) VALUES ($1, $2, $3) RETURNING *';
      const result = await pool.query(query, [categoria_id, texto, dificuldade]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar pergunta: ${error.message}`);
    }
  }

  // Atualizar pergunta
  static async update(id, perguntaData) {
    try {
      const { categoria_id, texto, dificuldade } = perguntaData;
      const query = 'UPDATE perguntas SET categoria_id = $1, texto = $2, dificuldade = $3 WHERE id = $4 RETURNING *';
      const result = await pool.query(query, [categoria_id, texto, dificuldade, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar pergunta: ${error.message}`);
    }
  }

  // Deletar pergunta
  static async delete(id) {
    try {
      const query = 'DELETE FROM perguntas WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao deletar pergunta: ${error.message}`);
    }
  }
}

module.exports = Pergunta; 