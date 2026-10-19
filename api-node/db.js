// api-node/db.js - a conexao com MariaDB (o conexao.php do Node)
const mysql = require('mysql2/promise');

// socketPath: o mesmo caminho local que o PHP usa quando o host é 'localhost'
// Por isso casa com o usuario 'dwii_user'@'localhost' da Aula 16.
const pool = mysql.createPool({
  socketPath: '/run/mysqld/mysqld.sock',
  user: 'dwii_user',
  password: 'dwii2026',
  database: 'dwii_db'
});

module.exports = pool;
