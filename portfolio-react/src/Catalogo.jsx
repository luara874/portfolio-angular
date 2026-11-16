import { useEffect, useState } from 'react';
import API from './api.js';

function Catalogo() {
  const [tecnologias, setTecnologias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function buscarTecnologias() {
      try {
        const resposta = await fetch(API + '/api/tecnologias', { signal: controller.signal });
        if (!resposta.ok) throw new Error('a API respondeu ' + resposta.status);
        const dados = await resposta.json();
        if (!Array.isArray(dados)) throw new Error('a API não retornou uma lista válida');
        if (!controller.signal.aborted) setTecnologias(dados);
      } catch (falha) {
        if (!controller.signal.aborted) {
          setErro('Não deu para carregar o catálogo: ' + (falha instanceof TypeError ? 'não foi possível conectar à API.' : falha.message));
        }
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    buscarTecnologias();
    return () => controller.abort();
  }, []);

  return (
    <section className="catalogo" id="catalogo" aria-labelledby="titulo-catalogo">
      <div className="cabecalho-secao">
        <div><p className="sobretitulo">Ferramentas e linguagens</p><h2 id="titulo-catalogo">Catálogo de tecnologias</h2></div>
        {!carregando && !erro && <p className="total-tecnologias">{tecnologias.length} tecnologias</p>}
      </div>
      {carregando && <p className="estado" role="status">Carregando catálogo...</p>}
      {erro && <p className="erro estado" role="alert">{erro}</p>}
      {!carregando && !erro && tecnologias.length === 0 && <p className="estado vazio">Nenhuma tecnologia cadastrada ainda</p>}
      <ul className="tecnologias" aria-busy={carregando}>
        {tecnologias.map((t) => (
          <li key={t.id}>
            <div className="tecnologia-titulo"><strong>{t.nome}</strong><span>{t.categoria}</span></div>
            {t.descricao && <p>{t.descricao}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Catalogo;
