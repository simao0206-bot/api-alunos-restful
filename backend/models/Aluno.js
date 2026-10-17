const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      trim: true
    },
    apelido: {
      type: String,
      required: [true, 'O apelido é obrigatório'],
      trim: true
    },
    
    idCurso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curso',
      required: [true, 'O curso é obrigatório']
    },
    anoCurricular: {
      type: Number,
      required: [true, 'O ano curricular é obrigatório'],
      min: [1, 'O ano curricular mínimo é 1'],
      max: [3, 'O ano curricular máximo é 3'],
      validate: { validator: Number.isInteger, message: 'O ano curricular tem de ser um número inteiro' }
    },
    idade: {
      type: Number,
      required: [true, 'A idade é obrigatória'],
      min: [15, 'A idade mínima é 15'],
      max: [100, 'A idade máxima é 100'],
      validate: { validator: Number.isInteger, message: 'A idade tem de ser um número inteiro' }
    }
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret._id;
      }
    }
  }
);

module.exports = mongoose.model('Aluno', alunoSchema);