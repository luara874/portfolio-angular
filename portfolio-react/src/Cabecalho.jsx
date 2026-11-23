import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Cabecalho() {
  const { key, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [key, hash]);

  return (
    <>
      <a className="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>
      <header className="cabecalho">
        <div className="cabecalho-interno">
          <Link className="marca" to="/" aria-label="Portfólio da Luara — início">luara<span aria-hidden="true">_</span><small>portfólio</small></Link>
          <nav aria-label="Navegação principal">
            <Link to="/">Início</Link>
            <Link to="/#sobre">Sobre</Link>
            <Link to="/#projetos">Projetos</Link>
            <Link to="/#catalogo">Catálogo</Link>
            <Link to="/#contato">Contato</Link>
            <Link to="/gestao">Gestão</Link>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Cabecalho;
