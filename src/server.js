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

    res.json({ id: usuario.id, nome: usuario.nome});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }

});

app.post('/addhora', async (req, res) => {
  let { pessoa, dia, horario } = req.body;

  try {
    const [rows] = await pool.execute(
      'INSERT INTO horarios (Pessoa, Dia, Horario) VALUES (?, ?, ?)',
      [pessoa, dia, horario]
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


app.listen(3000, () => {
  console.log('Aplicativo está ouvindo na porta 3000!');
});



