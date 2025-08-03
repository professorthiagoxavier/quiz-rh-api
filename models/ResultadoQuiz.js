const pool = require('../config/database');

class ResultadoQuiz {
  // Buscar todos os resultados
  static async findAll() {
    try {
      const query = `
        SELECT rq.*, u.nome as usuario_nome 
        FROM resultados_quiz rq 
        LEFT JOIN usuarios u ON rq.usuario_id = u.id 
        ORDER BY rq.data_quiz DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar resultados: ${error.message}`);
    }
  }

  // Buscar resultado por ID
  static async findById(id) {
    try {
      const query = `
        SELECT rq.*, u.nome as usuario_nome 
        FROM resultados_quiz rq 
        LEFT JOIN usuarios u ON rq.usuario_id = u.id 
        WHERE rq.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar resultado: ${error.message}`);
    }
  }

  // Buscar resultados por usuário
  static async findByUsuario(usuarioId) {
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

  // Buscar melhores pontuações
  static async findTopScores(limit = 10) {
    try {
      const query = `
        SELECT rq.*, u.nome as usuario_nome 
        FROM resultados_quiz rq 
        LEFT JOIN usuarios u ON rq.usuario_id = u.id 
        ORDER BY rq.pontuacao DESC, rq.data_quiz ASC 
        LIMIT $1
      `;
      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar melhores pontuações: ${error.message}`);
    }
  }

  // Criar novo resultado
  static async create(resultadoData) {
    try {
      const { usuario_id, pontuacao, total_perguntas } = resultadoData;
      const query = 'INSERT INTO resultados_quiz (usuario_id, pontuacao, total_perguntas) VALUES ($1, $2, $3) RETURNING *';
      const result = await pool.query(query, [usuario_id, pontuacao, total_perguntas]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar resultado: ${error.message}`);
    }
  }

  // Atualizar resultado
  static async update(id, resultadoData) {
    try {
      const { usuario_id, pontuacao, total_perguntas } = resultadoData;
      const query = 'UPDATE resultados_quiz SET usuario_id = $1, pontuacao = $2, total_perguntas = $3 WHERE id = $4 RETURNING *';
      const result = await pool.query(query, [usuario_id, pontuacao, total_perguntas, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar resultado: ${error.message}`);
    }
  }

  // Deletar resultado
  static async delete(id) {
    try {
      const query = 'DELETE FROM resultados_quiz WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao deletar resultado: ${error.message}`);
    }
  }

  // Deletar todos os resultados de um usuário
  static async deleteByUsuario(usuarioId) {
    try {
      const query = 'DELETE FROM resultados_quiz WHERE usuario_id = $1 RETURNING *';
      const result = await pool.query(query, [usuarioId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao deletar resultados do usuário: ${error.message}`);
    }
  }

  // Calcular estatísticas
  static async getEstatisticas() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_resultados,
          AVG(pontuacao) as media_pontuacao,
          MAX(pontuacao) as maior_pontuacao,
          MIN(pontuacao) as menor_pontuacao,
          COUNT(DISTINCT usuario_id) as total_usuarios
        FROM resultados_quiz
      `;
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao calcular estatísticas: ${error.message}`);
    }
  }
}

module.exports = ResultadoQuiz; 