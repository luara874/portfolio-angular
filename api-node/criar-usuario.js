const bcrypt = require('bcryptjs');
const pool = require('./db');

async function criar() {
  const [email, senha] = process.argv.slice(2);
  if (!email || !senha) {
    console.log('Uso: node criar-usuario.js <email> <senha>');
    process.exit(1);
  }

  const hash = await bcrypt.hash(senha, 10);
  
  try {
    const [res] = await pool.execute(
      'INSERT INTO usuarios (email, senha_hash) VALUES (?, ?)',
      [email, hash]
    );
    console.log(`Usuario ${res.insertId} criado: ${email}`);
  } catch (err) {
    console.error('Erro ao criar usuario:', err.message);
  } finally {
    pool.end();
  }
}

criar();