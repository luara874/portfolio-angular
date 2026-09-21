# portfolio-angular

Projeto da matéria de Desenvolvimento Web II (IFPR). Front-end em Angular e
back-end com uma API em PHP + MariaDB.

Autora: **Luara Munk**.

Versões do projeto: npm 11.9.0, Angular CLI 21.2.13, Node 24 recomendado, PHP 8+ e MariaDB.

## Estrutura

```
.
├── api/
│   ├── projetos.php      # consulta e CRUD dos projetos
│   ├── tecnologias.php   # catálogo de tecnologias ativas
│   └── contato.php       # recebe mensagens do formulário de contato
├── conexao.php           # conexão PDO com o MariaDB
├── sql/
│   └── setup.sql         # cria o banco, as tabelas e os dados-base
└── portfolio-angular/    # aplicação Angular (front-end)
```

## Back-end (API PHP + MariaDB)

### 1. Pré-requisitos

- PHP 8 ou superior (`php -v`)
- MariaDB (ou MySQL) rodando
- usuário `dwii_user` com acesso ao banco `dwii_db`, ou variáveis de ambiente `DB_HOST`, `DB_NAME`, `DB_USER` e `DB_PASS`

### 2. Criar o banco

O script cria o banco `dwii_db`, as tabelas `projetos`, `tecnologias` e `contatos`, além de alguns dados iniciais do catálogo:

```bash
sudo mariadb < sql/setup.sql
```

Ou, já dentro do cliente:

```sql
SOURCE sql/setup.sql;
```

A conexão padrão usada por `conexao.php` é:

- banco: `dwii_db`
- usuário: `dwii_user`
- senha: `dwii2026`

### 3. Subir a API

Na raiz do repositório, usando o servidor embutido do PHP:

```bash
/usr/bin/php -S localhost:8000
```

### 4. Endpoints

- Projetos publicados: http://localhost:8000/api/projetos.php
- Todos os projetos para a gestão: http://localhost:8000/api/projetos.php?todos=1
- Criar projeto: `POST /api/projetos.php`
- Atualizar projeto: `PUT /api/projetos.php?id=N`
- Excluir projeto: `DELETE /api/projetos.php?id=N`
- Catálogo de tecnologias: http://localhost:8000/api/tecnologias.php
- Envio de contato: `POST http://localhost:8000/api/contato.php`

As respostas em JSON usam `Content-Type: application/json; charset=utf-8` e as APIs liberam CORS para o front-end.

## Front-end (Angular)

```bash
cd portfolio-angular
npm install
ng serve
```

Acesse http://localhost:4200/.

A URL base da API fica centralizada em:

`portfolio-angular/src/app/api-url.ts`

Por padrão:

```ts
export const API_URL = 'http://localhost:8000/api';
```

Se a API estiver em outro endereço, como em um Codespace, altere somente essa constante.

### Etapas

- Aula 16: Angular Router, páginas Home/Sobre, Angular Material, rota ativa com `routerLinkActive` e componentes standalone.
- Aula 17: integração com a API PHP para projetos e tecnologias.
- Aula 18: formulário reativo de contato com validação, POST e feedback de envio.
- Aula 19: CRUD de projetos e área de gestão com status de rascunho/publicado.

## Tecnologias

Angular, TypeScript, Angular Material, HTML, CSS, PHP, PDO, MariaDB e Git.

## 🎯 Autoavaliação — Aula 17

Conceito pretendido: B

Justificativa:

- Consumo da API de projetos: `portfolio-angular/src/app/projeto.service.ts`, linhas 26–41, concentra as requisições; `portfolio-angular/src/app/projetos/projetos.ts` recebe os dados e a tela mostra carregamento, erro e estado vazio em `projetos.html`.
- Catálogo: `portfolio-angular/src/app/tecnologia.service.ts` busca as tecnologias e `portfolio-angular/src/app/catalogo/catalogo.html` mostra carregamento, erro e mensagem quando não há itens.
- Botão GitHub: `portfolio-angular/src/app/projetos/projetos.html` usa `[href]` para abrir o repositório do projeto quando o link existe.
- Boas práticas: a URL base da API está em `portfolio-angular/src/app/api-url.ts`; as chamadas HTTP ficam nos services e os componentes cuidam do estado da tela.

## 🎯 Autoavaliação — Aula 18

Conceito pretendido: B

