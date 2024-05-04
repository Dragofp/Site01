const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pass',
  database: 'b1',
  connectionLimit: 10,
  queueLimit: 0
});
app.use(cors({
  origin: 'http://localhost:4200' // Permitir apenas este domínio
}));


app.get('/api/lerinfo', async (req, res) => {
  const sql = 'SELECT nome, idade FROM tabela';
  const [info] = await pool.query(sql);
  res.send(info);
});


app.post('/api/inserir-nome', (req, res) => {
  const nome = req.body.nome;
  pool.query('INSERT INTO tabela (nome) VALUES (?)', [nome], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Algo deu errado ao inserir o nome' });
    } else {
      res.status(201).json({ message: `Nome adicionado com ID: ${results.insertId}` });
    }
  })
  res.json({ message: 'mensagem' });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
