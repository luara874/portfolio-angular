import { Link } from 'react-router-dom';

function NaoEncontrada() {
  return (
    <section className="formulario-painel pagina-ausente" aria-labelledby="titulo-nao-encontrada">
      <h1 id="titulo-nao-encontrada">Página não encontrada</h1>
      <p>Esse endereço não existe no portfólio da Luara.</p>
      <Link className="link-destaque" to="/">Voltar para o Início</Link>
    </section>
  );
}

export default NaoEncontrada;
