<?php

// conexao.php - conexao PDO com o MariaDB (reutilizavel)

$host = getenv('DB_HOST') ?: 'localhost';
$db = getenv('DB_NAME') ?: 'dwii_db';
$user = getenv('DB_USER') ?: 'dwii_user';

$senhaAmbiente = getenv('DB_PASS');
$pass = $senhaAmbiente === false ? 'dwii2026' : $senhaAmbiente;

$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

$pdo = new PDO($dsn, $user, $pass, $options);
