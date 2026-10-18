
function tratarErro(res, erro) {
  if (erro.name === 'ValidationError') {
    const detalhes = Object.values(erro.errors).map((e) => e.message);
    return res.status(400).json({ erro: 'Dados inválidos', detalhes });
  }
  
  if (erro.name === 'CastError') {
    return res.status(400).json({ erro: 'Id inválido' });
  }
  
  if (erro.code === 11000) {
    return res.status(409).json({ erro: 'Já existe um registo com esse valor' });
  }
  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = { tratarErro };