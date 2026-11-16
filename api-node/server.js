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
  const token = authHeader?.match(/^Bearer (\S+)$/i)?.[1];

  if (!token) {
    return res.status(401).json({ erro: 'Faça login e envie o token para continuar' });
  }

  try {
    const usuario = jwt.verify(token, SEGREDO);
    req.usuario = usuario;
    next(); // Passa o bastão para a rota
  } catch (err) {
    return res.status(401).json({ erro: 'Seu token não é válido ou venceu. Entre novamente' });
  }
}

// ==========================================
// ROTA DE LOGIN (POST /api/login)
// ==========================================
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body ?? {};

  if (typeof email !== 'string' || !email.trim() || typeof senha !== 'string' || !senha) {
    return res.status(400).json({ erro: 'Informe email e senha' });
  }

  try {
    const [linhas] = await pool.execute(
      'SELECT id, email, senha_hash FROM usuarios WHERE email = ?',
      [email]
    );

    if (linhas.length === 0) {
      return res.status(401).json({ erro: 'Não foi possível entrar com esse e-mail e senha' });
    }

    const usuario = linhas[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Não foi possível entrar com esse e-mail e senha' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      SEGREDO,
      { expiresIn: '30m' }
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
    // Mesmo com ?todos=1, a leitura pública nunca revela rascunhos.
    const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano, status FROM projetos WHERE status = 'publicado' ORDER BY ano DESC, id DESC";

    const [linhas] = await pool.execute(sql);
    return res.json(linhas);
  } catch (erro) {
    return res.status(500).json({ erro: `Falha no servidor: ${erro.message}` });
  }
});

// Aula 24: esta rota vem antes de /:id para "todos" não ser lido como um id.
app.get('/api/projetos/todos', autenticar, async (req, res) => {
  try {
    const [linhas] = await pool.execute(
      'SELECT id, nome, descricao, tecnologias, link_github, ano, status FROM projetos ORDER BY ano DESC, id DESC'
    );
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

    if (!dados || typeof dados.nome !== 'string' || !dados.nome.trim()) {
      return res.status(400).json({ erro: 'Informe pelo menos o nome do projeto' });
    }

    const status = dados.status ?? 'publicado';
    if (!['rascunho', 'publicado', 'arquivado'].includes(status)) {
      return res.status(400).json({ erro: 'Status de projeto invalido' });
    }

    const sql = 'INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status) VALUES (?, ?, ?, ?, ?, ?)';
    const [resultado] = await pool.execute(sql, [
      dados.nome,
      dados.descricao ?? '',
      dados.tecnologias ?? '',
      dados.link_github ?? '',
      dados.ano ?? new Date().getFullYear(),
      status
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

    if (!dados || typeof dados.nome !== 'string' || !dados.nome.trim()) {
      return res.status(400).json({ erro: 'Informe pelo menos o nome do projeto' });
    }

    const status = dados.status;
    if (status !== undefined && !['rascunho', 'publicado', 'arquivado'].includes(status)) {
      return res.status(400).json({ erro: 'Status de projeto invalido' });
    }

    const sql = `
      UPDATE projetos 
      SET nome = ?, descricao = ?, tecnologias = ?, link_github = ?, ano = ?, status = COALESCE(?, status)
      WHERE id = ?
    `;

    const [resultado] = await pool.execute(sql, [
      dados.nome,
      dados.descricao ?? '',
      dados.tecnologias ?? '',
      dados.link_github ?? '',
      dados.ano ?? new Date().getFullYear(),
      status ?? null,
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

// Aula 24: a mesma tranca protege as três escritas do catálogo.
app.post('/api/tecnologias', autenticar, async (req, res) => {
  try {
    const dados = req.body;
    if (!dados || typeof dados.nome !== 'string' || !dados.nome.trim()) {
      return res.status(400).json({ erro: 'Informe o nome da tecnologia' });
    }
    const [resultado] = await pool.execute(
      'INSERT INTO tecnologias (nome, categoria, descricao, ano_criacao) VALUES (?, ?, ?, ?)',
      [dados.nome, dados.categoria ?? '', dados.descricao ?? '', dados.ano_criacao ?? null]
    );
    return res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    return res.status(500).json({ erro: `Falha no servidor: ${erro.message}` });
  }
});

app.put('/api/tecnologias/:id', autenticar, async (req, res) => {
  try {
    const dados = req.body;
    if (!dados || typeof dados.nome !== 'string' || !dados.nome.trim()) {
      return res.status(400).json({ erro: 'Informe o nome da tecnologia' });
    }
    const [resultado] = await pool.execute(
      'UPDATE tecnologias SET nome = ?, categoria = ?, descricao = ?, ano_criacao = ? WHERE id = ?',
      [dados.nome, dados.categoria ?? '', dados.descricao ?? '', dados.ano_criacao ?? null, req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Tecnologia nao encontrada' });
    }
    return res.json({ mensagem: 'Tecnologia atualizada' });
  } catch (erro) {
    return res.status(500).json({ erro: `Falha no servidor: ${erro.message}` });
  }
});

app.delete('/api/tecnologias/:id', autenticar, async (req, res) => {
  try {
    const [resultado] = await pool.execute(
      'DELETE FROM tecnologias WHERE id = ?', [req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Tecnologia nao encontrada' });
    }
    return res.sendStatus(204);
  } catch (erro) {
    return res.status(500).json({ erro: `Falha no servidor: ${erro.message}` });
  }
});

// Inicialização do Servidor
app.listen(PORTA, () => {
  console.log(`API no ar em http://localhost:${PORTA}`);
});
