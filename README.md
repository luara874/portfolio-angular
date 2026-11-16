# portfolio-angular

Projeto da matéria de Desenvolvimento Web II (IFPR). Front-end em Angular e
back-end original em PHP + MariaDB e API Node/Express com autenticação na Aula 24.

Autora: **Luara Munk**.

Versões do projeto: npm 11.9.0, Angular CLI 21.2.13, Node 24 recomendado, PHP 8+ e MariaDB.

## Estrutura

```text
.
├── PortfolioAngular/
│   ├── api-node/         # API Node/Express (porta 3000)
│   ├── api/              # API PHP (porta 8000)
│   ├── sql/              # setup.sql e usuarios.sql
│   ├── conexao.php        # PDO/MariaDB
│   ├── src/              # Angular
│   ├── public/
│   ├── .vscode/
│   ├── .gitignore
│   ├── angular.json
│   ├── package.json / package-lock.json
│   └── tsconfig*.json
├── portfolio-react/      # React/Vite (porta 5173)
│   ├── src/
│   ├── public/
│   ├── .gitignore / .oxlintrc.json
│   ├── package.json / package-lock.json
│   └── vite.config.js
└── README.md
```

A API avaliada na Aula 24 é a **Node**, na porta **3000**: veja [Aula 24](#aula-24-a-tranca-da-api-em-node) para subir do zero e conferir as respostas reais. O Angular e a API PHP continuam preservados; a constante `API_URL` do Angular ainda aponta para a API PHP (porta 8000). Mudar somente a porta não basta para migrá-lo, porque os caminhos e contratos PHP/Node são diferentes. Login no front não é cobrado nesta aula.

## Back-end anterior (API PHP + MariaDB)

### 1. Pré-requisitos

- PHP 8 ou superior (`php -v`)
- MariaDB (ou MySQL) rodando
- usuário `dwii_user` com acesso ao banco `dwii_db`, ou variáveis de ambiente `DB_HOST`, `DB_NAME`, `DB_USER` e `DB_PASS`

### 2. Criar o banco

O script cria o banco `dwii_db`, as tabelas `projetos`, `tecnologias` e `contatos`, além de alguns dados iniciais do catálogo:

```bash
sudo mariadb < PortfolioAngular/sql/setup.sql
```

Ou, já dentro do cliente:

```sql
SOURCE PortfolioAngular/sql/setup.sql;
```

A conexão padrão usada por `PortfolioAngular/conexao.php` é:

- banco: `dwii_db`
- usuário: `dwii_user`
- senha: `dwii2026`

### 3. Subir a API

Na raiz do repositório, usando o servidor embutido do PHP:

```bash
/usr/bin/php -S localhost:8000 -t PortfolioAngular
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
cd PortfolioAngular
npm install
npm start
```

Acesse http://localhost:4200/.

A URL base da API fica centralizada em:

`PortfolioAngular/src/app/api-url.ts`

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

Angular, TypeScript, Angular Material, HTML, CSS, PHP, PDO, Node.js, Express, mysql2, bcryptjs, JWT, MariaDB e Git.

## 🎯 Autoavaliação — Aula 17

Conceito pretendido: B

Justificativa:

- Consumo da API de projetos: `PortfolioAngular/src/app/projeto.service.ts`, linhas 26–41, concentra as requisições; `PortfolioAngular/src/app/projetos/projetos.ts` recebe os dados e a tela mostra carregamento, erro e estado vazio em `projetos.html`.
- Catálogo: `PortfolioAngular/src/app/tecnologia.service.ts` busca as tecnologias e `PortfolioAngular/src/app/catalogo/catalogo.html` mostra carregamento, erro e mensagem quando não há itens.
- Botão GitHub: `PortfolioAngular/src/app/projetos/projetos.html` usa `[href]` para abrir o repositório do projeto quando o link existe.
- Boas práticas: a URL base da API está em `PortfolioAngular/src/app/api-url.ts`; as chamadas HTTP ficam nos services e os componentes cuidam do estado da tela.

## 🎯 Autoavaliação — Aula 18

Conceito pretendido: B

- Formulário reativo: `PortfolioAngular/src/app/contato/contato.ts`, linhas 19–23, cria os campos com `Validators`.
- Erros por campo: `PortfolioAngular/src/app/contato/contato.html`, linhas 8–29, mostra as mensagens de nome, e-mail e mensagem depois que o campo é tocado.
- POST e estados de envio: `PortfolioAngular/src/app/contato.service.ts`, linhas 21–25, faz o POST; em `contato.ts`, a função `onSubmit()` trata sucesso, erro, reset do formulário e bloqueio durante o envio.
- Endpoint: `PortfolioAngular/api/contato.php`, linhas 20–54, lê o JSON, valida novamente no servidor, grava com `prepare` e `execute` e responde 201 ou 400.
- Feedback na tela: `contato.html` mostra as mensagens de sucesso e erro depois da tentativa de envio.

## 🎯 Autoavaliação — Aula 19

Conceito pretendido: B

- API por verbo e status: `PortfolioAngular/api/projetos.php`, linhas 18–166, trata GET, POST, PUT, DELETE e OPTIONS. O parâmetro `?todos=1` é usado pela gestão para incluir rascunhos.
- Gestão pelo service: `PortfolioAngular/src/app/gestao/gestao.ts` usa somente `ProjetoService`; o acesso HTTP fica em `PortfolioAngular/src/app/projeto.service.ts`, linhas 26–41.
- Formulário e status: `PortfolioAngular/src/app/gestao/gestao.html`, a partir da linha 9, tem formulário reativo, validação de nome e ano e escolha entre rascunho e publicado.
- Atualização sem F5: `PortfolioAngular/src/app/gestao/gestao.ts`, a partir da linha 82, salva o projeto e carrega a lista novamente.
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


## Aula 24: a tranca da API em Node

### Conferência e mudanças

A revisão partiu do commit `44a7ce1` ("Aula 24 (Parte 1): Login, JWT e teste do POST autenticado"). Ele já continha `db.js`, `criar-usuario.js`, bcrypt, login/JWT, cinco operações de projetos e `autenticar` nas três escritas, inclusive DELETE. A existência desse código foi confirmada por inspeção; o título do commit antigo não é tratado como evidência de teste executado nesta revisão.

Faltavam a tabela de usuários versionada, a documentação de execução e respostas, as três escritas protegidas do catálogo e a leitura protegida de rascunhos. Foram acrescentadas essas partes e corrigido o acesso público por `?todos=1`. POST aceita status e PUT o preserva quando omitido, para um rascunho não ser publicado sem intenção. Login sem corpo agora responde 400; o middleware exige o formato Bearer. O script de criação encerra com código de erro em caso de falha e aguarda o fechamento do pool.

Os 1.079 arquivos de `PortfolioAngular/api-node/node_modules/` foram retirados do controle de versão; as regras de ignore, agora nos dois projetos, ignoram dependências e arquivos `.env`. Os pacotes continuam definidos em `package.json`/`package-lock.json`. A aparência, os dados e os arquivos do Angular/PHP não foram alterados nesta aula.

### Como rodar do zero no Codespace

Pré-requisitos: Node 24, npm 11, MariaDB instalado e acesso administrativo local ao banco. Se o MariaDB não estiver instalado no Codespace, instale-o antes: `sudo apt-get update && sudo apt-get install -y mariadb-server`. Os comandos abaixo partem da raiz **deste repositório**.

1. Atualizar a branch e ligar o banco:

```bash
git switch main
git pull --ff-only origin main
sudo service mariadb start
```

2. Criar as tabelas e depois acrescentar usuários, sem apagar registros existentes:

```bash
sudo mariadb < PortfolioAngular/sql/setup.sql
sudo mariadb dwii_db < PortfolioAngular/sql/usuarios.sql
sudo mariadb -e "SHOW TABLES FROM dwii_db;"
```

`setup.sql` usa `IF NOT EXISTS` e só insere tecnologias-base ausentes. `usuarios.sql` também usa `IF NOT EXISTS`; não redefine senha nem substitui usuário existente. Faça backup antes de qualquer ajuste em um banco com dados importantes. O resultado inclui `contatos`, `projetos`, `tecnologias` e `usuarios`.

3. Em banco novo, criar o usuário de laboratório da conexão. O comando preserva uma conta já existente e sua senha:

```bash
sudo mariadb <<'SQL'
CREATE USER IF NOT EXISTS 'dwii_user'@'localhost' IDENTIFIED BY 'dwii2026';
GRANT SELECT, INSERT, UPDATE, DELETE ON dwii_db.* TO 'dwii_user'@'localhost';
SQL
```

`dwii2026` é a configuração didática de conexão com o banco que já existia no projeto; **não é a senha de login da Luara**. `PortfolioAngular/api-node/db.js` usa `dwii_db`, `dwii_user` e esse valor. Se a conta do seu Codespace já usa outra configuração, mantenha seus dados e ajuste a conexão local, sem redefinir a conta. O socket padrão é `/run/mysqld/mysqld.sock`; para um MariaDB em outro socket, exporte `DB_SOCKET` com o caminho antes dos comandos Node. A revisão usou essa opção para acessar um banco isolado.

4. Instalar as dependências da API pelo lockfile:

```bash
cd PortfolioAngular/api-node
npm ci
```

5. Criar o dono **uma vez**, escolhendo a senha no terminal (ela não aparece na tela nem como texto literal no histórico):

```bash
EMAIL='20241ctb0100082@estudantes.ifpr.edu.br'
read -rsp 'Escolha a senha de login (não envie pelo chat): ' SENHA
printf '\n'
node criar-usuario.js "$EMAIL" "$SENHA"
unset SENHA
```

Esse e-mail foi confirmado durante a revisão. Se ele já existe, o índice UNIQUE recusa a duplicação; não apague o usuário nem substitua sua senha para repetir a aula. A senha pessoal ainda deve ser definida pela Luara no próprio Codespace. Na revisão, esse e-mail foi usado somente com senha temporária aleatória no banco isolado; a conta de teste foi removida depois.

Para conferir o armazenamento sem expor a senha ou o hash inteiro:

```bash
sudo mariadb dwii_db -e "SELECT id, email, CHAR_LENGTH(senha_hash) AS tamanho_hash, LEFT(senha_hash, 7) AS prefixo FROM usuarios;"
```

Na execução isolada, o hash tinha 60 caracteres e prefixo `$2b$10$`. `bcrypt.hash(senha, 10)` cria o hash com salt; `bcrypt.compare` confere a senha recebida, sem recuperar a original. Não grave senhas em SQL, README ou Git.

6. Subir a API no primeiro terminal:

```bash
node server.js
```

Saída obtida: `API no ar em http://localhost:3000`. O segundo terminal usa os `curl` abaixo. O Node não depende da API PHP nem do Angular para esses testes. Para manter o portfólio Angular original rodando, use os comandos das seções anteriores (PHP na porta 8000 e Angular na 4200); a autenticação desta aula se aplica aos endpoints Node, não aos endpoints PHP legados.

### Escolhas confirmadas e como a tranca funciona

- Validade: **30 minutos**, confirmada durante a revisão para reduzir o tempo de uso de um token exposto. O teste do JWT retornou `exp - iat = 1800` segundos.
- Login incorreto: `Não foi possível entrar com esse e-mail e senha`.
- Token ausente ou cabeçalho fora do formato Bearer: `Faça login e envie o token para continuar`.
- Token inválido ou expirado: `Seu token não é válido ou venceu. Entre novamente`.

As mensagens também foram confirmadas durante a revisão. E-mail inexistente e senha errada respondem o mesmo 401 e corpo para não revelar, pela mensagem, quais e-mails estão cadastrados. Isso não implementa proteção contra diferenças de tempo nem limite de tentativas.

O único `autenticar` verifica o JWT, preenche `req.usuario` e chama `next()` ou retorna 401 antes do SQL. Não há `verify` copiado nas rotas. `GET /api/projetos/todos` vem antes de `/:id`; sem isso, o Express trataria "todos" como id. A lista pública ignora `?todos=1` e só retorna publicados. Um rascunho também não é exposto pelo GET público por id.

O token contém id, e-mail, emissão e expiração: é legível, não criptografado. A API não guarda sessão; reiniciá-la com o mesmo segredo não invalida o token, o que foi verificado com PUT após reinício. Sem `next()`, um middleware que não responde deixa o pedido pendurado; não foi necessário remover essa linha nem reabrir rotas protegidas para concluir a aula.

### SEGREDO e a Aula 29

O `SEGREDO` didático dentro de `server.js` fica público no GitHub: quem o lê consegue assinar tokens, portanto ele não serve para produção.
Na Aula 29, deve sair do código para `.env` fora do Git, lido por `process.env`; será preciso trocar o segredo já publicado e invalidar os tokens anteriores.

### Rotas × verbos × precisa de token

| Rota Node | Verbo | Token | Resposta principal |
| --- | --- | --- | --- |
| `/api/login` | POST | Não | 200 token; 400 dados ausentes; 401 credenciais incorretas |
| `/api/projetos` | GET | Não | 200 só publicados |
| `/api/projetos/todos` | GET | Sim | 200 incluindo rascunhos; 401 sem token |
| `/api/projetos/:id` | GET | Não | 200 publicado; 404 não encontrado/rascunho |
| `/api/projetos` | POST | Sim | 201 com id; 400 sem nome/status inválido |
| `/api/projetos/:id` | PUT | Sim | 200; 400 sem nome/status inválido; 404 inexistente |
| `/api/projetos/:id` | DELETE | Sim | 204 sem corpo; 404 inexistente |
| `/api/tecnologias` | GET | Não | 200 catálogo |
| `/api/tecnologias` | POST | Sim | 201 com id; 400 sem nome |
| `/api/tecnologias/:id` | PUT | Sim | 200; 400 sem nome; 404 inexistente |
| `/api/tecnologias/:id` | DELETE | Sim | 204 sem corpo; 404 inexistente |

Todas as rotas que exigem token retornam 401 antes da escrita quando ele falta ou é inválido. As consultas com dados do cliente usam parâmetros `?` e `pool.execute`; falhas de banco são capturadas com 500 em JSON. O CORS permanece habilitado, com preflight OPTIONS 204.

### Evidências reais com curl — 16/11/2026

Execução com Node `24.22.1`, npm `11.9.0`, MariaDB `11.4.13` em container isolado, sem acesso aos dados do Codespace da Luara. `npm ci` concluiu com 95 pacotes instalados. A seguir estão comandos e a **primeira linha e corpo efetivamente recebidos**; cabeçalhos adicionais foram omitidos. Senhas e tokens foram ocultados. Os IDs pertencem exclusivamente ao teste: **não execute PUT/DELETE nesses números no seu banco**; use apenas IDs que você acabou de criar para teste.

Os sete casos da tranca estão abaixo: login correto, login incorreto, POST sem token, POST com token, PUT com token, DELETE sem token e GET sem token. Também estão documentados DELETE com token, as operações do catálogo e a leitura protegida do nível A. A fixture "Fixture preservada" foi criada antes das chamadas HTTP para conferir preservação de registros; não é um projeto pessoal da Luara.

No login de exemplo, substitua `<senha>` apenas no terminal local. Guarde o token retornado numa variável do mesmo terminal, sem colocá-lo em arquivo ou no Git:

```bash
read -rsp 'Cole o token retornado pelo login: ' TOKEN
printf '\n'
```

#### Login correto

```bash
curl -i -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"20241ctb0100082@estudantes.ifpr.edu.br","senha":"<senha>"}'
```

```text
HTTP/1.1 200 OK
{"token":"<token oculto>"}
```

#### Login incorreto

```bash
curl -i -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"20241ctb0100082@estudantes.ifpr.edu.br","senha":"<senha incorreta>"}'
```

```text
HTTP/1.1 401 Unauthorized
{"erro":"Não foi possível entrar com esse e-mail e senha"}
```

#### E-mail inexistente: mesma resposta

```bash
curl -i -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nao-existe@example.invalid","senha":"<senha incorreta>"}'
```

```text
HTTP/1.1 401 Unauthorized
{"erro":"Não foi possível entrar com esse e-mail e senha"}
```

#### Login sem senha

```bash
curl -i -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"20241ctb0100082@estudantes.ifpr.edu.br"}'
```

```text
HTTP/1.1 400 Bad Request
{"erro":"Informe email e senha"}
```

#### POST de projeto sem token

```bash
curl -i -X POST http://localhost:3000/api/projetos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Recusado"}'
```

```text
HTTP/1.1 401 Unauthorized
{"erro":"Faça login e envie o token para continuar"}
```

#### PUT sem token

```bash
curl -i -X PUT http://localhost:3000/api/projetos/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Recusado"}'
```

```text
HTTP/1.1 401 Unauthorized
{"erro":"Faça login e envie o token para continuar"}
```

#### Token com assinatura alterada

No teste de assinatura foi trocado o primeiro caractere do bloco de assinatura (o payload permaneceu intacto); `$TOKEN_ALTERADO` representa esse valor inválido.

```bash
curl -i -X POST http://localhost:3000/api/projetos \
  -H "Authorization: Bearer $TOKEN_ALTERADO" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Recusado"}'
```

```text
HTTP/1.1 401 Unauthorized
{"erro":"Seu token não é válido ou venceu. Entre novamente"}
```

#### POST de projeto com token

```bash
curl -i -X POST http://localhost:3000/api/projetos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Aula 24","ano":2026}'
```

```text
HTTP/1.1 201 Created
{"id":2}
```

#### Criação do rascunho usado na leitura protegida

```bash
curl -i -X POST http://localhost:3000/api/projetos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Rascunho Aula 24","ano":2026,"status":"rascunho"}'
```

```text
HTTP/1.1 201 Created
{"id":3}
```

#### GET público sem token, com rascunho existente

```bash
curl -i -X GET http://localhost:3000/api/projetos
```

```text
HTTP/1.1 200 OK
[{"id":2,"nome":"Teste Aula 24","descricao":"","tecnologias":"","link_github":"","ano":2026,"status":"publicado"},{"id":1,"nome":"Fixture preservada","descricao":"Registro anterior aos pedidos HTTP","tecnologias":"","link_github":null,"ano":2026,"status":"publicado"}]
```

#### Parâmetro antigo não revela rascunhos

```bash
curl -i -X GET 'http://localhost:3000/api/projetos?todos=1'
```

```text
HTTP/1.1 200 OK
[{"id":2,"nome":"Teste Aula 24","descricao":"","tecnologias":"","link_github":"","ano":2026,"status":"publicado"},{"id":1,"nome":"Fixture preservada","descricao":"Registro anterior aos pedidos HTTP","tecnologias":"","link_github":null,"ano":2026,"status":"publicado"}]
```

#### GET de todos sem token

```bash
curl -i -X GET http://localhost:3000/api/projetos/todos
```

```text
HTTP/1.1 401 Unauthorized
{"erro":"Faça login e envie o token para continuar"}
```

#### GET de todos com token, incluindo rascunho

```bash
curl -i -X GET http://localhost:3000/api/projetos/todos \
  -H "Authorization: Bearer $TOKEN"
```

```text
HTTP/1.1 200 OK
[{"id":3,"nome":"Rascunho Aula 24","descricao":"","tecnologias":"","link_github":"","ano":2026,"status":"rascunho"},{"id":2,"nome":"Teste Aula 24","descricao":"","tecnologias":"","link_github":"","ano":2026,"status":"publicado"},{"id":1,"nome":"Fixture preservada","descricao":"Registro anterior aos pedidos HTTP","tecnologias":"","link_github":null,"ano":2026,"status":"publicado"}]
```

#### GET do projeto por id, sem token

```bash
curl -i -X GET http://localhost:3000/api/projetos/2
```

```text
HTTP/1.1 200 OK
{"id":2,"nome":"Teste Aula 24","descricao":"","tecnologias":"","link_github":"","ano":2026}
```

#### PUT de projeto com token

```bash
curl -i -X PUT http://localhost:3000/api/projetos/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Aula 24 editado","ano":2026}'
```

```text
HTTP/1.1 200 OK
{"mensagem":"Projeto atualizado"}
```

#### PUT com o mesmo token após reiniciar a API

```bash
curl -i -X PUT http://localhost:3000/api/projetos/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Aula 24 editado","ano":2026}'
```

```text
HTTP/1.1 200 OK
{"mensagem":"Projeto atualizado"}
```

#### DELETE sem token

```bash
curl -i -X DELETE http://localhost:3000/api/projetos/2
```

```text
HTTP/1.1 401 Unauthorized
{"erro":"Faça login e envie o token para continuar"}
```

#### DELETE com token

```bash
curl -i -X DELETE http://localhost:3000/api/projetos/2 \
  -H "Authorization: Bearer $TOKEN"
```

```text
HTTP/1.1 204 No Content
(sem corpo)
```

#### DELETE de id já removido

```bash
curl -i -X DELETE http://localhost:3000/api/projetos/2 \
  -H "Authorization: Bearer $TOKEN"
```

```text
HTTP/1.1 404 Not Found
{"erro":"Projeto nao encontrado"}
```

#### Leitura pública do catálogo

```bash
curl -i -X GET http://localhost:3000/api/tecnologias
```

```text
HTTP/1.1 200 OK
[{"id":4,"nome":"PHP","categoria":"Backend","descricao":"Linguagem server-side para aplicacoes web.","ano_criacao":1995},{"id":5,"nome":"MariaDB","categoria":"Banco de Dados","descricao":"Sistema gerenciador de banco de dados relacional.","ano_criacao":2009},{"id":6,"nome":"Git","categoria":"DevOps","descricao":"Sistema de controle de versao distribuido.","ano_criacao":2005},{"id":2,"nome":"CSS","categoria":"Frontend","descricao":"Linguagem de estilos para apresentacao visual.","ano_criacao":1996},{"id":1,"nome":"HTML","categoria":"Frontend","descricao":"Linguagem de marcacao para estrutura de paginas.","ano_criacao":1993},{"id":3,"nome":"JavaScript","categoria":"Frontend","descricao":"Linguagem de programacao para o navegador.","ano_criacao":1995}]
```

#### Criação protegida no catálogo

```bash
curl -i -X POST http://localhost:3000/api/tecnologias \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Tecnologia Aula 24","categoria":"Teste","descricao":"Temporária","ano_criacao":2026}'
```

```text
HTTP/1.1 201 Created
{"id":7}
```

#### Atualização protegida no catálogo

```bash
curl -i -X PUT http://localhost:3000/api/tecnologias/7 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Tecnologia Aula 24 editada","categoria":"Teste","descricao":"Temporária","ano_criacao":2026}'
```

```text
HTTP/1.1 200 OK
{"mensagem":"Tecnologia atualizada"}
```

#### Exclusão protegida no catálogo

```bash
curl -i -X DELETE http://localhost:3000/api/tecnologias/7 \
  -H "Authorization: Bearer $TOKEN"
```

```text
HTTP/1.1 204 No Content
(sem corpo)
```

#### Banco indisponível: falha real no ambiente isolado

Este pedido foi feito após parar somente o MariaDB descartável de teste; o banco foi reiniciado em seguida. O caminho no erro é o socket daquele ambiente. Não pare o banco do seu portfólio para repetir essa prova.

```bash
curl -i -X GET http://localhost:3000/api/projetos
```

```text
HTTP/1.1 500 Internal Server Error
{"erro":"Falha no servidor: connect ENOENT /workspace/work/aula24/db-run/mysqld.sock"}
```

### Verificação complementar e preservação dos dados

Foram executadas **48 requisições HTTP** e **15 verificações adicionais** com asserções de resultado. A tabela resume os demais casos realmente observados:

| Caso | Resultado obtido |
| --- | --- |
| Login sem corpo / campos de tipos inválidos | 400 em JSON |
| E-mail com tentativa de SQL (`' OR 1=1 --`) | 401, sem autenticar |
| POST, PUT e DELETE de projetos e catálogo sem token | 401 nas seis rotas; snapshot do banco inalterado |
| Payload do JWT modificado / assinatura modificada / JWT expirado | 401 |
| Credencial no esquema Basic em vez de Bearer | 401 |
| POST e PUT sem nome em projetos e catálogo | 400 |
| POST e PUT de projeto com status inválido | 400 |
| GET público de rascunho ou id inexistente | 404 em JSON |
| PUT e DELETE de id inexistente, projetos e catálogo | 404 em JSON |
| PUT sem campo status em rascunho | 200; status rascunho preservado no banco |
| Nome contendo SQL no POST de projeto | 201; texto armazenado literalmente, tabela preservada |
| Preflight OPTIONS | 204 |
| Cadastro duplicado do e-mail do dono | Recusado, código de saída 1; hash existente preservado |
| SQL de usuários e setup reaplicados | Dados anteriores preservados |
| Limpeza após os testes | Somente IDs criados no teste removidos; snapshot inicial restaurado |

O script `criar-usuario.js` foi executado de verdade, e o hash foi consultado no banco, com 60 caracteres e prefixo bcrypt. Nenhuma senha ou JWT foi incluído nas evidências. A API recebeu as requisições por `curl`; as 15 verificações adicionais conferiram dados, hash, validade, reinício e preservação. A sintaxe dos três arquivos JavaScript da API passou em `node --check`. O Angular/PHP não foi alterado nem teve sua execução validada nesta revisão.

Não há registro fabricado de um DELETE sem autenticação retornando 204 "antes": ele já estava protegido no commit inicial. As evidências desta revisão mostram 401 sem token, 204 com token e 404 ao repetir a exclusão. Os exercícios de previsões, respostas pessoais do caderno e avaliação no AVA continuam sendo da Luara.

### O que esta API ainda não faz

1. Não tem autorização por perfil/proprietário: qualquer usuário com JWT válido pode alterar os projetos e o catálogo. A tabela de usuários não equivale a uma regra de permissão por registro.
2. Não revoga um token individual nem faz logout no servidor: sem sessão/denylist, ele continua válido até expirar, mesmo após reiniciar a API. Trocar o segredo invalida todos os tokens.

### Critérios de avaliação e histórico real

| Critério da Entrega A | Evidência nesta revisão | Limite para afirmar atendimento integral |
| --- | --- | --- |
| 1. Operações da API | Cinco operações de projetos e três escritas protegidas do catálogo, com status e SQL parametrizado: `PortfolioAngular/api-node/server.js`, seções de projetos e catálogo; respostas acima | Evidências técnicas de C e B presentes |
| 2. Tranca | `PortfolioAngular/sql/usuarios.sql`, `PortfolioAngular/api-node/criar-usuario.js`, único `autenticar`, login, 30 minutos, mensagens confirmadas e justificativa; leitura `/api/projetos/todos` protegida | Requisitos técnicos adicionais de A presentes; senha pessoal definitiva ainda deve ser criada pela Luara no Codespace |
| 3. README e histórico | Execução do zero, curls reais, limites, explicação do segredo e tabela de rotas; dependências fora da árvore versionada atual | Não existem commits separados das Aulas 21, 22 e 23 no histórico recebido; nem todas as mensagens antigas seguem `Aula NN:` |

A revisão implementa e testa os recursos técnicos até A, mas **não comprova A integral na rubrica**. O conceito final depende do menor dos três critérios e da avaliação do professor. Não é possível declarar integralmente C/B/A enquanto o requisito histórico do arco não estiver resolvido com o professor. A escolha pessoal de conceito esperado e a autoavaliação não foram preenchidas pela IA.

O repositório recebido tinha 12 commits; o último era `44a7ce1`, que reuniu a API Node e já se identificava como Aula 24 (Parte 1). Não foram inventados commits das Aulas 21–23, retrodatados commits, alteradas mensagens antigas nem reescrito o histórico para parecer que a sequência existia. O complemento desta aula usa mensagem iniciada por `Aula 24:` e a identidade Git confirmada de Luara. Os arquivos `node_modules` continuam no histórico antigo, mas foram removidos da versão atual; eliminá-los do passado exigiria reescrita de histórico, que não foi feita.

Repositório público: https://github.com/luara874/portfolio-angular . Nada foi enviado ao AVA nesta revisão. A Luara deve definir sua senha no Codespace, estudar os trechos acima e tratar a lacuna do histórico com o professor antes de declarar um conceito esperado.

## Aula 25: o portfólio em React

### Base recebida e organização

A Aula 24 foi publicada em `7943ee8`. O Codespace da Luara ainda estava no commit `44a7ce1`, com alterações locais no backend, Angular e SQL e com `portfolio-react/` não rastreada. O pacote `luara-aula25-contexto.tar.gz` enviado pela usuária permitiu aproveitar o React existente, em vez de recriá-lo com Vite. Ele já tinha Vite/React, lockfile, Oxlint, `main.jsx`, `App.jsx`, `Cabecalho.jsx`, estilos roxos com modo escuro e a frase "Em breve, em React.".

O README recebido era idêntico à versão do commit antigo; esta revisão manteve a documentação publicada da Aula 24 e acrescentou a Aula 25. Os outros arquivos modificados do Codespace não vieram no pacote e não foram aplicados, descartados nem conciliados nesta revisão. Eles permanecem no Codespace; o GitHub e essa cópia local não representam todas essas mudanças.

`portfolio-react/` permanece na raiz. A implementação original da Aula 25 foi publicada em `5ca7168`, sem reorganização. Depois, a pedido da usuária, um commit separado reuniu Angular, APIs, SQL e conexão em `PortfolioAngular/`, conforme a árvore atual acima. Não há Angular aninhado em outra pasta Angular: `src/`, configurações e backend estão diretamente nessa pasta.

```text
portfolio-react/
├── package.json / package-lock.json
├── vite.config.js / .oxlintrc.json / .gitignore
├── index.html
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── Cabecalho.jsx
    ├── CardProjeto.jsx
    ├── Rodape.jsx
    └── index.css
```

### Componentes, props e conteúdo

- `App.jsx` substitui o texto provisório por "Projetos" e três chamadas explícitas de `CardProjeto`, dentro de um fragment junto com `Cabecalho` e `Rodape`. Não há array com `map`, estado, formulário, fetch, useEffect ou Router nesta aula.
- `Cabecalho.jsx` mantém os quatro links do manual (Início, Sobre, Projetos e Contato, ainda com `href="#"`) e identifica o Portfólio da Luara. Não se espera navegação entre páginas nesta etapa.
- `CardProjeto.jsx` é uma função exportada que recebe **um objeto** pela prop `projeto` e lê `projeto.nome`, `descricao`, `tecnologias`, `link_github` e `ano`. As props entram do pai para o filho e são somente leitura. O ano é número, não string. Um mesmo componente monta os três cards.
- `Rodape.jsx` mostra "Luara Munkemer Fornazari · IFPR · 2026"; o nome completo e o IFPR já estavam em `PortfolioAngular/src/app/sobre/sobre.html`. Não foram inventadas informações pessoais.
- `index.css` preserva as variáveis, a cor roxa do cabeçalho e os modos claro/escuro recebidos; acrescenta grid, cards, rodapé e ajuste de largura/empilhamento no celular. `index.html` agora usa `pt-BR` e o título do portfólio.

**Dados:** os três cards reproduzem os primeiros três registros da consulta ao banco enviada pela usuária: Portfolio Pessoal (2026), Sistema de Biblioteca (2025) e App de Tarefas (2025), com suas descrições e tecnologias. Os endereços informados `github.com/usuario/...` são exemplos, por isso `link_github` ficou `null`, sem inventar URLs. Quando a Luara confirmar um link real, basta preencher esse campo. O componente usa `{projeto.link_github && <a ...>}`: não cria um botão sem destino. O comportamento com URL, `null` e string vazia foi testado separadamente, sem trocar os dados da página. Os registros no banco não foram alterados nem importados por requisição.

**JSX:** usa-se `className`, nome da propriedade do DOM para a classe CSS, em vez de `class`, palavra reservada do JavaScript. `{projeto.nome}` mostra o valor; `{{nome}}` tenta renderizar um objeto e causa erro no React. Uma prop `titulo` não preenche automaticamente `nome`: os nomes precisam coincidir. O fragment `<>...</>` permite devolver uma única árvore sem acrescentar uma div ao layout.

### Executar em um checkout atualizado e sem alterações pendentes

Requisitos: Node 24 e npm 11, os mesmos usados na verificação. Na raiz do repositório:

```bash
git switch main
git pull --ff-only origin main
cd portfolio-react
npm install
npm run dev
```

O Vite usa a porta **5173**. No Codespace, abra o globo dessa porta na aba **PORTS**. Se precisar expor a interface de rede, use:

```bash
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

Se a porta já estiver ocupada pelo React antigo, pare somente aquele `npm run dev` com Ctrl+C no terminal correspondente antes de iniciar a versão atual. A API Node e o banco não precisam estar ligados para esta aula. As instruções anteriores de Angular/PHP e Node continuam nas respectivas seções; o React não substitui esses projetos.

Para reinstalar exatamente as versões do lockfile e verificar:

```bash
npm ci
npm run build
npm run lint
```

### Codespace antigo com mudanças locais: abrir sem sobrescrever

**Este é o caso mostrado nos prints da Luara.** Não faça pull sobre a pasta ainda não conciliada: há alterações nos caminhos antigos `api-node/server.js`, `api/projetos.php`, `api/tecnologias.php`, nos services Angular e em `sql/setup.sql`, além de `sql/usuarios.sql` e do React como arquivos não rastreados. Alguns desses caminhos também mudaram nos commits publicados, então uma atualização exige conciliação.

Para abrir a Aula 25 já publicada mantendo o diretório antigo intacto, use uma **worktree temporária**, fora do repositório atual. Isso é um checkout separado para conferência, não uma reorganização nem um segundo projeto dentro de `portfolio-react/`. Execute uma vez, a partir da raiz do Codespace antigo:

```bash
git fetch origin main
git worktree add --detach /tmp/luara-aula25-conferencia origin/main
cd /tmp/luara-aula25-conferencia/portfolio-react
npm ci
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

Pare antes o Vite antigo se ele estiver na 5173. A worktree fica em detached HEAD e serve para conferir o site; os próximos commits devem continuar na branch `main` após a conciliação. Não aplique `reset --hard`, `clean` nem substitua os arquivos antigos por esta cópia. O banco e os arquivos locais do Codespace original permanecem intactos. Para atualizar a pasta original com segurança, ainda será necessário receber e comparar os diffs de backend/Angular/SQL; o pacote React não contém essas mudanças. A worktree não deve ser considerada backup permanente, pois está em `/tmp`.

### Evidências realmente obtidas — 16/11/2026

- `npm ci` dentro de `portfolio-react/`: 27 pacotes instalados a partir do lockfile recebido, que foi preservado.
- `npm run build`: Vite **8.3.5**, 19 módulos transformados, build concluído; gerou `dist/index.html`, CSS e JavaScript. `dist/` não foi versionada.
- `npm run lint`: Oxlint concluiu com código de saída 0 e sem diagnósticos.
- `npm run dev -- --host 0.0.0.0 --port 5173 --strictPort`: servidor iniciado na 5173; o navegador recebeu HTTP 200.
- Chromium headless via Playwright: viewports **1440×900**, **390×844** e **320×720**, nos modos **claro e escuro** (seis combinações). Foram conferidos título e idioma, quatro links, os três títulos de projeto, tecnologias/ano, rodapé, ausência da frase provisória e ausência de rolagem horizontal.
- Nas seis combinações, os cards ficaram em três colunas no desktop e uma coluna no celular; foram conferidas a cor original do cabeçalho, navegação por foco e ausência de erros/avisos de console, exceções de página e requisições falhas. As capturas de desktop e celular também foram inspecionadas visualmente.
- O `CardProjeto` recebeu, numa fixture apenas de teste no navegador, uma URL de repositório válida, `null` e string vazia: somente a URL gerou um link, com `target="_blank"` e `rel="noopener noreferrer"`. Isso verifica a condição; não representa um link pessoal atribuído a nenhum registro do banco.

Os testes de navegador foram executados nesta máquina, com o React do pacote completado, e não diretamente no navegador pessoal ou Codespace da Luara. A API e o Angular não foram retestados nem alterados nesta etapa. Não foram fabricadas respostas de exercícios pessoais nem reproduzidas quebras no projeto entregue.

### Checkpoint C/B/A e pendências

| Meta do material | Evidência |
| --- | --- |
| C | Projeto Vite recebido incorporado, porta 5173, App e CSS adaptados, Cabecalho/CardProjeto exportados, três cards com props, instruções de execução e dependências ignoradas |
| B | Nome da Luara na barra, Rodape separado usado pelo App, dados da consulta informada, link condicional testado; URLs de exemplo foram omitidas até confirmação das reais |
| A | `CardProjeto` recebe `projeto` como objeto, com o mesmo conjunto de campos do contrato de projetos; explicação de `className` acima |

A implementação e os testes sustentam o recurso técnico adicional da **meta A** do checkpoint, sem promessa de nota. A aula não tem envio nem conceito próprio. Os links pessoais reais continuam pendentes de confirmação e a atualização da pasta antiga do Codespace depende da conciliação de seus outros arquivos. Exercícios do caderno e autoavaliação continuam com a Luara. Nada foi enviado ao AVA, e as Aulas 26 e 27 não foram implementadas.

## Organização das pastas solicitada após a Aula 25

A estrutura segue a referência enviada: a raiz contém `PortfolioAngular/`, `portfolio-react/` e este README. A pasta antes chamada `portfolio-angular/` foi renomeada para `PortfolioAngular/`; `api-node/`, `api/`, `sql/` e `conexao.php` foram movidos para dentro dela. Os arquivos de código, contratos HTTP, dados SQL e identidades visuais foram preservados. A reorganização está em um commit próprio, separado das aulas.

Os imports do Angular e Node continuam relativos às mesmas pastas internas. Os endpoints PHP continuam incluindo `__DIR__ . '/../conexao.php'`, porque `api/` e `conexao.php` foram movidos juntos e mantêm essa relação. A API do Angular permanece em `http://localhost:8000/api`; o PHP deve servir **PortfolioAngular**, não a raiz do repositório. O `angular.json` continua com `src` e `public` relativos à pasta Angular. As regras da antiga `.gitignore` da raiz foram incorporadas à pasta Angular; o React também ignora arquivos `.env`, além de dependências e build.

Comandos a partir da raiz de um checkout atualizado:

```bash
# Banco (configuração e credenciais: seção Aula 24)
sudo service mariadb start
sudo mariadb < PortfolioAngular/sql/setup.sql
sudo mariadb dwii_db < PortfolioAngular/sql/usuarios.sql
```

Use terminais separados para cada servidor:

```bash
# API PHP usada pelo Angular: http://localhost:8000/api/projetos.php
php -S localhost:8000 -t PortfolioAngular
```

```bash
# Angular: porta 4200
cd PortfolioAngular
npm ci
npm start -- --host 0.0.0.0
```

```bash
# API Node: porta 3000
cd PortfolioAngular/api-node
npm ci
node server.js
```

```bash
# React: porta 5173, independente da API nesta aula
cd portfolio-react
npm ci
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

### Verificação da reorganização — 16/11/2026

- 62 arquivos movidos (código, configurações e SQL) comparados byte a byte com o commit anterior, sem mudança de conteúdo. A `.gitignore` Angular recebeu as regras antes existentes na raiz; a do React recebeu a exclusão de `.env`.
- Angular: `npm ci` (475 pacotes), `npm run build` concluído, bundle inicial de 479,56 kB. Servidor na porta 4200; Chromium renderizou Início e Sobre, incluindo o nome da Luara, em 1440 e 390 px, sem exceções de página.
- React: `npm run build` e `npm run lint` passaram. O bundle e o código React permaneceram iguais aos da Aula 25.
- Node: sintaxe dos três scripts conferida e nove requisições HTTP passaram, incluindo leituras 200 com MariaDB real isolado, login inválido 401, dados ausentes 400, proteção das escritas e leitura de todos com 401 sem token, e OPTIONS 204. Nenhuma escrita no banco foi autorizada pelos testes desta reorganização.
- PHP 8.3 em container Alpine: quatro arquivos passaram em `php -l`; OPTIONS de projetos/contato retornaram 204 e POST de contato inválido retornou 400 com JSON. A relação de `api/` com `../conexao.php` foi conferida. O CRUD PHP com banco não foi repetido: a tentativa inicial de preparar o driver MySQL esgotou o disco; os recursos temporários dessa tentativa foram removidos, liberando espaço. A imagem menor usada depois não inclui `pdo_mysql`.
- Dependências, `dist` e `.env` continuam ignorados nos dois projetos; nenhum deles entra no commit. O banco pessoal da Luara e o Codespace antigo não foram alterados.

As alterações locais do Codespace antigo ainda não recebidas não foram transportadas automaticamente. O roteiro de worktree da Aula 25 abre a árvore atual sem sobrescrevê-las. Não execute um pull sobre as mudanças locais antigas antes de conciliá-las, pois os caminhos também mudaram nesta reorganização.

## Aula 26: estado, lista e formulário controlado

### Requisitos implementados

A revisão começou com a `main` limpa e igual ao remoto, em `f6432ed`. Foram lidos os cinco PDFs da Aula 26. A árvore continua com `PortfolioAngular/`, `portfolio-react/` e este README. Nenhum arquivo do Angular/API/SQL foi modificado e `setup.sql` não foi executado. Esta máquina não tem acesso direto a novas edições não publicadas no Codespace; as antigas mudanças não recebidas continuam sendo assunto de conciliação, não foram descartadas.

- `portfolio-react/src/projetos.js`: quatro objetos, com `id`, `nome`, `descricao`, `tecnologias`, `link_github` e `ano`; exportação default. Os três registros da Aula 25 foram preservados; o quarto é a API Node existente em `PortfolioAngular/api-node`, com link real para essa pasta. Os IDs são estáveis para esta lista local, sem atribuí-los a registros do banco. Os links `github.com/usuario/...` dos primeiros três itens continuam como `null` até confirmação das URLs reais.
- `App.jsx`: uma única chamada de `CardProjeto` dentro de `projetos.map`, com `key={p.id}` e o objeto `projeto={p}`. O total acima dos cards é calculado por `projetos.length`, sem estado redundante. `Contato` aparece depois da lista, dentro do main.
- `Contato.jsx`: estados independentes `nome`, `email`, `mensagem` e `aviso`. As três caixas têm `value` e `onChange`; o e-mail usa `type="email"`. A saudação e a contagem derivada de `mensagem.length` acompanham a digitação. O botão fica desabilitado para nome vazio ou só com espaços.
- `enviar(e)`: usa `e.preventDefault()`, monta o aviso com nome e tamanho da mensagem antes da limpeza, e chama `setNome('')`, `setEmail('')` e `setMensagem('')`. A mensagem esclarece que é demonstração local: nada foi enviado. Não há fetch, POST, armazenamento de contato nem envio de e-mail.
- Labels visíveis e associados por `htmlFor`/`id`, autocomplete apropriado, descrição do formulário, contador associado ao textarea e aviso em `role="status"`.

O checkpoint não atribui C/B/A nesta aula: é uma meta de progresso, sem envio ao AVA. Foram implementados também os três degraus extras: dados próprios disponíveis, total da lista e botão que espera o nome. Os endereços pessoais reais dos três registros antigos continuam pendentes, sem inventar links. As respostas pessoais do caderno/autoavaliação são da Luara; a IA não as preencheu. Consumo da API fica para a Aula 27.

### Para estudar

`map` transforma cada objeto em um elemento React. A `key` baseada no id identifica esse elemento ao inserir/remover/reordenar dados; posição no array não é identidade. O card continua reutilizável, sem precisar conhecer o tamanho da lista.

`useState` fornece o valor atual e uma função que o altera e pede um novo desenho do componente. Uma variável comum pode mudar sem avisar o React e ainda é reiniciada quando a função roda outra vez. Cada `onChange` lê `e.target.value` e chama o setter correspondente; `value` faz a caixa obedecer ao estado. Sem essa ponta, limpar o estado não limpa a caixa. O evento `onSubmit` chama `enviar`; `preventDefault` impede a navegação padrão do formulário. O contador não precisa de `useState`, pois se calcula da mensagem.

### Como executar e conferir

Na raiz de um checkout atualizado e sem mudanças pendentes:

```bash
git switch main
git pull --ff-only origin main
cd portfolio-react
npm ci
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

Abra a porta 5173 na aba PORTS do Codespace. Se o Vite antigo ocupar essa porta, pare apenas aquele processo com Ctrl+C. Se houver alterações locais, confira `git status --short` antes do pull e preserve-as; o roteiro de worktree da Aula 25 continua válido para abrir uma cópia sem sobrescrever o diretório antigo. Não use reset/clean nem aplique o stash antigo indiscriminadamente aos caminhos reorganizados.

1. Confira os quatro cards e o texto "4 projetos". Só o quarto tem link confirmado; links nulos não criam âncoras sem destino.
2. O botão começa desabilitado; escreva Ana, `ana@exemplo.com` e `Gostei do seu portfolio.`. A contagem realmente obtida é **24**, calculada por JavaScript (`mensagem.length`).
3. Envie: o aviso mantém o nome/tamanho que estavam preenchidos, as três caixas esvaziam, o contador volta a zero e a página não recarrega. O aviso diz expressamente que nada foi enviado.
4. Tente um e-mail malformado: a validação nativa impede esse envio. Teste também por Tab e Enter. Preencher um novo nome permite repetir a demonstração.

```bash
# Dentro de portfolio-react/
npm run build
npm run lint
```

### Evidências da implementação funcional — 16/11/2026

Build Vite 8.3.5 e lint Oxlint passaram. Chromium/Playwright verificou a página em **1440, 768, 390 e 320 px**, nos modos claro e escuro: oito combinações, todas com quatro cards, total correto, contador ao digitar, aviso e limpeza de nome/e-mail/mensagem, botão desabilitado, validação de e-mail e operação do formulário por teclado. Nenhuma combinação teve rolagem horizontal, conteúdo verificado fora da largura, aviso/erro de console ou exceção de página. O envio preservou o mesmo documento e não produziu POST, fetch ou XHR.

Uma fixture de navegador usou o **App real** com um quinto objeto apenas em memória: apareceram cinco cards e "5 projetos", sem editar `App.jsx`. Reordenar os IDs preservou o elemento DOM do card, verificando sua identidade estável. A fixture não foi incluída nos dados entregues.

Os exercícios da variável comum e da retirada de `value` foram reproduzidos em fixtures didáticas isoladas: a variável passou a conter Ana sem atualizar a saudação; no formulário sem value, o nome permaneceu na caixa após a limpeza do estado, enquanto a mensagem controlada esvaziou. O componente entregue conserva as duas pontas em todos os campos. Não foram gravadas versões quebradas nem inventadas previsões pessoais.

Esses testes ocorreram nesta máquina, não diretamente no Codespace pessoal da Luara. Nenhum banco/API/Angular foi iniciado ou alterado para esta atividade. A etapa funcional fica em um commit próprio; a melhoria visual solicitada é registrada separadamente.

Uso de IA: ChatGPT/Codex auxiliou na leitura dos materiais, comparação com o código, complemento da tabela de usuários e rotas da Aula 24 e dos componentes/CSS da Aula 25, reorganização de pastas solicitada pela usuária e execução dos testes HTTP e de navegador e implementação da lista/formulário da Aula 26, além da redação das instruções e evidências deste README, para revisão e estudo pela Luara.
