const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Aluno = require('../models/Aluno');
const Curso = require('../models/Curso');
const dados = require('../../mock-data/bd.json');

async function migrar() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Falta MONGODB_URI no ficheiro backend/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Ligado ao Atlas');

  // Limpa as coleções para a migração poder ser repetida sem duplicar dados
  await Aluno.deleteMany({});
  await Curso.deleteMany({});

  // Cursos: guarda a correspondência id antigo (número) -> id novo (ObjectId)
  const mapaCursos = new Map();
  for (const c of dados.cursos) {
    const criado = await Curso.create({ nomeDoCurso: c.nomeDoCurso });
    mapaCursos.set(c.id, criado._id);
  }

  // Alunos: troca o idCurso antigo pelo ObjectId do curso correspondente
  for (const a of dados.alunos) {
    const idCurso = mapaCursos.get(a.idCurso);
    if (!idCurso) {
      throw new Error(`O aluno ${a.nome} aponta para um curso que não existe (idCurso ${a.idCurso})`);
    }
    await Aluno.create({
      nome: a.nome,
      apelido: a.apelido,
      idCurso,
      anoCurricular: a.anoCurricular,
      idade: a.idade
    });
  }

  console.log(`Migração concluída: ${await Curso.countDocuments()} cursos e ${await Aluno.countDocuments()} alunos`);
  await mongoose.disconnect();
}

migrar().catch(async (erro) => {
  console.error('Erro na migração:', erro.message);
  await mongoose.disconnect();
  process.exit(1);
});