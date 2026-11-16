# Portfólio React da Luara — Aulas 25 e 26

Projeto Vite + React aproveitado do Codespace da Luara. O roxo continua como destaque, combinado com neutros em modos claro/escuro. A composição atual usa faixa lateral no desktop, tipografia sem serifa e painel de contato. A Aula 26 mostra quatro projetos locais com map/key e um formulário controlado, sem consultar a API.

```bash
cd portfolio-react
npm install
npm run dev
```

Acesse a porta 5173. No Codespace, pode usar `npm run dev -- --host 0.0.0.0 --port 5173 --strictPort` e abrir a porta pela aba PORTS.

```bash
npm run build
npm run lint
```

- `App.jsx`: monta o cabeçalho, a lista de cards, o contato e o rodapé com um fragment.
- `Cabecalho.jsx`: identificação da Luara, quatro links para seções da própria página e atalho de teclado para o conteúdo; não há Router.
- `CardProjeto.jsx`: recebe o objeto `projeto` com nome, descrição, tecnologias, link e ano. Exibe o link somente quando fornecido.
- `Rodape.jsx`: identificação da Luara, IFPR e ano.
- `projetos.js`: lista local com IDs estáveis; `map` usa `key={p.id}` e o total é `projetos.length`.
- `Contato.jsx`: estados de nome, e-mail, mensagem e aviso, caixas com value/onChange, contador e envio local com preventDefault e limpeza. Não envia e-mail nem grava dados.
- `index.css`: novo layout responsivo, menu lateral/topo, cards, painel de contato, hover/foco e modo escuro.

Os dados vieram da consulta ao banco enviada pela usuária. Os links `github.com/usuario/...` dos três registros iniciais eram exemplos e ficaram como `null` até a confirmação de URLs reais. O quarto card aponta para a API Node real deste repositório. Nenhum registro do banco foi alterado.

No JSX, `className` é a propriedade usada para a classe CSS; `class` é palavra reservada do JavaScript. `{projeto.nome}` avalia um valor; `{{nome}}` tenta renderizar um objeto, e uma prop com nome diferente não fornece o campo esperado pelo componente.

Veja as evidências, os critérios e as instruções para preservar as alterações antigas do Codespace no README da raiz, seções Aulas 25 e 26.

Uso de IA: ChatGPT/Codex auxiliou na revisão dos materiais, no complemento dos componentes, da lista e do formulário controlado, redesenho de CSS/JSX e documentação e na verificação com build, lint e navegador, para estudo pela Luara.
