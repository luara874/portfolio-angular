function Cabecalho() {
  return (
    <>
      <a className="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>
      <header className="cabecalho">
        <div className="cabecalho-interno">
          <a className="marca" href="#inicio" aria-label="Portfólio da Luara — início">
            <span className="marca-sigla" aria-hidden="true">LM</span>
            <span>Luara<span className="marca-legenda">Portfólio</span></span>
          </a>
          <nav aria-label="Navegação principal">
            <a href="#inicio">Início</a>
            <a href="#sobre">Sobre</a>
            <a href="#projetos">Projetos</a>
            <a href="#contato">Contato</a>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Cabecalho;
