const Aluno = require('../models/Aluno');
const Curso = require('../models/Curso');
const { tratarErro } = require('./erros');

function camposDoAluno(body = {}) {
  const { nome, apelido, idCurso, anoCurricular, idade } = body;
  return { nome, apelido, idCurso, anoCurricular, idade };
}

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

// PUT /alunos/:id  
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
    res.status(204).send(); 
  } catch (erro) {
    tratarErro(res, erro);
  }
};