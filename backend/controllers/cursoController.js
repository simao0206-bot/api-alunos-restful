const Aluno = require('../models/Aluno');
const Curso = require('../models/Curso');
const { tratarErro } = require('./erros');

function camposDoCurso(body = {}) {
  const { nomeDoCurso } = body;
  return { nomeDoCurso };
}

// GET /cursos
exports.listar = async (req, res) => {
  try {
    const cursos = await Curso.find().sort({ _id: 1 });
    res.json(cursos);
  } catch (erro) {
    tratarErro(res, erro);
  }
};

// GET /cursos/:id
exports.obter = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ erro: 'Curso não encontrado' });
    res.json(curso);
  } catch (erro) {
    tratarErro(res, erro);
  }
};

// POST /cursos
exports.criar = async (req, res) => {
  try {
    const curso = await Curso.create(camposDoCurso(req.body));
    res.status(201).json(curso);
  } catch (erro) {
    tratarErro(res, erro);
  }
};

// PUT /cursos/:id
exports.atualizar = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ erro: 'Curso não encontrado' });

    curso.set(camposDoCurso(req.body));
    await curso.save();
    res.json(curso);
  } catch (erro) {
    tratarErro(res, erro);
  }
};

// DELETE /cursos/:id  (recusa se ainda houver alunos nesse curso)
exports.apagar = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ erro: 'Curso não encontrado' });

    const emUso = await Aluno.countDocuments({ idCurso: curso._id });
    if (emUso > 0) {
      return res.status(409).json({ erro: `O curso tem ${emUso} aluno(s) associado(s)` });
    }

    await curso.deleteOne();
    res.status(204).send();
  } catch (erro) {
    tratarErro(res, erro);
  }
};