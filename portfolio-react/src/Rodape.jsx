import { Link } from 'react-router-dom';

function Rodape() {
  return (
    <footer>
      <div className="rodape-interno">
        <p>Luara Munkemer Fornazari · IFPR · 2026</p>
        <Link to="/#inicio">Voltar ao início ↑</Link>
      </div>
    </footer>
  );
}

export default Rodape;
