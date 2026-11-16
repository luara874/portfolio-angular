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
            <div className="acoes-projetos">
              {!carregando && !erro && <p className="total-projetos">{projetos.length} {projetos.length === 1 ? 'projeto' : 'projetos'}</p>}
              <button className="atualizar" type="button" onClick={atualizarProjetos} disabled={carregando}>Atualizar</button>
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
