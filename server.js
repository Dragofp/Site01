// Importando as bibliotecas necessárias
const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Inicializando o Express e configurando o middleware
const app = express();
app.use(cors());
app.use(express.json());

// Configurando a conexão com o banco de dados
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pass',
  database: 'b1',
  connectionLimit: 10,
  queueLimit: 0
});

// Variável para armazenar o usuário logado
let usuarioLogado = null;
let administrador = null;
// Rota para registrar um novo usuário
app.post('/registrar', async (req, res) => {
  let { nome, senha, profissional } = req.body;

  // Verificando se o nome e a senha têm mais de 4 caracteres
  if (nome.length <= 3 || senha.length <= 3) {
    return res.status(400).json({ error: 'Nome e senha precisam ter mais de 4 caracteres' });
  }

  // Criptografando a senha
  const salt = await bcrypt.genSalt(10);
  const hashedSenha = await bcrypt.hash(senha, salt);

  // Verificando se o nome já está registrado
  try {
    const [coluna] = await pool.query('SELECT * FROM usuarios WHERE nome = ?', [nome]);
    if (coluna.length > 0) {
      return res.status(400).json({ error: 'Nome já registrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar no banco de dados' });
  }

  // Inserindo o novo usuário no banco de dados
  try {
    const [coluna] = await pool.query('INSERT INTO usuarios (nome, senha, profissional) VALUES (?, ?, ?)', [nome, hashedSenha, profissional]);
    res.json({ id: coluna.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao inserir no banco de dados' });
  }
});

// Rota para login do usuário
app.post('/login', async (req, res) => {
  let { nome, senha } = req.body;

  // Verificando se o usuário existe
  try {
    const [coluna] = await pool.query('SELECT * FROM usuarios WHERE nome = ?', [nome]);
    if (coluna.length === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const usuario = coluna[0];

    // Verificando se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    const [resultado] = await pool.query('SELECT profissional FROM usuarios WHERE nome = ?', [nome]);
    administrador = resultado[0].profissional;

    usuarioLogado = usuario.nome;

    res.json({ profissional: usuario.profissional, nome: usuario.nome});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Rota para obter o usuário logado
app.get('/usuario', (req, res) => {
  if (usuarioLogado) {
    res.json({ nome: usuarioLogado, profissional: administrador });
  } else {
    res.status(400).json({ error: 'Nenhum usuário está logado' });
  }
});

// Rota para adicionar um horário
app.post('/addhora', async (req, res) => {
  let { pessoa, dia, horario } = req.body;

  // Verificando o formato da data
  if (!dia || dia.split('/').length !== 3) {
    return res.status(400).json({ success: false, message: 'Formato de data inválido. Use o formato DD/MM/AAAA.' });
  }

  // Formatando a data
  let partes = dia.split('/');
  let diaFormatado = `${partes[2]}-${partes[1]}-${partes[0]}`;

  // Verificando se o horário já foi usado no mesmo dia
  try {
    const [horariosPostos] = await pool.query('SELECT Horario FROM horarios WHERE Horario = ? AND Dia = ?', [horario, diaFormatado]);
    if (horariosPostos.length > 0) {
      return res.status(400).json({ success: false, message: 'Horário já usado neste dia' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro ao verificar o horário no banco de dados' });
  }

  // Adicionando o horário ao banco de dados
  try {
    const [rows] = await pool.execute(
      'INSERT INTO horarios (Pessoa, Dia, Horario) VALUES (?, ?, ?)',
      [pessoa, diaFormatado, horario]
    );

    res.json({ success: true, message: 'Horário adicionado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao adicionar horário' });
  }
});

// Rota para remover um horário
app.post('/removerhora', async (req, res) => {
  let { pessoa, dia, horario } = req.body;

  // Verificando o formato da data
  if (!dia || dia.split('/').length !== 3) {
    return res.status(400).json({ success: false, message: 'Formato de data inválido. Use o formato DD/MM/AAAA.' });
  }

  // Formatando a data
  let partes = dia.split('/');
  let diaFormatado = `${partes[2]}-${partes[1]}-${partes[0]}`;

  // Verificando se o horário já foi usado no mesmo dia
  try {
    const [horariosPostos] = await pool.query('SELECT Horario FROM horarios WHERE Horario = ? AND Dia = ?', [horario, diaFormatado]);
    if (horariosPostos.length == 0) {
      return res.status(400).json({ success: false, message: 'Horário nao existe' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro ao verificar o horário no banco de dados' });
  }

  // Adicionando o horário ao banco de dados
  try {
    const [rows] = await pool.execute(
      'DELETE FROM horarios WHERE Dia = ? AND Horario = ?',
      [diaFormatado, horario]
    );

    res.json({ success: true, message: 'Horário removido com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao remover horário' });
  }
});

// Rota para obter todos os horários
app.get('/horarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM horarios');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao recuperar horários do banco de dados' });
  }
});

// Rota para obter os horários disponíveis (NAO USADA, MAS ESTA PRONTA, ELA OBTEM HORARIOS JA USADOS, MAS NAO FOI PRECISO)
app.get('/horariosDisponiveis', async (req, res) => {
  // Definindo os horários permitidos
  const horariosPermitidos = [13, 14, 15, 16, 17];

  try {
    const [rows] = await pool.query('SELECT * FROM horarios');
    const horariosReservados = rows.map(row => row.Horario);
    const horariosDisponiveis = horariosPermitidos.filter(horario => !horariosReservados.includes(horario));
    res.json(horariosDisponiveis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao recuperar horários do banco de dados' });
  }
});

// Iniciando o servidor na porta 3000
app.listen(3000, () => {
  console.log('Aplicativo está ouvindo na porta 3000!');
});
