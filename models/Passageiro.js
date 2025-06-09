const { pool } = require('../config/database');

class Passageiro {
  /**
   * Busca um passageiro pelo ID
   * @param {number} id - ID do passageiro
   * @returns {Promise<Object|null>} - Dados do passageiro ou null se não encontrado
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM passageiro WHERE idPassageiro = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar passageiro por ID:', error);
      throw error;
    }
  }

  /**
   * Busca um passageiro pelo CPF
   * @param {string} cpf - CPF do passageiro
   * @returns {Promise<Object|null>} - Dados do passageiro ou null se não encontrado
   */
  static async findByCPF(cpf) {
    try {
      console.log('Model Passageiro - Executando findByCPF com CPF:', cpf);
      // Garantir que a busca é feita explicitamente pela coluna CPF
      const query = 'SELECT * FROM passageiro WHERE CPF = ?';
      console.log('Query SQL:', query, 'Parâmetro:', cpf);
      
      const [rows] = await pool.execute(query, [cpf]);
      console.log('Resultado da busca por CPF:', rows.length ? 'Encontrado' : 'Não encontrado');
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar passageiro por CPF:', error);
      throw error;
    }
  }

  /**
   * Busca um passageiro pelo email
   * @param {string} email - Email do passageiro
   * @returns {Promise<Object|null>} - Dados do passageiro ou null se não encontrado
   */
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute('SELECT * FROM passageiro WHERE email = ?', [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar passageiro por email:', error);
      throw error;
    }
  }

  /**
   * Lista todos os passageiros
   * @returns {Promise<Array>} - Lista de passageiros
   */
  static async findAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM passageiro');
      return rows;
    } catch (error) {
      console.error('Erro ao listar passageiros:', error);
      throw error;
    }
  }

  /**
   * Cria um novo passageiro
   * @param {Object} passageiro - Dados do passageiro
   * @returns {Promise<Object>} - Passageiro criado com ID
   */
  static async create(passageiro) {
    try {
      const { nome, CPF, passaporte, telefone, email } = passageiro;
      const [result] = await pool.execute(
        'INSERT INTO passageiro (nome, CPF, passaporte, telefone, email) VALUES (?, ?, ?, ?, ?)',
        [nome, CPF, passaporte, telefone, email]
      );
      return { idPassageiro: result.insertId, ...passageiro };
    } catch (error) {
      console.error('Erro ao criar passageiro:', error);
      throw error;
    }
  }

  /**
   * Atualiza um passageiro existente
   * @param {number} id - ID do passageiro
   * @param {Object} passageiro - Dados atualizados do passageiro
   * @returns {Promise<Object>} - Passageiro atualizado
   */
  static async update(id, passageiro) {
    try {
      const { nome, passaporte, telefone, email } = passageiro;
      await pool.execute(
        'UPDATE passageiro SET nome = ?, passaporte = ?, telefone = ?, email = ? WHERE idPassageiro = ?',
        [nome, passaporte, telefone, email, id]
      );
      return { idPassageiro: id, ...passageiro };
    } catch (error) {
      console.error('Erro ao atualizar passageiro:', error);
      throw error;
    }
  }

  /**
   * Remove um passageiro
   * @param {number} id - ID do passageiro
   * @returns {Promise<boolean>} - true se removido com sucesso
   */
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM passageiro WHERE idPassageiro = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao remover passageiro:', error);
      throw error;
    }
  }
}

module.exports = Passageiro;
