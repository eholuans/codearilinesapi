# Documentação do Banco de Dados - Sistema Aeroporto

## Visão Geral

O banco de dados `aeroporto` foi projetado para gerenciar operações de um sistema aeroportuário, incluindo companhias aéreas, aeronaves, voos, passageiros, bagagens e outros aspectos relacionados à gestão de um aeroporto.

## Estrutura do Banco de Dados

### Schema
- **Nome**: `aeroporto`
- **Charset**: utf8mb4

## Tabelas

### 1. companhiaaerea
Armazena informações sobre as companhias aéreas que operam no aeroporto.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idCompanhia | INT(11) | Identificador único da companhia | PK, AUTO_INCREMENT |
| nome | VARCHAR(100) | Nome da companhia aérea | NOT NULL |
| código_IATA | CHAR(2) | Código IATA da companhia | NOT NULL, UNIQUE |
| país_origem | VARCHAR(100) | País de origem da companhia | NOT NULL |

### 2. aeronave
Armazena informações sobre as aeronaves utilizadas pelas companhias aéreas.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idAeronave | INT(11) | Identificador único da aeronave | PK, AUTO_INCREMENT |
| modelo | VARCHAR(50) | Modelo da aeronave | NOT NULL |
| capacidade | INT(11) | Capacidade de passageiros | NOT NULL |
| status_manutencao | VARCHAR(50) | Status de manutenção atual | NOT NULL |
| idCompanhia | INT(11) | Companhia proprietária da aeronave | FK -> companhiaaerea(idCompanhia), NOT NULL |

### 3. aeroporto
Armazena informações sobre os aeroportos.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idAeroporto | INT(11) | Identificador único do aeroporto | PK, AUTO_INCREMENT |
| nome | VARCHAR(100) | Nome do aeroporto | NOT NULL |
| cidade | VARCHAR(100) | Cidade onde está localizado | NOT NULL |
| país | VARCHAR(100) | País onde está localizado | NOT NULL |
| código_IATA | CHAR(3) | Código IATA do aeroporto | NOT NULL, UNIQUE |
| código_ICAO | CHAR(4) | Código ICAO do aeroporto | NOT NULL, UNIQUE |

### 4. passageiro
Armazena informações sobre os passageiros.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idPassageiro | INT(11) | Identificador único do passageiro | PK, AUTO_INCREMENT |
| nome | VARCHAR(100) | Nome completo do passageiro | NOT NULL |
| CPF | CHAR(11) | CPF do passageiro | NOT NULL, UNIQUE |
| passaporte | VARCHAR(15) | Número do passaporte | NULL |
| telefone | VARCHAR(20) | Número de telefone | NULL |
| email | VARCHAR(100) | Endereço de email | NOT NULL, UNIQUE |

### 5. voo
Armazena informações sobre os voos.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idVoo | INT(11) | Identificador único do voo | PK, AUTO_INCREMENT |
| idAeroportoOrigem | INT(11) | Aeroporto de origem | FK -> aeroporto(idAeroporto), NOT NULL |
| idAeroportoDestino | INT(11) | Aeroporto de destino | FK -> aeroporto(idAeroporto), NOT NULL |
| idAeronave | INT(11) | Aeronave utilizada | FK -> aeronave(idAeronave), NOT NULL |
| data_hora_partida | DATETIME | Data e hora de partida | NOT NULL |
| data_hora_chegada | DATETIME | Data e hora de chegada | NOT NULL |
| status | VARCHAR(50) | Status atual do voo | NOT NULL |

### 6. bagagem
Armazena informações sobre as bagagens dos passageiros.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idBagagem | INT(11) | Identificador único da bagagem | PK, AUTO_INCREMENT |
| idPassageiro | INT(11) | Passageiro proprietário | FK -> passageiro(idPassageiro), NOT NULL |
| idVoo | INT(11) | Voo associado à bagagem | FK -> voo(idVoo), NOT NULL |
| peso | DECIMAL(5,2) | Peso da bagagem em kg | NOT NULL |
| status | VARCHAR(50) | Status atual da bagagem | NOT NULL |

### 7. bilhete
Armazena informações sobre os bilhetes de voo.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idBilhete | INT(11) | Identificador único do bilhete | PK, AUTO_INCREMENT |
| idPassageiro | INT(11) | Passageiro associado | FK -> passageiro(idPassageiro), NOT NULL |
| idVoo | INT(11) | Voo associado | FK -> voo(idVoo), NOT NULL |
| classe | VARCHAR(45) | Classe do bilhete | NOT NULL |
| assento | VARCHAR(5) | Número do assento | NOT NULL |
| status_pagamento | TINYINT(4) | Status do pagamento | NULL |

### 8. checkinembarque
Armazena informações sobre check-in e embarque dos passageiros.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idCheckin | INT(11) | Identificador único do check-in | PK, AUTO_INCREMENT |
| idPassageiro | INT(11) | Passageiro associado | FK -> passageiro(idPassageiro), NOT NULL |
| idVoo | INT(11) | Voo associado | FK -> voo(idVoo), NOT NULL |
| data_hora_checkin | DATETIME | Data e hora do check-in | NOT NULL |
| status_embarque | VARCHAR(50) | Status do embarque | NOT NULL |

### 9. tripulacao
Armazena informações sobre os tripulantes.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idTripulante | INT(11) | Identificador único do tripulante | PK, AUTO_INCREMENT |
| nome | VARCHAR(100) | Nome do tripulante | NOT NULL |
| funcao | VARCHAR(50) | Função do tripulante | NOT NULL |
| horas_voo | INT(11) | Total de horas de voo | NOT NULL |

