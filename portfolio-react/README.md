# Portfólio React da Luara — Aula 27

O front usa a API Node da Luara para projetos e tecnologias, com fetch em efeitos, carregamento, erro, lista vazia e Atualizar. O formulário de contato continua uma demonstração local da Aula 26: não envia nem armazena dados.

Na raiz do repositório, em um terminal:

```bash
sudo service mariadb start
cd PortfolioAngular/api-node
npm ci
node server.js
```

Não recrie o banco nem rode setup.sql para iniciar esta aula. A configuração existente deve ser preservada. No Codespace, mantenha a porta 3000 pública e confirme sua URL em `src/api.js`.

Em outro terminal, a partir da raiz:

```bash
cd portfolio-react
npm ci
npm run dev -- --host 0.0.0.0 --port 5174 --strictPort
```

Abra a 5174 em PORTS. Se já estiver em uso, pare só o Vite antigo ou escolha outra porta. Na pasta React:

```bash
npm run build
npm run lint
```

- `api.js`: URL central da porta 3000, confirmada pela usuária.
- `App.jsx`: estados de projetos/carregamento/erro; efeito inicial, map com key pelo id e Atualizar por evento.
- `Catalogo.jsx`: GET de tecnologias e estados próprios, com lista ul/li e key pelo id.
- `CardProjeto.jsx`: recebe o objeto retornado pela API. Não há lista fixa de reserva nem projetos.js.
- `Contato.jsx`: campos controlados, contador, aviso e limpeza dos três campos, sem POST.

`resposta.ok` é verificado antes de JSON. O fim do carregamento é tratado também quando há falha. Os dados exibidos são os retornados pela API, incluindo a quantidade e os links cadastrados; endereços de exemplo no banco precisam ser confirmados pela Luara.

Veja no README principal, seção Aula 27, os testes reais, as simulações e a limitação de certificado do Chromium desta máquina. Os testes com dados reais por retransmissor de curl não equivalem a aprovar o caminho HTTPS direto do navegador. A nota única sobre uso de IA está no README principal.
