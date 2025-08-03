const pool = require('../config/database');

class Resposta {
  // Buscar todas as respostas
  static async findAll() {
    try {
      const query = `
        SELECT r.*, p.texto as pergunta_texto 
        FROM respostas r 
        LEFT JOIN perguntas p ON r.pergunta_id = p.id 
        ORDER BY r.id
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar respostas: ${error.message}`);
    }
  }

  // Buscar resposta por ID
  static async findById(id) {
    try {
      const query = `
        SELECT r.*, p.texto as pergunta_texto 
        FROM respostas r 
        LEFT JOIN perguntas p ON r.pergunta_id = p.id 
        WHERE r.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar resposta: ${error.message}`);
    }
  }

  // Buscar respostas por pergunta
  static async findByPergunta(perguntaId) {
    try {
      const query = `
        SELECT r.*, p.texto as pergunta_texto 
        FROM respostas r 
        LEFT JOIN perguntas p ON r.pergunta_id = p.id 
        WHERE r.pergunta_id = $1 
        ORDER BY r.id
      `;
      const result = await pool.query(query, [perguntaId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar respostas por pergunta: ${error.message}`);
    }
  }

  // Buscar resposta correta de uma pergunta
  static async findCorretaByPergunta(perguntaId) {
    try {
      const query = `
        SELECT r.*, p.texto as pergunta_texto 
        FROM respostas r 
        LEFT JOIN perguntas p ON r.pergunta_id = p.id 
        WHERE r.pergunta_id = $1 AND r.correta = true
      `;
      const result = await pool.query(query, [perguntaId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar resposta correta: ${error.message}`);
    }
  }

  // Criar nova resposta
  static async create(respostaData) {
    try {
      const { pergunta_id, texto, correta } = respostaData;
      const query = 'INSERT INTO respostas (pergunta_id, texto, correta) VALUES ($1, $2, $3) RETURNING *';
      const result = await pool.query(query, [pergunta_id, texto, correta]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar resposta: ${error.message}`);
    }
  }

  // Criar múltiplas respostas para uma pergunta
  static async createMultiple(perguntaId, respostas) {
    try {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        
        const createdRespostas = [];
        for (const resposta of respostas) {
          const { texto, correta } = resposta;
          const query = 'INSERT INTO respostas (pergunta_id, texto, correta) VALUES ($1, $2, $3) RETURNING *';
          const result = await client.query(query, [perguntaId, texto, correta]);
          createdRespostas.push(result.rows[0]);
        }
        
        await client.query('COMMIT');
        return createdRespostas;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      throw new Error(`Erro ao criar múltiplas respostas: ${error.message}`);
    }
  }

  // Atualizar resposta
  static async update(id, respostaData) {
    try {
      const { pergunta_id, texto, correta } = respostaData;
      const query = 'UPDATE respostas SET pergunta_id = $1, texto = $2, correta = $3 WHERE id = $4 RETURNING *';
      const result = await pool.query(query, [pergunta_id, texto, correta, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar resposta: ${error.message}`);
    }
  }

  // Deletar resposta
  static async delete(id) {
    try {
      const query = 'DELETE FROM respostas WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao deletar resposta: ${error.message}`);
    }
  }

  // Deletar todas as respostas de uma pergunta
  static async deleteByPergunta(perguntaId) {
    try {
      const query = 'DELETE FROM respostas WHERE pergunta_id = $1 RETURNING *';
      const result = await pool.query(query, [perguntaId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao deletar respostas da pergunta: ${error.message}`);
    }
  }
}

module.exports = Resposta; 