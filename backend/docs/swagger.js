const json = (esquema) => ({ 'application/json': { schema: esquema } });
const ref = (nome) => ({ $ref: `#/components/schemas/${nome}` });
const refResposta = (nome) => ({ $ref: `#/components/responses/${nome}` });

const parametroId = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Id do registo (ObjectId do MongoDB, 24 caracteres hexadecimais)',
  schema: { type: 'string', example: '6ad39f48855f74686e3b77d2' }
};

const camposAluno = {
  nome: { type: 'string', example: 'Joana' },
  apelido: { type: 'string', example: 'Silva' },
  idCurso: { type: 'string', description: 'Id de um curso existente', example: '6ad39f40855f74686e3b77c5' },
  anoCurricular: { type: 'integer', minimum: 1, maximum: 3, example: 2 },
  idade: { type: 'integer', minimum: 15, maximum: 100, example: 21 }
};

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'API de Alunos e Cursos',
    version: '1.0.0',
    description: 'API RESTful (Node.js, Express e MongoDB Atlas) para gerir alunos e cursos.'
  },
  
  servers: [{ url: '/', description: 'Servidor atual' }],
  tags: [
    { name: 'Alunos', description: 'Operações sobre alunos' },
    { name: 'Cursos', description: 'Operações sobre cursos' }
  ],

  paths: {
    '/alunos': {
      get: {
        tags: ['Alunos'],
        summary: 'Listar todos os alunos',
        responses: {
          200: { description: 'Lista de alunos', content: json({ type: 'array', items: ref('Aluno') }) },
          500: refResposta('ErroInterno')
        }
      },
      post: {
        tags: ['Alunos'],
        summary: 'Criar um aluno',
        requestBody: { required: true, content: json(ref('AlunoInput')) },
        responses: {
          201: { description: 'Aluno criado', content: json(ref('Aluno')) },
          400: refResposta('PedidoInvalido'),
          500: refResposta('ErroInterno')
        }
      }
    },

    '/alunos/{id}': {
      parameters: [parametroId],
      get: {
        tags: ['Alunos'],
        summary: 'Obter um aluno pelo id',
        responses: {
          200: { description: 'O aluno', content: json(ref('Aluno')) },
          400: refResposta('PedidoInvalido'),
          404: refResposta('NaoEncontrado'),
          500: refResposta('ErroInterno')
        }
      },
      put: {
        tags: ['Alunos'],
        summary: 'Substituir um aluno (têm de vir todos os campos)',
        requestBody: { required: true, content: json(ref('AlunoInput')) },
        responses: {
          200: { description: 'Aluno atualizado', content: json(ref('Aluno')) },
          400: refResposta('PedidoInvalido'),
          404: refResposta('NaoEncontrado'),
          500: refResposta('ErroInterno')
        }
      },
      delete: {
        tags: ['Alunos'],
        summary: 'Apagar um aluno',
        responses: {
          204: { description: 'Aluno apagado (a resposta não tem corpo)' },
          400: refResposta('PedidoInvalido'),
          404: refResposta('NaoEncontrado'),
          500: refResposta('ErroInterno')
        }
      }
    },

    '/cursos': {
      get: {
        tags: ['Cursos'],
        summary: 'Listar todos os cursos',
        responses: {
          200: { description: 'Lista de cursos', content: json({ type: 'array', items: ref('Curso') }) },
          500: refResposta('ErroInterno')
        }
      },
      post: {
        tags: ['Cursos'],
        summary: 'Criar um curso',
        requestBody: { required: true, content: json(ref('CursoInput')) },
        responses: {
          201: { description: 'Curso criado', content: json(ref('Curso')) },
          400: refResposta('PedidoInvalido'),
          409: refResposta('Conflito'),
          500: refResposta('ErroInterno')
        }
      }
    },

    '/cursos/{id}': {
      parameters: [parametroId],
      get: {
        tags: ['Cursos'],
        summary: 'Obter um curso pelo id',
        responses: {
          200: { description: 'O curso', content: json(ref('Curso')) },
          400: refResposta('PedidoInvalido'),
          404: refResposta('NaoEncontrado'),
          500: refResposta('ErroInterno')
        }
      },
      put: {
        tags: ['Cursos'],
        summary: 'Atualizar o nome de um curso',
        requestBody: { required: true, content: json(ref('CursoInput')) },
        responses: {
          200: { description: 'Curso atualizado', content: json(ref('Curso')) },
          400: refResposta('PedidoInvalido'),
          404: refResposta('NaoEncontrado'),
          409: refResposta('Conflito'),
          500: refResposta('ErroInterno')
        }
      },
      delete: {
        tags: ['Cursos'],
        summary: 'Apagar um curso (recusa se ainda tiver alunos)',
        responses: {
          204: { description: 'Curso apagado (a resposta não tem corpo)' },
          400: refResposta('PedidoInvalido'),
          404: refResposta('NaoEncontrado'),
          409: refResposta('Conflito'),
          500: refResposta('ErroInterno')
        }
      }
    }
  },

  components: {
    schemas: {
      Aluno: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6ad39f48855f74686e3b77d2' },
          ...camposAluno
        }
      },
      AlunoInput: {
        type: 'object',
        required: ['nome', 'apelido', 'idCurso', 'anoCurricular', 'idade'],
        properties: camposAluno
      },
      Curso: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6ad39f40855f74686e3b77c5' },
          nomeDoCurso: { type: 'string', example: 'Engenharia Informática' }
        }
      },
      CursoInput: {
        type: 'object',
        required: ['nomeDoCurso'],
        properties: {
          nomeDoCurso: { type: 'string', example: 'Engenharia Informática' }
        }
      },
      Erro: {
        type: 'object',
        properties: {
          erro: { type: 'string', example: 'Dados inválidos' },
          detalhes: { type: 'array', items: { type: 'string' }, example: ['O ano curricular máximo é 3'] }
        }
      }
    },
    // Respostas de erro 
    responses: {
      PedidoInvalido: {
        description: 'Pedido inválido: dados em falta ou fora dos limites, id mal formado ou curso inexistente',
        content: json(ref('Erro'))
      },
      NaoEncontrado: {
        description: 'Não existe nenhum registo com esse id',
        content: json(ref('Erro'))
      },
      Conflito: {
        description: 'Conflito: nome de curso repetido, ou curso que ainda tem alunos',
        content: json(ref('Erro'))
      },
      ErroInterno: {
        description: 'Erro interno do servidor',
        content: json(ref('Erro'))
      }
    }
  }
};