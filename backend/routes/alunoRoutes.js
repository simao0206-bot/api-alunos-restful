const express = require('express');
const controller = require('../controllers/alunoController');

const router = express.Router();

router.get('/', controller.listar);          // GET    /alunos
router.get('/:id', controller.obter);        // GET    /alunos/:id
router.post('/', controller.criar);          // POST   /alunos
router.put('/:id', controller.atualizar);    // PUT    /alunos/:id
router.delete('/:id', controller.apagar);    // DELETE /alunos/:id

module.exports = router;