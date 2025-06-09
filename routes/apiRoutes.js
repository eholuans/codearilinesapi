
const Passageiro = require('../models/Passageiro');
const Voo = require('../models/Voo');
const Bilhete = require('../models/Bilhete');
const Bagagem = require('../models/Bagagem');

const buscarPassageiro = async (req, res) => {
  try {
    const tipo = req.query.tipo || req.body.tipo || 'reserva';
    const codigo = req.body.codigo;
    
    console.log('Tipo de busca:', tipo);
    console.log('Código fornecido:', codigo);
    
    if (!codigo) {
      return res.status(400).json({ erro: 'Código não fornecido' });
    }
    
    let passageiro = null;
    let voo = null;
    let bilhete = null;
    
    switch(tipo) {
      case 'documento':
        console.log('Realizando busca por CPF:', codigo);
        passageiro = await Passageiro.findByCPF(codigo);
        console.log('Resultado da busca por CPF:', passageiro);
        
        if (passageiro) {
          const bilhetes = await Bilhete.findByPassageiro(passageiro.idPassageiro);
          console.log('Bilhetes encontrados:', bilhetes ? bilhetes.length : 0);
          if (bilhetes && bilhetes.length > 0) {
            // Ordena por ID decrescente para pegar o mais recente
            bilhetes.sort((a, b) => b.idBilhete - a.idBilhete);
            bilhete = await Bilhete.findByIdWithDetails(bilhetes[0].idBilhete);
            voo = await Voo.findById(bilhete.idVoo);
          }
        }
        break;
        
      case 'reserva':
      case 'compra':
      case 'eticket':
        bilhete = await Bilhete.findByIdWithDetails(codigo);
        if (bilhete) {
          passageiro = await Passageiro.findById(bilhete.idPassageiro);
          voo = await Voo.findById(bilhete.idVoo);
        }
        break;
        
      default:
        return res.status(400).json({ erro: 'Tipo de busca inválido' });
    }
    
    if (!passageiro) {
      return res.status(404).json({ erro: 'Passageiro não encontrado' });
    }
    
    let bagagens = [];
    if (voo) {
      bagagens = await Bagagem.findByPassageiro(passageiro.idPassageiro);
    }
    
    res.json({
      passageiro,
      voo,
      bilhete,
      bagagens
    });
    
  } catch (error) {
    console.error('Erro ao buscar passageiro:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

const registrarBagagem = async (req, res) => {
  try {
    const { idPassageiro, idVoo, peso } = req.body;
    
    if (!idPassageiro || !idVoo || !peso) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }
    
    const passageiro = await Passageiro.findById(idPassageiro);
    const voo = await Voo.findById(idVoo);
    
    if (!passageiro) {
      return res.status(404).json({ erro: 'Passageiro não encontrado' });
    }
    
    if (!voo) {
      return res.status(404).json({ erro: 'Voo não encontrado' });
    }
    
    const novaBagagem = await Bagagem.create({
      idPassageiro,
      idVoo,
      peso,
      status: 'Registrada'
    });
    
    res.status(201).json(novaBagagem);
    
  } catch (error) {
    console.error('Erro ao registrar bagagem:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

const atualizarStatusBagagem = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ erro: 'Status não fornecido' });
    }
    
    const bagagem = await Bagagem.findById(id);
    
    if (!bagagem) {
      return res.status(404).json({ erro: 'Bagagem não encontrada' });
    }
    
    const atualizado = await Bagagem.updateStatus(id, status);
    
    if (!atualizado) {
      return res.status(500).json({ erro: 'Falha ao atualizar status' });
    }
    
    res.json({ mensagem: 'Status atualizado com sucesso' });
    
  } catch (error) {
    console.error('Erro ao atualizar status da bagagem:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

const listarVoos = async (req, res) => {
  try {
    const voos = await Voo.findAllWithDetails();
    res.json(voos);
  } catch (error) {
    console.error('Erro ao listar voos:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

module.exports = {
  buscarPassageiro,
  registrarBagagem,
  atualizarStatusBagagem,
  listarVoos
};
