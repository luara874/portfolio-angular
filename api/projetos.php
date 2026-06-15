<?php

// api/projetos.php - projetos PUBLICADOS do Portfolio em JSON

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require __DIR__ . '/../conexao.php';

$sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos WHERE status = 'publicado'";

$projetos = $pdo->query($sql)->fetchAll();

echo json_encode($projetos);