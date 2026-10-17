const express = require('express');
const controller = require('../controllers/cursoController');

const router = express.Router();

router.get('/', controller.listar);          // GET    /cursos
router.get('/:id', controller.obter);        // GET    /cursos/:id
router.post('/', controller.criar);          // POST   /cursos
router.put('/:id', controller.atualizar);    // PUT    /cursos/:id
router.delete('/:id', controller.apagar);    // DELETE /cursos/:id

module.exports = router;