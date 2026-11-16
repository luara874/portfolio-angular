import Cabecalho from './Cabecalho.jsx';
import CardProjeto from './CardProjeto.jsx';
import Contato from './Contato.jsx';
import Rodape from './Rodape.jsx';
import { useEffect, useState } from 'react';
import API from './api.js';
import Catalogo from './Catalogo.jsx';

// Busca somente os dados; o componente controla a apresentação de cada pedido.
async function buscarProjetos(signal) {
  const resposta = await fetch(API + '/api/projetos', { signal });
  if (!resposta.ok) throw new Error('a API respondeu ' + resposta.status);
  const dados = await resposta.json();
  if (!Array.isArray(dados)) throw new Error('a API não retornou uma lista válida');
  return dados;
}

function mensagemDeErro(falha) {
  return 'Não deu para carregar os projetos: ' + (falha instanceof TypeError ? 'não foi possível conectar à API.' : falha.message);
}

function App() {
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function atualizarProjetos() {
    setCarregando(true);
    setErro('');
    setProjetos([]);
    try {
      setProjetos(await buscarProjetos());
    } catch (falha) {
      setErro(mensagemDeErro(falha));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    buscarProjetos(controller.signal)
      .then((dados) => { if (!controller.signal.aborted) setProjetos(dados); })
      .catch((falha) => { if (!controller.signal.aborted) setErro(mensagemDeErro(falha)); })
      .finally(() => { if (!controller.signal.aborted) setCarregando(false); });
    return () => controller.abort();
  }, []);

  return (
    <>
      <Cabecalho />
      <main id="conteudo" tabIndex={-1}>
        <section className="apresentacao" id="inicio" aria-labelledby="titulo-inicio">
          <div className="apresentacao-faixa">
            <p className="sobretitulo">Portfólio pessoal / IFPR</p>
            <span>Desenvolvimento de software</span>
          </div>
          <div className="apresentacao-corpo">
            <div>
              <h1 id="titulo-inicio">Luara Munkemer <span>Fornazari</span></h1>
              <p className="introducao">Projetos, trajetória e aprendizado em desenvolvimento de software.</p>
              <a className="link-destaque" href="#projetos">Explorar projetos <span aria-hidden="true">↓</span></a>
            </div>
            <aside className="sobre" id="sobre" aria-labelledby="titulo-sobre">
              <h2 id="titulo-sobre">Sobre mim</h2>
              <dl>
                <div><dt>Formação</dt><dd>Técnico em Informática</dd></div>
                <div><dt>Instituição</dt><dd>IFPR</dd></div>
              </dl>
              <p>Estudante de HTML, CSS, TypeScript, Angular e lógica de programação.</p>
            </aside>
          </div>
        </section>

        <section className="projetos" id="projetos" aria-labelledby="titulo-projetos">
          <div className="cabecalho-secao">
            <div>
              <p className="sobretitulo">Projetos publicados</p>
              <h2 id="titulo-projetos">Projetos</h2>
            </div>
            <div className="acoes-projetos">
              {!carregando && !erro && <p className="total-projetos">{projetos.length} {projetos.length === 1 ? 'projeto' : 'projetos'}</p>}
              <button className="atualizar" type="button" onClick={atualizarProjetos} disabled={carregando}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 7a5 5 0 1 0-1 4M13 2v5H8" /></svg>Atualizar</button>
            </div>
          </div>
          {carregando && <p className="estado" role="status">Carregando projetos...</p>}
          {erro && <p className="erro estado" role="alert">{erro}</p>}
          {!carregando && !erro && projetos.length === 0 && <p className="estado vazio">Nenhum projeto publicado ainda</p>}
          <div className="cards" aria-busy={carregando}>
            {projetos.map((p) => (
              <CardProjeto key={p.id} projeto={p} />
            ))}
          </div>
        </section>
        <Catalogo />
        <Contato />
      </main>
      <Rodape />
    </>
  );
}

export default App;
