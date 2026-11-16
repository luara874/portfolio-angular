<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../conexao.php';

$metodo = $_SERVER['REQUEST_METHOD'];

try {
    if ($metodo === 'GET') {
        $todos = ($_GET['todos'] ?? '') === '1';

        if ($todos) {
            $sql = "SELECT id, nome, descricao, tecnologias, link_github, ano, status
                    FROM projetos
                    ORDER BY ano DESC, id DESC";
        } else {
            $sql = "SELECT id, nome, descricao, tecnologias, link_github, ano, status
                    FROM projetos
                    WHERE status = 'publicado'
                    ORDER BY ano DESC, id DESC";
        }

        echo json_encode($pdo->query($sql)->fetchAll());
        exit;
    }

    if ($metodo === 'POST') {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        $nome = trim($dados['nome'] ?? '');
        $descricao = trim($dados['descricao'] ?? '');
        $tecnologias = trim($dados['tecnologias'] ?? '');
        $linkGithub = trim($dados['link_github'] ?? '');
        $ano = (int) ($dados['ano'] ?? 0);
        $status = $dados['status'] ?? 'publicado';

        if ($nome === '' || $ano <= 0) {
            http_response_code(400);
            echo json_encode(['erro' => 'Nome e ano são obrigatórios.']);
            exit;
        }

        if (!in_array($status, ['rascunho', 'publicado', 'arquivado'], true)) {
            http_response_code(400);
            echo json_encode(['erro' => 'Status inválido.']);
            exit;
        }

        $sql = 'INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status)
                VALUES (:nome, :descricao, :tecnologias, :link_github, :ano, :status)';

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nome' => $nome,
            ':descricao' => $descricao,
            ':tecnologias' => $tecnologias,
            ':link_github' => $linkGithub,
            ':ano' => $ano,
            ':status' => $status,
        ]);

        http_response_code(201);
        echo json_encode([
            'id' => (int) $pdo->lastInsertId(),
            'mensagem' => 'Projeto criado com sucesso.',
        ]);
        exit;
    }

    if ($metodo === 'PUT') {
        $id = (int) ($_GET['id'] ?? 0);

        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['erro' => 'Informe o id do projeto.']);
            exit;
        }

        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        $nome = trim($dados['nome'] ?? '');
        $descricao = trim($dados['descricao'] ?? '');
        $tecnologias = trim($dados['tecnologias'] ?? '');
        $linkGithub = trim($dados['link_github'] ?? '');
        $ano = (int) ($dados['ano'] ?? 0);
        $status = $dados['status'] ?? 'publicado';

        if ($nome === '' || $ano <= 0) {
            http_response_code(400);
            echo json_encode(['erro' => 'Nome e ano são obrigatórios.']);
            exit;
        }

        if (!in_array($status, ['rascunho', 'publicado', 'arquivado'], true)) {
            http_response_code(400);
            echo json_encode(['erro' => 'Status inválido.']);
            exit;
        }

        $busca = $pdo->prepare('SELECT id FROM projetos WHERE id = :id');
        $busca->execute([':id' => $id]);

        if (!$busca->fetch()) {
            http_response_code(404);
            echo json_encode(['erro' => 'Projeto não encontrado.']);
            exit;
        }

        $sql = 'UPDATE projetos
                SET nome = :nome,
                    descricao = :descricao,
                    tecnologias = :tecnologias,
                    link_github = :link_github,
                    ano = :ano,
                    status = :status
                WHERE id = :id';

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nome' => $nome,
            ':descricao' => $descricao,
            ':tecnologias' => $tecnologias,
            ':link_github' => $linkGithub,
            ':ano' => $ano,
            ':status' => $status,
            ':id' => $id,
        ]);

        http_response_code(200);
        echo json_encode(['mensagem' => 'Projeto atualizado com sucesso.']);
        exit;
    }

    if ($metodo === 'DELETE') {
        $id = (int) ($_GET['id'] ?? 0);

        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['erro' => 'Informe o id do projeto.']);
            exit;
        }

        $stmt = $pdo->prepare('DELETE FROM projetos WHERE id = :id');
        $stmt->execute([':id' => $id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['erro' => 'Projeto não encontrado.']);
            exit;
        }

        http_response_code(204);
        exit;
    }

    header('Allow: GET, POST, PUT, DELETE, OPTIONS');
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.']);
} catch (Throwable $erro) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro interno do servidor.']);
}
