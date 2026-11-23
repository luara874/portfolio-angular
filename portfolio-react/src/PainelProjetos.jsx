import { useEffect, useRef, useState } from 'react';
import API, { mensagemDaApi } from './api.js';
import FormularioProjeto from './FormularioProjeto.jsx';

function PainelProjetos({ token, onSessaoInvalida }) {
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [revisao, setRevisao] = useState(0);
  const [erroLista, setErroLista] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [projetoEmEdicao, setProjetoEmEdicao] = useState(null);
  const escrita = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function listar() {
      try {
        const resposta = await fetch(API + '/api/projetos/todos', {
          headers: { Authorization: 'Bearer ' + token },
          signal: controller.signal,
        });
        if (!resposta.ok) {
          const motivo = await mensagemDaApi(resposta);
          if (resposta.status === 401 && !controller.signal.aborted) {
            onSessaoInvalida('Sua sessão terminou. ' + motivo);
            return;
          }
          throw new Error(motivo);
        }
        const dados = await resposta.json();
        if (!Array.isArray(dados)) throw new Error('A API não retornou uma lista válida.');
        if (!controller.signal.aborted) setProjetos(dados);
      } catch (falha) {
        if (!controller.signal.aborted) {
          const motivo = falha instanceof TypeError ? 'Não foi possível conectar à API.' : falha.message;
          setErroLista('Não deu para carregar os projetos da gestão. ' + motivo);
        }
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    listar();
    return () => controller.abort();
  }, [token, revisao, onSessaoInvalida]);

  useEffect(() => () => escrita.current?.abort(), []);

  function atualizarLista() {
    setCarregando(true);
    setErroLista('');
    setRevisao((anterior) => anterior + 1);
  }

  async function escreverProjeto({ metodo, id, dados, sucesso }) {
    if (escrita.current) return false;
    const controller = new AbortController();
    escrita.current = controller;
    setOcupado(true);
    setErro('');
    setAviso('');

    try {
      const caminho = id == null ? '/api/projetos' : '/api/projetos/' + id;
      const headers = { Authorization: 'Bearer ' + token };
      if (dados) headers['Content-Type'] = 'application/json';
      const resposta = await fetch(API + caminho, {
        method: metodo,
        headers,
        body: dados && JSON.stringify(dados),
        signal: controller.signal,
      });
      if (!resposta.ok) {
        const motivo = await mensagemDaApi(resposta);
        if (resposta.status === 401 && !controller.signal.aborted) {
          onSessaoInvalida('Sua sessão terminou. ' + motivo);
          return false;
        }
        throw new Error(motivo);
      }
      if (controller.signal.aborted) return false;

      setAviso(sucesso);
      atualizarLista();
      return true;
    } catch (falha) {
      if (!controller.signal.aborted) {
        const motivo = falha instanceof TypeError ? 'Não foi possível conectar à API.' : falha.message;
        setErro((metodo === 'DELETE' ? 'Não deu para excluir. ' : 'Não deu para salvar. ') + motivo);
      }
      return false;
    } finally {
      escrita.current = null;
      if (!controller.signal.aborted) setOcupado(false);
    }
  }

  function editar(projeto) {
    setErro('');
    setAviso('');
    setProjetoEmEdicao(projeto);
  }

  async function salvar(dados) {
    if (!projetoEmEdicao) {
      return escreverProjeto({ metodo: 'POST', dados, sucesso: 'Projeto cadastrado.' });
    }

    const salvo = await escreverProjeto({
      metodo: 'PUT',
      id: projetoEmEdicao.id,
      dados,
      sucesso: 'Projeto atualizado.',
    });
    if (salvo) setProjetoEmEdicao(null);
    return salvo;
  }

  async function excluir(projeto) {
    if (!window.confirm(`Excluir “${projeto.nome}”?`)) return;
    const excluido = await escreverProjeto({ metodo: 'DELETE', id: projeto.id, sucesso: 'Projeto excluído.' });
    if (excluido && projetoEmEdicao?.id === projeto.id) setProjetoEmEdicao(null);
  }

  return (
    <>
      <FormularioProjeto
        key={projetoEmEdicao?.id ?? 'novo'}
        projeto={projetoEmEdicao}
        ocupado={ocupado}
        onSalvar={salvar}
        onCancelar={() => setProjetoEmEdicao(null)}
      />
      {aviso && <p className="aviso" role="status">{aviso}</p>}
      {erro && <p className="erro estado" role="alert">{erro}</p>}

      <section className="gestao-projetos" aria-labelledby="titulo-lista-gestao">
        <div className="cabecalho-secao">
          <h2 id="titulo-lista-gestao">Projetos cadastrados</h2>
          <button className="atualizar" type="button" onClick={atualizarLista} disabled={carregando || ocupado}>Atualizar</button>
        </div>
        {carregando && <p className="estado" role="status">Carregando projetos da gestão...</p>}
        {erroLista && <p className="erro estado" role="alert">{erroLista}</p>}
        {!carregando && !erroLista && projetos.length === 0 && (
          <p className="estado vazio" role="status">Nenhum projeto cadastrado ainda.</p>
        )}
        {!carregando && !erroLista && projetos.length > 0 && (
          <ul className="gestao-lista">
            {projetos.map((projeto) => (
              <li key={projeto.id}>
                <div className="gestao-item">
                  <h3>{projeto.nome}</h3>
                  <p>{projeto.ano} · {projeto.status}</p>
                </div>
                <div className="gestao-acoes">
                  <button type="button" className="atualizar" onClick={() => editar(projeto)} disabled={ocupado}>Editar</button>
                  <button type="button" className="atualizar" onClick={() => excluir(projeto)} disabled={ocupado}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default PainelProjetos;
