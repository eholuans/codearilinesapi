const { pool } = require('../config/database');

class Bagagem {
  /**
   * Busca uma bagagem pelo ID
   * @param {number} id - ID da bagagem
   * @returns {Promise<Object|null>} - Dados da bagagem ou null se não encontrada
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM bagagem WHERE idBagagem = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar bagagem por ID:', error);
      throw error;
    }
  }

  /**
   * Busca bagagens por passageiro
   * @param {number} idPassageiro - ID do passageiro
   * @returns {Promise<Array>} - Lista de bagagens
   */
  static async findByPassageiro(idPassageiro) {
    try {
      const [rows] = await pool.execute('SELECT * FROM bagagem WHERE idPassageiro = ?', [idPassageiro]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar bagagens por passageiro:', error);
      throw error;
    }
  }

  /**
   * Busca bagagens por voo
   * @param {number} idVoo - ID do voo
   * @returns {Promise<Array>} - Lista de bagagens
   */
  static async findByVoo(idVoo) {
    try {
      const [rows] = await pool.execute('SELECT * FROM bagagem WHERE idVoo = ?', [idVoo]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar bagagens por voo:', error);
      throw error;
    }
  }

  /**
   * Busca bagagens com informações detalhadas (incluindo passageiro e voo)
   * @param {number} id - ID da bagagem
   * @returns {Promise<Object|null>} - Bagagem com detalhes ou null se não encontrada
   */
  static async findByIdWithDetails(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT b.*, 
               p.nome as nome_passageiro, p.CPF,
               v.data_hora_partida, v.status as status_voo,
               ao.nome as aeroporto_origem, ao.código_IATA as iata_origem,
               ad.nome as aeroporto_destino, ad.código_IATA as iata_destino
        FROM bagagem b
        JOIN passageiro p ON b.idPassageiro = p.idPassageiro
        JOIN voo v ON b.idVoo = v.idVoo
        JOIN aeroporto ao ON v.idAeroportoOrigem = ao.idAeroporto
        JOIN aeroporto ad ON v.idAeroportoDestino = ad.idAeroporto
        WHERE b.idBagagem = ?
      `, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar bagagem com detalhes:', error);
      throw error;
    }
  }

  /**
   * Lista todas as bagagens
   * @returns {Promise<Array>} - Lista de bagagens
   */
  static async findAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM bagagem');
      return rows;
    } catch (error) {
      console.error('Erro ao listar bagagens:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova bagagem
   * @param {Object} bagagem - Dados da bagagem
   * @returns {Promise<Object>} - Bagagem criada com ID
   */
  static async create(bagagem) {
    try {
      const { idPassageiro, idVoo, peso, status } = bagagem;
      const [result] = await pool.execute(
        'INSERT INTO bagagem (idPassageiro, idVoo, peso, status) VALUES (?, ?, ?, ?)',
        [idPassageiro, idVoo, peso, status]
      );
      return { idBagagem: result.insertId, ...bagagem };
    } catch (error) {
      console.error('Erro ao criar bagagem:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma bagagem existente
   * @param {number} id - ID da bagagem
   * @param {Object} bagagem - Dados atualizados da bagagem
   * @returns {Promise<Object>} - Bagagem atualizada
   */
  static async update(id, bagagem) {
    try {
      const { peso, status } = bagagem;
      await pool.execute(
        'UPDATE bagagem SET peso = ?, status = ? WHERE idBagagem = ?',
        [peso, status, id]
      );
      return { idBagagem: id, ...bagagem };
    } catch (error) {
      console.error('Erro ao atualizar bagagem:', error);
      throw error;
    }
  }

  /**
   * Atualiza o status de uma bagagem
   * @param {number} id - ID da bagagem
   * @param {string} status - Novo status
   * @returns {Promise<boolean>} - true se atualizado com sucesso
   */
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE bagagem SET status = ? WHERE idBagagem = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar status da bagagem:', error);
      throw error;
    }
  }

  /**
   * Remove uma bagagem
   * @param {number} id - ID da bagagem
   * @returns {Promise<boolean>} - true se removida com sucesso
   */
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM bagagem WHERE idBagagem = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao remover bagagem:', error);
      throw error;
    }
  }
}

module.exports = Bagagem;