- Formulário reativo: `portfolio-angular/src/app/contato/contato.ts`, linhas 19–23, cria os campos com `Validators`.
- Erros por campo: `portfolio-angular/src/app/contato/contato.html`, linhas 8–29, mostra as mensagens de nome, e-mail e mensagem depois que o campo é tocado.
- POST e estados de envio: `portfolio-angular/src/app/contato.service.ts`, linhas 21–25, faz o POST; em `contato.ts`, a função `onSubmit()` trata sucesso, erro, reset do formulário e bloqueio durante o envio.
- Endpoint: `api/contato.php`, linhas 20–54, lê o JSON, valida novamente no servidor, grava com `prepare` e `execute` e responde 201 ou 400.
- Feedback na tela: `contato.html` mostra as mensagens de sucesso e erro depois da tentativa de envio.

## 🎯 Autoavaliação — Aula 19

Conceito pretendido: B

- API por verbo e status: `api/projetos.php`, linhas 18–166, trata GET, POST, PUT, DELETE e OPTIONS. O parâmetro `?todos=1` é usado pela gestão para incluir rascunhos.
- Gestão pelo service: `portfolio-angular/src/app/gestao/gestao.ts` usa somente `ProjetoService`; o acesso HTTP fica em `portfolio-angular/src/app/projeto.service.ts`, linhas 26–41.
- Formulário e status: `portfolio-angular/src/app/gestao/gestao.html`, a partir da linha 9, tem formulário reativo, validação de nome e ano e escolha entre rascunho e publicado.
- Atualização sem F5: `portfolio-angular/src/app/gestao/gestao.ts`, a partir da linha 82, salva o projeto e carrega a lista novamente.
- Exclusão: `gestao.ts`, a partir da linha 118, pede confirmação com o nome do projeto e remove o item da lista depois da resposta da API.
- Estados da interface: a tela mostra carregamento, lista vazia, sucesso e erro.

## Aula 19: como a API atende quatro ações

O endereço continua o mesmo porque o servidor também verifica o método HTTP da requisição.

GET consulta dados; POST cria um novo projeto; PUT altera o projeto indicado pelo `id`; DELETE remove esse projeto. Dessa forma, a rota continua única e cada ação fica explícita pelo verbo HTTP.

Apagar um projeto por GET não seria adequado porque GET representa leitura e pode ser acessado automaticamente por navegador, cache ou outras ferramentas. A exclusão só acontece com uma requisição DELETE.

## Aula 19: testes com curl

Com a API e o banco ligados, estes comandos permitem conferir os principais retornos:

```bash
API="http://localhost:8000/api/projetos.php"

# GET
curl -i "$API"

# POST
curl -i -X POST "$API" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Projeto teste","descricao":"Teste do CRUD","tecnologias":"Angular, PHP","link_github":"","ano":2026,"status":"rascunho"}'

# POST inválido: 400
curl -i -X POST "$API" \
  -H "Content-Type: application/json" \
  -d '{"nome":"","ano":2026,"status":"publicado"}'

# PUT sem id: 400
curl -i -X PUT "$API" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","ano":2026,"status":"publicado"}'

# PUT com um id existente: 200
curl -i -X PUT "$API?id=1" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Projeto atualizado","descricao":"Teste","tecnologias":"Angular","link_github":"","ano":2026,"status":"publicado"}'

# DELETE de id inexistente: 404
curl -i -X DELETE "$API?id=999999"

# verbo não tratado: 405
curl -i -X PATCH "$API"

# preflight do CORS: 204
curl -i -X OPTIONS "$API"
```

Os retornos definidos pelo código são:

```
POST válido     -> 201 Created
PUT válido      -> 200 OK
DELETE válido   -> 204 No Content
Dados inválidos -> 400 Bad Request
ID inexistente  -> 404 Not Found
Verbo inválido  -> 405 Method Not Allowed
OPTIONS         -> 204 No Content
```

## Aula 19: atualização da lista

Depois de salvar, a tela pede a lista novamente à API para trazer os dados como ficaram no banco.

Ao excluir, ela remove o item diretamente do array local, porque já sabe exatamente qual registro foi removido. Recarregar a lista custa uma requisição extra, mas garante sincronização com o banco; alterar o array local é mais rápido, porém depende do estado atual da tela.

## Aula 19: uma operação na aba Network

Ao adicionar um projeto, a requisição usada é POST e a API responde 201 com JSON.

Ao apagar, a requisição usada é DELETE e a resposta é 204, porque depois da exclusão não existe conteúdo para devolver.

## Aula 19: clique duplo ao salvar

Enquanto um projeto está sendo salvo, `salvando` fica como `true` e o botão permanece desabilitado.

Isso evita que dois cliques rápidos disparem dois POSTs e criem registros duplicados.
