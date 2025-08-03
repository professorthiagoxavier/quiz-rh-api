const pool = require('../config/database');

class Categoria {
  // Buscar todas as categorias
  static async findAll() {
    try {
      const query = 'SELECT * FROM categorias ORDER BY created_at DESC';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar categorias: ${error.message}`);
    }
  }

  // Buscar categoria por ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM categorias WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar categoria: ${error.message}`);
    }
  }

  // Criar nova categoria
  static async create(categoriaData) {
    try {
      const { nome, descricao } = categoriaData;
      const query = 'INSERT INTO categorias (nome, descricao) VALUES ($1, $2) RETURNING *';
      const result = await pool.query(query, [nome, descricao]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar categoria: ${error.message}`);
    }
  }

  // Atualizar categoria
  static async update(id, categoriaData) {
    try {
      const { nome, descricao } = categoriaData;
      const query = 'UPDATE categorias SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *';
      const result = await pool.query(query, [nome, descricao, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar categoria: ${error.message}`);
    }
  }

  // Deletar categoria
  static async delete(id) {
    try {
      const query = 'DELETE FROM categorias WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao deletar categoria: ${error.message}`);
    }
  }
}

module.exports = Categoria; 