# API de Alunos e Cursos

Atividade Prática #1: Consumo e Implementação de APIs RESTful (Node.js, Express, MongoDB Atlas, JSON-Server, Fetch API e Swagger).

O enunciado original está na pasta [`enunciado/`](enunciado/).

## Links

| | URL |
|---|---|
| Front-end | https://alunos-frontend.onrender.com |
| API | https://api-alunos-restful.onrender.com |
| Documentação Swagger | https://api-alunos-restful.onrender.com/api-docs |

> A API e o front-end estão no plano gratuito do Render. O serviço da API **adormece após 15 minutos sem pedidos**, por isso o primeiro acesso pode demorar cerca de 1 minuto. Se a tabela aparecer vazia, esperar e recarregar a página.

## Estrutura do projeto

```
frontend/      Interface web (HTML, CSS e JavaScript com Fetch API)
backend/       API RESTful (Node.js, Express e MongoDB Atlas com Mongoose)
  models/        Modelos Mongoose (Aluno, Curso) e regras de validação
  controllers/   Lógica de cada endpoint
  routes/        Ligação entre URLs e controladores
  docs/          Documentação OpenAPI para o Swagger
  scripts/       Script de migração do bd.json para o Atlas
mock-server/   JSON-Server configurado
mock-data/     Base de dados JSON original (bd.json)
tests/         Coleção Postman da API simulada
enunciado/     Enunciado do trabalho
```

## Como correr localmente

Requisitos: Node.js e npm.

### API simulada (json-server)

```
cd mock-server
npm install
npm start
```

Fica em http://localhost:3003 (API em `/alunos` e `/cursos`; a pasta `frontend` é servida na raiz).

### API real (Express + MongoDB Atlas)

```
cd backend
npm install
```

Criar o ficheiro `backend/.env` (modelo em `backend/.env.example`) com a ligação ao Atlas:

```
MONGODB_URI=mongodb+srv://UTILIZADOR:PASSWORD@CLUSTER.mongodb.net/academicos
PORT=4000
```

Arrancar:

```
npm run dev
```

A API e o front-end ficam em http://localhost:4000 e o Swagger em http://localhost:4000/api-docs.

Para carregar os dados de `mock-data/bd.json` para uma base vazia: `npm run migrar`. **Atenção:** este script apaga e recria as coleções `alunos` e `cursos`.

## Endpoints

| Método | URL | Descrição | Respostas |
|---|---|---|---|
| GET | `/alunos` | Listar alunos | 200 |
| GET | `/alunos/:id` | Obter um aluno | 200, 400, 404 |
| POST | `/alunos` | Criar aluno | 201, 400 |
| PUT | `/alunos/:id` | Substituir aluno | 200, 400, 404 |
| DELETE | `/alunos/:id` | Apagar aluno | 204, 400, 404 |
| GET | `/cursos` | Listar cursos | 200 |
| GET | `/cursos/:id` | Obter um curso | 200, 400, 404 |
| POST | `/cursos` | Criar curso | 201, 400, 409 |
| PUT | `/cursos/:id` | Atualizar curso | 200, 400, 404, 409 |
| DELETE | `/cursos/:id` | Apagar curso | 204, 400, 404, 409 |

## Notas

- **Validação no servidor:** `anoCurricular` entre 1 e 3, `idade` entre 15 e 100, ambos inteiros; `nome`, `apelido` e `idCurso` obrigatórios; o `idCurso` tem de ser de um curso existente.
- **Cursos:** o nome é único (409 se repetido) e um curso com alunos associados não pode ser apagado (409).
- **Ids:** no MongoDB são texto (`ObjectId`). A API devolve `id` em vez de `_id`.
- **Arquitetura:** MVC com Mongoose (models, controllers e routes).
- **Testes:** `tests/postman-collection.json` cobre a API simulada (CRUD de alunos e leitura de cursos).
- **Front-end:** a versão final está preparada para a API real. Em `localhost` usa o servidor local e noutro endereço usa a API no Render.

## Utilização de IA

Foi utilizada inteligência artificial (Claude, da Anthropic) neste trabalho: para gerar/corrigir código, fornecer orientação na configuração das ferramentas e para explicação de conceitos.
