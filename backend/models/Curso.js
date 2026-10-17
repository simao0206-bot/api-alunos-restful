const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema(
  {
    nomeDoCurso: {
      type: String,
      required: [true, 'O nome do curso é obrigatório'],
      trim: true,
      unique: true
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

module.exports = mongoose.model('Curso', cursoSchema);