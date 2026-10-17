// API real a ser implementada
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares: correm em todos os pedidos, antes das rotas
app.use(cors());          // deixa o front-end, noutro endereço, fazer pedidos a esta API
app.use(express.json());  // converte o JSON do corpo do pedido em req.body

// Rota de teste: confirma que a API está viva
app.get('/saude', (req, res) => {
  res.json({ mensagem: 'API de Alunos a funcionar' });
});

// Serve também a página (pasta ../frontend) para testar tudo no mesmo endereço.
// Se a pasta não existir (por exemplo, num deploy só do backend), ignora.
const pastaFrontend = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(pastaFrontend)) {
  app.use(express.static(pastaFrontend));
}

// Rotas da API: tudo o que começa por /alunos ou /cursos vai para o router respetivo
app.use('/alunos', require('./routes/alunoRoutes'));
app.use('/cursos', require('./routes/cursoRoutes'));

// Rota inexistente: responde em JSON em vez da página HTML por defeito do Express
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Último middleware: apanha erros que ninguém tratou (ex.: JSON mal formado no corpo)
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