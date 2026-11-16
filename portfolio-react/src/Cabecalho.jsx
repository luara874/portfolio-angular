function Cabecalho() {
  return (
    <>
      <a className="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>
      <header className="cabecalho">
        <div className="cabecalho-interno">
          <a className="marca" href="#inicio" aria-label="Portfólio da Luara — início">luara<span aria-hidden="true">_</span><small>portfólio</small></a>
          <nav aria-label="Navegação principal">
            <a href="#inicio">Início</a>
            <a href="#sobre">Sobre</a>
            <a href="#projetos">Projetos</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#contato">Contato</a>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Cabecalho;
