const { pool } = require('../config/database');

class Voo {
  /**
   * Busca um voo pelo ID
   * @param {number} id - ID do voo
   * @returns {Promise<Object|null>} - Dados do voo ou null se não encontrado
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM voo WHERE idVoo = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar voo por ID:', error);
      throw error;
    }
  }

  /**
   * Busca voos por aeroporto de origem
   * @param {number} idAeroporto - ID do aeroporto de origem
   * @returns {Promise<Array>} - Lista de voos
   */
  static async findByOrigin(idAeroporto) {
    try {
      const [rows] = await pool.execute('SELECT * FROM voo WHERE idAeroportoOrigem = ?', [idAeroporto]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar voos por origem:', error);
      throw error;
    }
  }

  /**
   * Busca voos por aeroporto de destino
   * @param {number} idAeroporto - ID do aeroporto de destino
   * @returns {Promise<Array>} - Lista de voos
   */
  static async findByDestination(idAeroporto) {
    try {
      const [rows] = await pool.execute('SELECT * FROM voo WHERE idAeroportoDestino = ?', [idAeroporto]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar voos por destino:', error);
      throw error;
    }
  }

  /**
   * Busca voos por data de partida
   * @param {string} data - Data de partida (YYYY-MM-DD)
   * @returns {Promise<Array>} - Lista de voos
   */
  static async findByDepartureDate(data) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM voo WHERE DATE(data_hora_partida) = ?', 
        [data]
      );
      return rows;
    } catch (error) {
      console.error('Erro ao buscar voos por data de partida:', error);
      throw error;
    }
  }

  /**
   * Busca voos com informações detalhadas (incluindo aeroportos)
   * @returns {Promise<Array>} - Lista de voos com detalhes
   */
  static async findAllWithDetails() {
    try {
      const [rows] = await pool.execute(`
        SELECT v.*, 
               ao.nome as aeroporto_origem, ao.cidade as cidade_origem, ao.país as pais_origem, ao.código_IATA as iata_origem,
               ad.nome as aeroporto_destino, ad.cidade as cidade_destino, ad.país as pais_destino, ad.código_IATA as iata_destino,
               a.modelo as modelo_aeronave, ca.nome as companhia_aerea
        FROM voo v
        JOIN aeroporto ao ON v.idAeroportoOrigem = ao.idAeroporto
        JOIN aeroporto ad ON v.idAeroportoDestino = ad.idAeroporto
        JOIN aeronave a ON v.idAeronave = a.idAeronave
        JOIN companhiaaerea ca ON a.idCompanhia = ca.idCompanhia
      `);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar voos com detalhes:', error);
      throw error;
    }
  }

  /**
   * Lista todos os voos
   * @returns {Promise<Array>} - Lista de voos
   */
  static async findAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM voo');
      return rows;
    } catch (error) {
      console.error('Erro ao listar voos:', error);
      throw error;
    }
  }

  /**
   * Cria um novo voo
   * @param {Object} voo - Dados do voo
   * @returns {Promise<Object>} - Voo criado com ID
   */
  static async create(voo) {
    try {
      const { idAeroportoOrigem, idAeroportoDestino, idAeronave, data_hora_partida, data_hora_chegada, status } = voo;
      const [result] = await pool.execute(
        'INSERT INTO voo (idAeroportoOrigem, idAeroportoDestino, idAeronave, data_hora_partida, data_hora_chegada, status) VALUES (?, ?, ?, ?, ?, ?)',
        [idAeroportoOrigem, idAeroportoDestino, idAeronave, data_hora_partida, data_hora_chegada, status]
      );
      return { idVoo: result.insertId, ...voo };
    } catch (error) {
      console.error('Erro ao criar voo:', error);
      throw error;
    }
  }

  /**
   * Atualiza um voo existente
   * @param {number} id - ID do voo
   * @param {Object} voo - Dados atualizados do voo
   * @returns {Promise<Object>} - Voo atualizado
   */
  static async update(id, voo) {
    try {
      const { data_hora_partida, data_hora_chegada, status } = voo;
      await pool.execute(
        'UPDATE voo SET data_hora_partida = ?, data_hora_chegada = ?, status = ? WHERE idVoo = ?',
        [data_hora_partida, data_hora_chegada, status, id]
      );
      return { idVoo: id, ...voo };
    } catch (error) {
      console.error('Erro ao atualizar voo:', error);
      throw error;
    }
  }

  /**
   * Atualiza o status de um voo
   * @param {number} id - ID do voo
   * @param {string} status - Novo status
   * @returns {Promise<boolean>} - true se atualizado com sucesso
   */
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE voo SET status = ? WHERE idVoo = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar status do voo:', error);
      throw error;
    }
  }

  /**
   * Remove um voo
   * @param {number} id - ID do voo
   * @returns {Promise<boolean>} - true se removido com sucesso
   */
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM voo WHERE idVoo = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao remover voo:', error);
      throw error;
    }
  }
}

module.exports = Voo;
