const { pool } = require('../config/database');

class Bilhete {
  /**
   * Busca um bilhete pelo ID
   * @param {number} id - ID do bilhete
   * @returns {Promise<Object|null>} - Dados do bilhete ou null se não encontrado
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM bilhete WHERE idBilhete = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar bilhete por ID:', error);
      throw error;
    }
  }

  /**
   * Busca bilhetes por passageiro
   * @param {number} idPassageiro - ID do passageiro
   * @returns {Promise<Array>} - Lista de bilhetes
   */
  static async findByPassageiro(idPassageiro) {
    try {
      const [rows] = await pool.execute('SELECT * FROM bilhete WHERE idPassageiro = ?', [idPassageiro]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar bilhetes por passageiro:', error);
      throw error;
    }
  }

  /**
   * Busca bilhetes por voo
   * @param {number} idVoo - ID do voo
   * @returns {Promise<Array>} - Lista de bilhetes
   */
  static async findByVoo(idVoo) {
    try {
      const [rows] = await pool.execute('SELECT * FROM bilhete WHERE idVoo = ?', [idVoo]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar bilhetes por voo:', error);
      throw error;
    }
  }

  /**
   * Busca bilhetes com informações detalhadas (incluindo passageiro e voo)
   * @param {number} id - ID do bilhete
   * @returns {Promise<Object|null>} - Bilhete com detalhes ou null se não encontrado
   */
  static async findByIdWithDetails(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT b.*, 
               p.nome as nome_passageiro, p.CPF, p.email,
               v.data_hora_partida, v.data_hora_chegada, v.status as status_voo,
               ao.nome as aeroporto_origem, ao.código_IATA as iata_origem,
               ad.nome as aeroporto_destino, ad.código_IATA as iata_destino
        FROM bilhete b
        JOIN passageiro p ON b.idPassageiro = p.idPassageiro
        JOIN voo v ON b.idVoo = v.idVoo
        JOIN aeroporto ao ON v.idAeroportoOrigem = ao.idAeroporto
        JOIN aeroporto ad ON v.idAeroportoDestino = ad.idAeroporto
        WHERE b.idBilhete = ?
      `, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar bilhete com detalhes:', error);
      throw error;
    }
  }

  /**
   * Lista todos os bilhetes
   * @returns {Promise<Array>} - Lista de bilhetes
   */
  static async findAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM bilhete');
      return rows;
    } catch (error) {
      console.error('Erro ao listar bilhetes:', error);
      throw error;
    }
  }

  /**
   * Cria um novo bilhete
   * @param {Object} bilhete - Dados do bilhete
   * @returns {Promise<Object>} - Bilhete criado com ID
   */
  static async create(bilhete) {
    try {
      const { idPassageiro, idVoo, classe, assento, status_pagamento } = bilhete;
      const [result] = await pool.execute(
        'INSERT INTO bilhete (idPassageiro, idVoo, classe, assento, status_pagamento) VALUES (?, ?, ?, ?, ?)',
        [idPassageiro, idVoo, classe, assento, status_pagamento]
      );
      return { idBilhete: result.insertId, ...bilhete };
    } catch (error) {
      console.error('Erro ao criar bilhete:', error);
      throw error;
    }
  }

  /**
   * Atualiza um bilhete existente
   * @param {number} id - ID do bilhete
   * @param {Object} bilhete - Dados atualizados do bilhete
   * @returns {Promise<Object>} - Bilhete atualizado
   */
  static async update(id, bilhete) {
    try {
      const { classe, assento, status_pagamento } = bilhete;
      await pool.execute(
        'UPDATE bilhete SET classe = ?, assento = ?, status_pagamento = ? WHERE idBilhete = ?',
        [classe, assento, status_pagamento, id]
      );
      return { idBilhete: id, ...bilhete };
    } catch (error) {
      console.error('Erro ao atualizar bilhete:', error);
      throw error;
    }
  }

  /**
   * Atualiza o status de pagamento de um bilhete
   * @param {number} id - ID do bilhete
   * @param {number} status - Novo status de pagamento
   * @returns {Promise<boolean>} - true se atualizado com sucesso
   */
  static async updatePaymentStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE bilhete SET status_pagamento = ? WHERE idBilhete = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar status de pagamento do bilhete:', error);
      throw error;
    }
  }

  /**
   * Remove um bilhete
   * @param {number} id - ID do bilhete
   * @returns {Promise<boolean>} - true se removido com sucesso
   */
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM bilhete WHERE idBilhete = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao remover bilhete:', error);
      throw error;
    }
  }
}

module.exports = Bilhete;
