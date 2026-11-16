-- Aula 24: acrescenta o dono sem apagar tabelas ou usuários existentes.
-- Execute no banco dwii_db, depois de setup.sql. A senha nunca entra aqui.
CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(120) NOT NULL,
    senha_hash CHAR(60) NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
