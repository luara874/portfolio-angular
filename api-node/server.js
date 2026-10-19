const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
const PORTA = 3000;
const SEGREDO = 'sua_chave_secreta_super_segura_2026';

// Middleware de CORS
app.use(cors());

// OBRIGATÓRIO: Lê o JSON enviado no corpo das requisições e preenche req.body
app.use(express.json());

// ==========================================
// MIDDLEWARE DE AUTENTICAÇÃO (Tranca da API)
// ==========================================
function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do formato "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ erro: 'Token ausente' });
  }

  try {
    const usuario = jwt.verify(token, SEGREDO);
    req.usuario = usuario;
    next(); // Passa o bastão para a rota
  } catch (err) {
    return res.status(401).json({ erro: 'Token invalido ou expirado' });
  }
}

// ==========================================
// ROTA DE LOGIN (POST /api/login)
// ==========================================
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe email e senha' });
  }

  try {
    const [linhas] = await pool.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (linhas.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha invalidos' });
    }

    const usuario = linhas[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Email ou senha invalidos' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      SEGREDO,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// ==========================================
// ROTA 1: Listar projetos (GET /api/projetos) - PÚBLICA
// ==========================================
app.get('/api/projetos', async (req, res) => {
  try {
    const todos = req.query.todos === '1';

    const sql = todos
      ? "SELECT id, nome, descricao, tecnologias, link_github, ano, status FROM projetos ORDER BY ano DESC, id DESC"
      : "SELECT id, nome, descricao, tecnologias, link_github, ano, status FROM projetos WHERE status = 'publicado' ORDER BY ano DESC, id DESC";

    const [linhas] = await pool.execute(sql);
    return res.json(linhas);
  } catch (erro) {
    return res.status(500).json({ erro: `Falha no servidor: ${erro.message}` });
  }
});

// ==========================================
// ROTA 2: Buscar projeto por ID (GET /api/projetos/:id) - PÚBLICA
// ==========================================
app.get('/api/projetos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [linhas] = await pool.execute(
      "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos WHERE status = 'publicado' AND id = ?",
      [id]
    );

    if (linhas.length === 0) {
      return res.status(404).json({ erro: "Projeto nao encontrado" });
    }

    return res.json(linhas[0]);
  } catch (erro) {
    return res.status(500).json({ erro: `Falha no servidor: ${erro.message}` });
  }
});

// ==========================================
// ROTA POST: Criar novo projeto (POST /api/projetos) - PROTEGIDA
// ==========================================
app.post('/api/projetos', autenticar, async (req, res) => {
  try {
    const dados = req.body;

    if (!dados || !dados.nome) {
      return res.status(400).json({ erro: 'Informe pelo menos o nome do projeto' });
    }

    const sql = 'INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status) VALUES (?, ?, ?, ?, ?, ?)';
    const [resultado] = await pool.execute(sql, [
      dados.nome,
      dados.descricao ?? '',
      dados.tecnologias ?? '',
      dados.link_github ?? '',
      dados.ano ?? new Date().getFullYear(),
      'publicado'
    ]);

    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// ==========================================
// ROTA PUT: Atualizar projeto (PUT /api/projetos/:id) - PROTEGIDA
// ==========================================
app.put('/api/projetos/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    if (!dados || !dados.nome) {
      return res.status(400).json({ erro: 'Informe pelo menos o nome do projeto' });
    }

    const sql = `
      UPDATE projetos 
      SET nome = ?, descricao = ?, tecnologias = ?, link_github = ?, ano = ?
      WHERE id = ?
    `;

    const [resultado] = await pool.execute(sql, [
      dados.nome,
      dados.descricao ?? '',
      dados.tecnologias ?? '',
      dados.link_github ?? '',
      dados.ano ?? new Date().getFullYear(),
      id
    ]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Projeto nao encontrado' });
    }

    return res.json({ mensagem: 'Projeto atualizado' });
  } catch (erro) {
    return res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// ==========================================
// ROTA DELETE: Apagar projeto (DELETE /api/projetos/:id) - PROTEGIDA
// ==========================================
app.delete('/api/projetos/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await pool.execute('DELETE FROM projetos WHERE id = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Projeto nao encontrado' });
    }

    return res.sendStatus(204);
  } catch (erro) {
    return res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// ==========================================
// ROTA 3: Catálogo de tecnologias (GET /api/tecnologias) - PÚBLICA
// ==========================================
app.get('/api/tecnologias', async (req, res) => {
  try {
    const [linhas] = await pool.execute(
      "SELECT id, nome, categoria, descricao, ano_criacao FROM tecnologias ORDER BY categoria, nome"
    );
    return res.json(linhas);
  } catch (erro) {
    return res.status(500).json({ erro: `Falha no servidor: ${erro.message}` });
  }
});

// Inicialização do Servidor
app.listen(PORTA, () => {
  console.log(`API no ar em http://localhost:${PORTA}`);
});