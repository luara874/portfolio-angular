// Dados locais: os três registros informados na Aula 25 e a API Node deste repositório.
// IDs estáveis desta lista; não são uma consulta nem uma migração do banco.
const projetos = [
  {
    id: 1,
    nome: 'Portfolio Pessoal',
    descricao: 'Site de portfolio responsivo com PHP, PDO e MariaDB, painel admin e login.',
    tecnologias: 'PHP, MariaDB, CSS, Git',
    link_github: null,
    ano: 2026,
  },
  {
    id: 2,
    nome: 'Sistema de Biblioteca',
    descricao: 'CRUD de acervo e emprestimos, com busca e relatorios.',
    tecnologias: 'PHP, MariaDB, Bootstrap',
    link_github: null,
    ano: 2025,
  },
  {
    id: 3,
    nome: 'App de Tarefas',
    descricao: 'Lista de tarefas com categorias, prazos e filtro por status.',
    tecnologias: 'JavaScript, HTML, CSS',
    link_github: null,
    ano: 2025,
  },
  {
    id: 4,
    nome: 'API do Portfólio em Node',
    descricao: 'API em Express com MariaDB, login e autenticação por token JWT.',
    tecnologias: 'Node.js, Express, MariaDB',
    link_github: 'https://github.com/luara874/portfolio-angular/tree/main/PortfolioAngular/api-node',
    ano: 2026,
  },
];

export default projetos;