### 10. escala_tripulacao
Armazena informações sobre a escala de tripulação para cada voo.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idVoo | INT(11) | Voo associado | PK, FK -> voo(idVoo) |
| idTripulante | INT(11) | Tripulante associado | PK, FK -> tripulacao(idTripulante) |
| funcao | VARCHAR(50) | Função do tripulante no voo | NOT NULL |

### 11. historicoatrasos
Armazena informações sobre atrasos de voos.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idHistorico | INT(11) | Identificador único do registro | PK, AUTO_INCREMENT |
| idVoo | INT(11) | Voo associado | FK -> voo(idVoo), NOT NULL |
| motivo | VARCHAR(255) | Motivo do atraso | NOT NULL |
| tempo_atraso_min | INT(11) | Tempo de atraso em minutos | NOT NULL |
| tipo_ocorrencia | VARCHAR(100) | Tipo de ocorrência | NOT NULL |

### 12. manutencao
Armazena informações sobre manutenções de aeronaves.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idManutencao | INT(11) | Identificador único da manutenção | PK, AUTO_INCREMENT |
| idAeronave | INT(11) | Aeronave associada | FK -> aeronave(idAeronave), NOT NULL |
| data | DATE | Data da manutenção | NOT NULL |
| descricao | TEXT | Descrição da manutenção | NOT NULL |
| status | VARCHAR(50) | Status da manutenção | NOT NULL |

### 13. taxasaeroportuarias
Armazena informações sobre taxas aeroportuárias.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| idTaxa | INT(11) | Identificador único da taxa | PK, AUTO_INCREMENT |
| idAeroporto | INT(11) | Aeroporto associado | FK -> aeroporto(idAeroporto), NOT NULL |
| descricao | VARCHAR(100) | Descrição da taxa | NOT NULL |
| valor | DECIMAL(10,2) | Valor da taxa | NOT NULL |
| tipo_taxa | VARCHAR(50) | Tipo da taxa | NOT NULL |

## Relacionamentos

1. **aeronave** -> **companhiaaerea**: Uma companhia aérea pode ter várias aeronaves
2. **voo** -> **aeroporto** (origem): Um aeroporto pode ser origem de vários voos
3. **voo** -> **aeroporto** (destino): Um aeroporto pode ser destino de vários voos
4. **voo** -> **aeronave**: Uma aeronave pode realizar vários voos
5. **bagagem** -> **passageiro**: Um passageiro pode ter várias bagagens
6. **bagagem** -> **voo**: Um voo pode transportar várias bagagens
7. **bilhete** -> **passageiro**: Um passageiro pode ter vários bilhetes
8. **bilhete** -> **voo**: Um voo pode ter vários bilhetes
9. **checkinembarque** -> **passageiro**: Um passageiro pode fazer vários check-ins
10. **checkinembarque** -> **voo**: Um voo pode ter vários check-ins
11. **escala_tripulacao** -> **voo**: Um voo pode ter vários tripulantes
12. **escala_tripulacao** -> **tripulacao**: Um tripulante pode estar em vários voos
13. **historicoatrasos** -> **voo**: Um voo pode ter vários registros de atrasos
14. **manutencao** -> **aeronave**: Uma aeronave pode ter vários registros de manutenção
15. **taxasaeroportuarias** -> **aeroporto**: Um aeroporto pode ter várias taxas

## Integração com o Sistema Node.js/Express

Para integrar este banco de dados com o sistema Node.js/Express que estamos desenvolvendo, será necessário:

1. **Configuração da Conexão**: Utilizar o módulo `mysql2` já instalado para estabelecer conexão com o banco de dados.

2. **Modelos de Dados**: Criar modelos para cada tabela, representando sua estrutura e relacionamentos.

3. **Rotas e Controladores**: Implementar rotas e controladores para operações CRUD em cada entidade.

4. **Validação de Dados**: Garantir que os dados enviados pelo frontend atendam às restrições do banco de dados.

5. **Consultas Específicas**: Desenvolver consultas SQL específicas para as funcionalidades do sistema de etiquetas de bagagem.

### Exemplo de Configuração de Conexão

```javascript
// config/database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aeroporto',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### Exemplo de Modelo para Bagagem

```javascript
// models/bagagem.js
const db = require('../config/database');

class Bagagem {
  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM bagagem WHERE idBagagem = ?', [id]);
    return rows[0];
  }

  static async findByPassageiro(idPassageiro) {
    const [rows] = await db.execute('SELECT * FROM bagagem WHERE idPassageiro = ?', [idPassageiro]);
    return rows;
  }

  static async create(bagagem) {
    const { idPassageiro, idVoo, peso, status } = bagagem;
    const [result] = await db.execute(
      'INSERT INTO bagagem (idPassageiro, idVoo, peso, status) VALUES (?, ?, ?, ?)',
      [idPassageiro, idVoo, peso, status]
    );
    return { id: result.insertId, ...bagagem };
  }

  static async update(id, bagagem) {
    const { peso, status } = bagagem;
    await db.execute(
      'UPDATE bagagem SET peso = ?, status = ? WHERE idBagagem = ?',
      [peso, status, id]
    );
    return { id, ...bagagem };
  }
}

module.exports = Bagagem;
```

Este documento servirá como referência para a integração do banco de dados com o sistema de etiquetas de bagagem que estamos desenvolvendo.
