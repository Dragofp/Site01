const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
app.use(cors());
app.use(express.json());
const jwt = require('jsonwebtoken');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pass',
  database: 'b1',
  connectionLimit: 10,
  queueLimit: 0
});
app.use(cors());

app.post('/registrar', async (req, res) => {
  let { nome, senha, profissional } = req.body;
  if (nome.length <= 3 || senha.length <= 3) {
    return res.status(400).json({ error: 'Nome e senha precisam ter mais de 4 caracteres' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedSenha = await bcrypt.hash(senha, salt);

  try {
    const [coluna] = await pool.query('SELECT * FROM usuarios WHERE nome = ?', [nome]);
    if (coluna.length > 0) {
      return res.status(400).json({ error: 'Nome já registrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar no banco de dados' });
  }

  try {
    const [coluna] = await pool.query('INSERT INTO usuarios (nome, senha, profissional) VALUES (?, ?, ?)', [nome, hashedSenha, profissional]);
    res.json({ id: coluna.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao inserir no banco de dados' });
  }
});

let usuarioLogado = null; // Variável para armazenar o usuário logado

app.post('/login', async (req, res) => {
  let { nome, senha } = req.body;

  try {
    const [coluna] = await pool.query('SELECT * FROM usuarios WHERE nome = ?', [nome]);
    if (coluna.length === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const usuario = coluna[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    // Armazene o nome do usuário após o login bem-sucedido
    usuarioLogado = usuario.nome;

    res.json({ id: usuario.id, nome: usuario.nome});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.get('/usuario', (req, res) => {
  if (usuarioLogado) {
    res.json({ nome: usuarioLogado });
  } else {
    res.status(400).json({ error: 'Nenhum usuário está logado' });
  }
});


app.post('/addhora', async (req, res) => {
  let { pessoa, dia, horario } = req.body;

  if (!dia || dia.split('/').length !== 3) {
    res.status(400).json({ success: false, message: 'Formato de data inválido. Use o formato DD/MM/AAAA.' });
    return;
  }

  let partes = dia.split('/');
  let diaFormatado = `${partes[2]}-${partes[1]}-${partes[0]}`;

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



app.get('/horarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM horarios');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao recuperar horários do banco de dados' });
  }
});

app.get('/horariosDisponiveis', async (req, res) => {
  // Defina os horários permitidos
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


app.listen(3000, () => {
  console.log('Aplicativo está ouvindo na porta 3000!');
});



