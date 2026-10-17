const Aluno = require('../models/Aluno');
const Curso = require('../models/Curso');
const { tratarErro } = require('./erros');

// Só aceita estes campos do corpo do pedido: ignora qualquer outro (ex: "id")
function camposDoAluno(body = {}) {
  const { nome, apelido, idCurso, anoCurricular, idade } = body;
  return { nome, apelido, idCurso, anoCurricular, idade };
}

// Verifica se o curso existe. Se o idCurso não vier, deixa passar: é a validação do modelo que responde "o curso é obrigatório".
async function cursoValido(idCurso) {
  if (!idCurso) return true;
  return (await Curso.exists({ _id: idCurso })) !== null;
}

// GET /alunos
exports.listar = async (req, res) => {
  try {
    const alunos = await Aluno.find().sort({ _id: 1 });
    res.json(alunos);
  } catch (erro) {
    tratarErro(res, erro);
  }
};

// GET /alunos/:id
exports.obter = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });
    res.json(aluno);
  } catch (erro) {
    tratarErro(res, erro);
  }
};

// POST /alunos
exports.criar = async (req, res) => {
  try {
    const campos = camposDoAluno(req.body);
    if (!(await cursoValido(campos.idCurso))) {
      return res.status(400).json({ erro: 'O curso indicado não existe' });
    }
    const aluno = await Aluno.create(campos);
    res.status(201).json(aluno);
  } catch (erro) {
    tratarErro(res, erro);
  }
};

// PUT /alunos/:id  (substitui o aluno: têm de vir todos os campos)
exports.atualizar = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });

    const campos = camposDoAluno(req.body);
    if (!(await cursoValido(campos.idCurso))) {
      return res.status(400).json({ erro: 'O curso indicado não existe' });
    }

    aluno.set(campos);
    await aluno.save(); 
    res.json(aluno);
  } catch (erro) {
    tratarErro(res, erro);
  }
};

// DELETE /alunos/:id
exports.apagar = async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });
    res.status(204).send(); // 204 = feito, sem corpo na resposta
  } catch (erro) {
    tratarErro(res, erro);
  }
};