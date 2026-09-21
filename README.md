# Portfólio Angular

**Autora:** Luara Munk

Projeto desenvolvido nas aulas de Desenvolvimento Web II. O portfólio tem páginas de apresentação, projetos, catálogo, contato e uma área de gestão para cadastrar e manter os projetos sem precisar alterar o banco manualmente.

## Como rodar

Na raiz do repositório, suba a API PHP:

```bash
/usr/bin/php -S 0.0.0.0:8000
```

Em outro terminal:

```bash
cd portfolio-angular
npm install
ng serve
```

No Codespace, a porta do Angular e a porta 8000 precisam estar acessíveis. Quando o Codespace mudar, a URL da API deve ser atualizada em:

`portfolio-angular/src/app/projeto.service.ts`

e também em `portfolio-angular/src/app/contato.service.ts`.

## Área de gestão

A rota `/gestao` permite:

- listar projetos publicados e rascunhos;
- adicionar projeto;
- editar projeto;
- excluir com confirmação;
- escolher entre rascunho e publicado;
- ver mensagens de carregamento, lista vazia, sucesso e erro.

Depois de salvar, eu busco a lista novamente na API. Preferi fazer assim porque a tela fica igual ao banco mesmo se algum dado tiver mudado fora dela. No excluir, removo só o item do array local, então economizo uma nova requisição.

## Um endereço, quatro ações

O endereço da API é o mesmo, mas o servidor olha o método HTTP da requisição antes de decidir o que fazer. GET consulta, POST cria, PUT altera e DELETE remove, então não é necessário criar uma URL diferente para cada ação.

Apagar não deve ser feito por GET porque GET é usado para leitura e pode ser acessado automaticamente por navegador, cache ou robô. A exclusão precisa acontecer somente quando uma requisição DELETE for enviada de propósito.

## Status dos projetos

Na gestão, a chamada usa `?todos=1` para trazer também os rascunhos. A página pública continua chamando a mesma API sem esse parâmetro e recebe somente os projetos publicados.

O status escolhido no formulário também vai no POST ou PUT. Assim dá para guardar um projeto ainda incompleto sem mostrar ele na parte pública do portfólio.

## Duplo clique em Adicionar

Se duas requisições POST chegarem ao servidor, são duas criações diferentes e podem aparecer dois registros no banco. Por isso o botão fica desabilitado enquanto `salvando` é verdadeiro, evitando um segundo envio enquanto a primeira requisição ainda está acontecendo.

## Pré-voo do CORS

Antes de alguns pedidos como PUT e DELETE, o navegador pode enviar OPTIONS para saber se aquele servidor aceita o método. A API responde 204 e informa os métodos permitidos no cabeçalho `Access-Control-Allow-Methods`.

## Testes com curl

Estes são os comandos que uso para conferir a API. O endereço deve ser trocado pela URL atual da porta 8000 do Codespace.

```bash
API="https://SEU-CODESPACE-8000.app.github.dev/api/projetos.php"

# GET
curl -i "$API"

# POST
curl -i -X POST "$API" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Projeto da Luara","descricao":"Projeto cadastrado pela área de gestão","tecnologias":"Angular, PHP","link_github":"","ano":2026,"status":"rascunho"}'

# POST inválido: deve responder 400
curl -i -X POST "$API" \
  -H "Content-Type: application/json" \
  -d '{"nome":"","ano":2026,"status":"publicado"}'

# PUT sem id: deve responder 400
curl -i -X PUT "$API" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","ano":2026,"status":"publicado"}'

# PUT com um id existente: deve responder 200
curl -i -X PUT "$API?id=1" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Projeto atualizado","descricao":"","tecnologias":"Angular","link_github":"","ano":2026,"status":"publicado"}'

# id inexistente: deve responder 404
curl -i -X DELETE "$API?id=999999"

# verbo não tratado: deve responder 405
curl -i -X PATCH "$API"

# preflight: deve responder 204 e listar os métodos permitidos
curl -i -X OPTIONS "$API"
```

Os códigos acima são os retornos esperados pelo código atual. Antes da entrega, vale rodar os comandos no Codespace para registrar a saída real do ambiente e confirmar a conexão com o banco.

## O que observar no Network

Ao adicionar um projeto, a requisição deve aparecer como POST e a API responde 201 quando cria o registro. Ao excluir, o método é DELETE e a resposta é 204, porque a exclusão foi concluída e não há conteúdo para devolver.

O `Content-Type` das respostas JSON é `application/json; charset=utf-8`. No DELETE com 204 não existe corpo de resposta.

## Sobre usar um link para excluir

Um `<a href=".../projetos.php?id=5">` faz uma navegação GET. Eu não usaria isso para apagar porque só visitar o endereço poderia causar uma alteração no banco. Para conferir, basta abrir o Network: o link aparece como GET, enquanto o botão da gestão chama o método DELETE do service.

## Polimento

Acrescentei um estado específico quando não existe nenhum projeto cadastrado, em vez de deixar a área vazia. Também deixei o foco do teclado bem visível nos campos e botões.

Para a parte de foco, consultei a documentação de acessibilidade do Angular Material, que recomenda indicadores de foco fortes e fáceis de perceber:

https://material.angular.dev/

## Ficha de diagnóstico

O principal problema era que a API de projetos só fazia GET e a aplicação ainda não tinha a rota de gestão. Também não existiam POST, PUT e DELETE no service.

Corrigi o CRUD, a rota `/gestao`, o campo de status, os estados de tela, a atualização sem F5 e o comportamento em telas menores. Mantive o `confirm()` nativo para exclusão porque ele já atende ao objetivo da atividade sem adicionar outra dependência só para essa confirmação.

Ainda precisa ser conferida no Codespace a saída real dos testes de curl e do Network, porque isso depende da API e do MariaDB estarem rodando no ambiente.

## 🎯 Autoavaliação

**Conceito pretendido: A**

- R1 — API decide pelo verbo e trata GET/POST/PUT/DELETE: `api/projetos.php`, linhas 18–166.
- R1 — POST com 201: `api/projetos.php`, a partir da linha 36.
- R1 — PUT com validação e 404: `api/projetos.php`, a partir da linha 79.
- R1 — DELETE com 204: `api/projetos.php`, a partir da linha 143.
- R2 — acesso à API fica no service: `portfolio-angular/src/app/projeto.service.ts`, linhas 25–40.
- R2 — formulário com status e validação: `portfolio-angular/src/app/gestao/gestao.html`, linhas 11–58.
- R2 — mensagens de erro e estados da tela: `portfolio-angular/src/app/gestao/gestao.html`, linhas 62–97.
- R3 — salvar atualiza sem F5 e limpa o formulário: `portfolio-angular/src/app/gestao/gestao.ts`, linhas 82–116.
- R3 — excluir atualiza o array local: `portfolio-angular/src/app/gestao/gestao.ts`, linhas 118–151.
- R4 — justificativas e comparação das estratégias: seções acima deste README.
- R5 — viewport: `portfolio-angular/src/index.html`, linha 7.
- R5 — responsividade e foco: `portfolio-angular/src/app/gestao/gestao.css`.
