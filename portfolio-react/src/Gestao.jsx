import { useCallback, useState } from 'react';
import API, { mensagemDaApi } from './api.js';
import PainelProjetos from './PainelProjetos.jsx';

const CHAVE_TOKEN = 'token';

function Gestao() {
  const [token, setToken] = useState(() => localStorage.getItem(CHAVE_TOKEN) ?? '');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState('');

  async function entrar(evento) {
    evento.preventDefault();
    setErro('');
    setEntrando(true);
    try {
      const resposta = await fetch(API + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), senha }),
      });
      if (!resposta.ok) throw new Error(await mensagemDaApi(resposta));
      const dados = await resposta.json();
      if (typeof dados.token !== 'string' || !dados.token) {
        throw new Error('A API não devolveu um token.');
      }

      localStorage.setItem(CHAVE_TOKEN, dados.token);
      setToken(dados.token);
      setSenha('');
    } catch (falha) {
      const motivo = falha instanceof TypeError ? 'Não foi possível conectar à API.' : falha.message;
      setErro('Não deu para entrar. ' + motivo);
    } finally {
      setEntrando(false);
    }
  }

  const sair = useCallback((aviso = '') => {
    localStorage.removeItem(CHAVE_TOKEN);
    setToken('');
    setErro(aviso);
  }, []);

  return (
    <section className="gestao" aria-labelledby="titulo-gestao">
      <div className="cabecalho-secao">
        <h1 id="titulo-gestao">Gestão</h1>
        {token && <button type="button" className="atualizar" onClick={() => sair()}>Sair</button>}
      </div>
      {token ? (
        <PainelProjetos token={token} onSessaoInvalida={sair} />
      ) : (
        <form className="formulario-painel gestao-login" onSubmit={entrar}>
          <div className="campo">
            <label htmlFor="login-email">E-mail</label>
            <input id="login-email" name="email" type="email" autoComplete="username" required value={email} onChange={(evento) => setEmail(evento.target.value)} />
          </div>
          <div className="campo">
            <label htmlFor="login-senha">Senha</label>
            <input id="login-senha" name="senha" type="password" autoComplete="current-password" required value={senha} onChange={(evento) => setSenha(evento.target.value)} />
          </div>
          <button type="submit" disabled={entrando}>{entrando ? 'Entrando…' : 'Entrar'}</button>
          {erro && <p className="erro estado" role="alert">{erro}</p>}
        </form>
      )}
    </section>
  );
}

export default Gestao;
