CREATE DATABASE IF NOT EXISTS dwii_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE dwii_db;

CREATE TABLE IF NOT EXISTS projetos (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT NOT NULL,
    tecnologias VARCHAR(200) NOT NULL,
    link_github VARCHAR(300) NULL DEFAULT NULL,
    ano YEAR NOT NULL,
    status ENUM('rascunho','publicado','arquivado') NOT NULL DEFAULT 'rascunho',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tecnologias (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descricao TEXT,
    ano_criacao INT,
    status ENUM('ativo','inativo') NOT NULL DEFAULT 'ativo',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS contatos (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    mensagem TEXT NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO tecnologias (nome, categoria, descricao, ano_criacao)
SELECT 'HTML', 'Frontend', 'Linguagem de marcacao para estrutura de paginas.', 1993
WHERE NOT EXISTS (SELECT 1 FROM tecnologias WHERE nome = 'HTML');

INSERT INTO tecnologias (nome, categoria, descricao, ano_criacao)
SELECT 'CSS', 'Frontend', 'Linguagem de estilos para apresentacao visual.', 1996
WHERE NOT EXISTS (SELECT 1 FROM tecnologias WHERE nome = 'CSS');

INSERT INTO tecnologias (nome, categoria, descricao, ano_criacao)
SELECT 'JavaScript', 'Frontend', 'Linguagem de programacao para o navegador.', 1995
WHERE NOT EXISTS (SELECT 1 FROM tecnologias WHERE nome = 'JavaScript');

INSERT INTO tecnologias (nome, categoria, descricao, ano_criacao)
SELECT 'PHP', 'Backend', 'Linguagem server-side para aplicacoes web.', 1995
WHERE NOT EXISTS (SELECT 1 FROM tecnologias WHERE nome = 'PHP');

INSERT INTO tecnologias (nome, categoria, descricao, ano_criacao)
SELECT 'MariaDB', 'Banco de Dados', 'Sistema gerenciador de banco de dados relacional.', 2009
WHERE NOT EXISTS (SELECT 1 FROM tecnologias WHERE nome = 'MariaDB');

INSERT INTO tecnologias (nome, categoria, descricao, ano_criacao)
SELECT 'Git', 'DevOps', 'Sistema de controle de versao distribuido.', 2005
WHERE NOT EXISTS (SELECT 1 FROM tecnologias WHERE nome = 'Git');
