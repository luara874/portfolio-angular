function CardProjeto({ projeto }) {
  return (
    <article className="card">
      <div className="card-corpo">
        <p className="card-ano">{projeto.ano}</p>
        <h3>{projeto.nome}</h3>
        <p className="card-descricao">{projeto.descricao}</p>
      </div>
      <div className="card-detalhes">
        <p className="meta">{projeto.tecnologias}</p>
        {projeto.link_github && (
          <a href={projeto.link_github} target="_blank" rel="noopener noreferrer">
            Ver no GitHub <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12 12 4M4 4h8v8" /></svg>
          </a>
        )}
      </div>
    </article>
  );
}

export default CardProjeto;
