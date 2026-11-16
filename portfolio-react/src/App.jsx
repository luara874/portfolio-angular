import Cabecalho from './Cabecalho.jsx';
import CardProjeto from './CardProjeto.jsx';
import Rodape from './Rodape.jsx';

// Aula 25: dados fixos da consulta ao banco enviada pela Luara.
// Links de exemplo github.com/usuario/... não são links reais confirmados.
function App() {
  return (
    <>
      <Cabecalho />
      <main>
        <h2>Projetos</h2>
        <div className="cards">
          <CardProjeto projeto={{
            nome: 'Portfolio Pessoal',
            descricao: 'Site de portfolio responsivo com PHP, PDO e MariaDB, painel admin e login.',
            tecnologias: 'PHP, MariaDB, CSS, Git',
            link_github: null,
            ano: 2026,
          }} />
          <CardProjeto projeto={{
            nome: 'Sistema de Biblioteca',
            descricao: 'CRUD de acervo e emprestimos, com busca e relatorios.',
            tecnologias: 'PHP, MariaDB, Bootstrap',
            link_github: null,
            ano: 2025,
          }} />
          <CardProjeto projeto={{
            nome: 'App de Tarefas',
            descricao: 'Lista de tarefas com categorias, prazos e filtro por status.',
            tecnologias: 'JavaScript, HTML, CSS',
            link_github: null,
            ano: 2025,
          }} />
        </div>
      </main>
      <Rodape />
    </>
  );
}

export default App;
