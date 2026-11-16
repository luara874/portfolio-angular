import { useState } from 'react';

function Contato() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [aviso, setAviso] = useState('');

  function enviar(e) {
    e.preventDefault();
    if (!nome.trim()) return;

    // Capture os valores antes de limpar. Esta demonstração não envia dados.
    setAviso(`Obrigado, ${nome}! Mensagem com ${mensagem.length} caracteres, pronta para envio. Demonstração local: nada foi enviado.`);
    setNome('');
    setEmail('');
    setMensagem('');
  }

  return (
    <section className="contato" id="contato" aria-labelledby="titulo-contato">
      <div className="contato-intro">
        <p className="sobretitulo">Formulário de demonstração</p>
        <h2 id="titulo-contato">Contato</h2>
        <p>Escreva uma mensagem e experimente o formulário.</p>
        <p className="nota-local" id="ajuda-contato">Demonstração local. Os dados não são enviados nem armazenados.</p>
      </div>
      <div className="formulario-painel">
        <form onSubmit={enviar} aria-describedby="ajuda-contato">
          <div className="formulario-linha">
            <div className="campo">
              <label htmlFor="nome">Seu nome</label>
              <input id="nome" name="nome" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="campo">
              <label htmlFor="email">Seu e-mail</label>
              <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="campo">
            <label htmlFor="mensagem">Sua mensagem</label>
            <textarea id="mensagem" name="mensagem" rows={5} value={mensagem} onChange={(e) => setMensagem(e.target.value)} aria-describedby="contador-mensagem" />
          </div>
          <p className="contador" id="contador-mensagem">Olá, {nome}! Sua mensagem tem {mensagem.length} caracteres.</p>
          <button type="submit" disabled={!nome.trim()}>Enviar <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12 12 4M4 4h8v8" /></svg></button>
        </form>
        <p className="aviso" role="status">{aviso}</p>
      </div>
    </section>
  );
}

export default Contato;
