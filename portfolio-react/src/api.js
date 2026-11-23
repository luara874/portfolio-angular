// Endereço público da porta 3000 da API Node da Luara.
const API = (import.meta.env.VITE_API_URL || 'https://ubiquitous-giggle-pjvxx4xv4x653rw6v-3000.app.github.dev').replace(/\/+$/, '');

export async function mensagemDaApi(resposta) {
  const dados = await resposta.json().catch(() => null);
  return dados?.erro || `A API respondeu com HTTP ${resposta.status}.`;
}

export default API;
