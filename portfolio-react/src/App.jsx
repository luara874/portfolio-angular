import Cabecalho from './Cabecalho.jsx';
import CardProjeto from './CardProjeto.jsx';
import Contato from './Contato.jsx';
import Rodape from './Rodape.jsx';
import projetos from './projetos.js';

function App() {
  return (
    <>
      <Cabecalho />
      <main id="conteudo" tabIndex={-1}>
        <section className="apresentacao" id="inicio" aria-labelledby="titulo-inicio">
          <div className="apresentacao-texto">
            <p className="sobretitulo">Portfólio pessoal · IFPR</p>
            <h1 id="titulo-inicio"><span>Luara</span> <span>Munkemer</span> <span className="nome-destaque">Fornazari</span></h1>
            <p className="introducao">Projetos, trajetória e aprendizado em desenvolvimento de software.</p>
            <a className="link-destaque" href="#projetos">Conheça os projetos <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v12m-5-5 5 5 5-5" /></svg></a>
          </div>
          <aside className="sobre" id="sobre" aria-labelledby="titulo-sobre">
            <p className="sobretitulo" id="titulo-sobre">Sobre mim</p>
            <h2>Estudante de Técnico em Informática.</h2>
            <p>IFPR</p>
            <div className="sobre-habilidades">
              <h3>Aprendizado</h3>
              <p>HTML, CSS, TypeScript, Angular e lógica de programação.</p>
            </div>
          </aside>
        </section>

        <section className="projetos" id="projetos" aria-labelledby="titulo-projetos">
          <div className="cabecalho-secao">
            <div>
              <p className="sobretitulo">Desenvolvimento na prática</p>
              <h2 id="titulo-projetos">Projetos</h2>
            </div>
            <p className="total-projetos">{projetos.length} projetos</p>
          </div>
          <div className="cards">
            {projetos.map((p) => (
              <CardProjeto key={p.id} projeto={p} />
            ))}
          </div>
        </section>
        <Contato />
      </main>
      <Rodape />
    </>
  );
}

export default App;
