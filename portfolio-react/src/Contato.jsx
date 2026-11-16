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
    <section className="contato" aria-labelledby="titulo-contato">
      <h2 id="titulo-contato">Contato</h2>
      <p id="ajuda-contato">Demonstração local. Os dados não são enviados nem armazenados.</p>
      <form onSubmit={enviar} aria-describedby="ajuda-contato">
        <label htmlFor="nome">Seu nome</label>
        <input id="nome" name="nome" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} />
        <label htmlFor="email">Seu e-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="mensagem">Sua mensagem</label>
        <textarea id="mensagem" name="mensagem" rows={5} value={mensagem} onChange={(e) => setMensagem(e.target.value)} aria-describedby="contador-mensagem" />
        <p id="contador-mensagem">Olá, {nome}! Sua mensagem tem {mensagem.length} caracteres.</p>
        <button type="submit" disabled={!nome.trim()}>Enviar</button>
      </form>
      <p className="aviso" role="status">{aviso}</p>
    </section>
  );
}

export default Contato;
