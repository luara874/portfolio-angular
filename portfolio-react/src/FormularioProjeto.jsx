import { useEffect, useRef, useState } from 'react';

const projetoVazio = { nome: '', descricao: '', tecnologias: '', ano: '', link_github: '' };

function FormularioProjeto({ projeto, ocupado, onSalvar, onCancelar }) {
  const [campos, setCampos] = useState(() => projeto ? {
    nome: projeto.nome,
    descricao: projeto.descricao ?? '',
    tecnologias: projeto.tecnologias ?? '',
    ano: projeto.ano ?? '',
    link_github: projeto.link_github ?? '',
  } : projetoVazio);
  const campoNome = useRef(null);

  useEffect(() => {
    if (projeto) campoNome.current?.focus();
  }, [projeto]);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setCampos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  async function salvar(evento) {
    evento.preventDefault();
    const salvo = await onSalvar({ ...campos, nome: campos.nome.trim(), ano: Number(campos.ano) });
    if (salvo && !projeto) setCampos(projetoVazio);
  }

  return (
    <form className="formulario-painel gestao-formulario" onSubmit={salvar}>
      <h2>{projeto ? 'Editar projeto' : 'Novo projeto'}</h2>
      <fieldset disabled={ocupado} aria-label="Dados do projeto">
        <div className="campo">
          <label htmlFor="projeto-nome">Nome</label>
          <input id="projeto-nome" name="nome" required maxLength={120} value={campos.nome} onChange={alterarCampo} ref={campoNome} />
        </div>
        <div className="campo">
          <label htmlFor="projeto-descricao">Descrição</label>
          <textarea id="projeto-descricao" name="descricao" rows={4} value={campos.descricao} onChange={alterarCampo} />
        </div>
        <div className="formulario-linha">
          <div className="campo">
            <label htmlFor="projeto-tecnologias">Tecnologias</label>
            <input id="projeto-tecnologias" name="tecnologias" maxLength={200} value={campos.tecnologias} onChange={alterarCampo} />
          </div>
          <div className="campo">
            <label htmlFor="projeto-ano">Ano</label>
            <input id="projeto-ano" name="ano" type="number" min={Number(campos.ano) === 0 ? 0 : 1901} max={2155} required value={campos.ano} onChange={alterarCampo} />
          </div>
        </div>
        <div className="campo">
          <label htmlFor="projeto-link">Link do GitHub</label>
          <input id="projeto-link" name="link_github" type="url" maxLength={300} value={campos.link_github} onChange={alterarCampo} />
        </div>
        <div className="gestao-acoes">
          <button type="submit" disabled={!campos.nome.trim()}>Salvar</button>
          {projeto && <button type="button" className="atualizar" onClick={onCancelar}>Cancelar edição</button>}
        </div>
      </fieldset>
    </form>
  );
}

export default FormularioProjeto;
