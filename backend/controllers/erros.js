// Converte erros do mongoose/MongoDB na resposta HTTP adequada
function tratarErro(res, erro) {
  // Falhou uma regra do modelo (campo em falta, ano fora de 1-3, etc.)
  if (erro.name === 'ValidationError') {
    const detalhes = Object.values(erro.errors).map((e) => e.message);
    return res.status(400).json({ erro: 'Dados inválidos', detalhes });
  }
  // Id com formato inválido 
  if (erro.name === 'CastError') {
    return res.status(400).json({ erro: 'Id inválido' });
  }
  // Violação de "unique" (ex: dois cursos com o mesmo nome)
  if (erro.code === 11000) {
    return res.status(409).json({ erro: 'Já existe um registo com esse valor' });
  }
  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = { tratarErro };