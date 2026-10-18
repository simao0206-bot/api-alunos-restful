const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(cors());          
app.use(express.json());  

// Documentação Swagger 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/saude', (req, res) => {
  res.json({ mensagem: 'API de Alunos a funcionar' });
});

const pastaFrontend = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(pastaFrontend)) {
  app.use(express.static(pastaFrontend));
}

// Rotas da API
app.use('/alunos', require('./routes/alunoRoutes'));
app.use('/cursos', require('./routes/cursoRoutes'));

// Respostas para Rotas inexistentes
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento de erros
app.use((erro, req, res, next) => {
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo do pedido' });
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 4000;

async function iniciar() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Falta MONGODB_URI (ficheiro backend/.env ou variável de ambiente)');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Ligado ao MongoDB Atlas');

  app.listen(PORT, () => {
    console.log(`API a correr em http://localhost:${PORT}`);
  });
}

iniciar().catch((erro) => {
  console.error('Erro ao arrancar a API:', erro.message);
  process.exit(1);
});