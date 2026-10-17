// Vazio = os pedidos vão para o mesmo servidor que serve esta página (a API em Express).
// Na Parte 5, se o front-end ficar noutro endereço, este valor passa a ser o URL da API.
const API_URL = '';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

// ---------- Elementos da página ----------
const tabelaAlunos = document.getElementById('tabela-alunos');
const formAluno = document.getElementById('form-aluno');
const tituloForm = document.getElementById('titulo-form');
const inputAlunoId = document.getElementById('aluno-id');
const inputNome = document.getElementById('nome');
const inputApelido = document.getElementById('apelido');
const selectCurso = document.getElementById('curso');
const inputAno = document.getElementById('ano');
const inputIdade = document.getElementById('idade');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');

const tabelaCursos = document.getElementById('tabela-cursos');
const formCurso = document.getElementById('form-curso');
const tituloFormCurso = document.getElementById('titulo-form-curso');
const inputCursoId = document.getElementById('curso-id');
const inputNomeCurso = document.getElementById('nome-curso');
const btnGuardarCurso = document.getElementById('btn-guardar-curso');
const btnCancelarCurso = document.getElementById('btn-cancelar-curso');

// ---------- Estado em memória ----------
let cursos = [];
let alunos = [];

// ---------- Utilitários ----------

// Faz o pedido à API e devolve o JSON. Se o servidor responder com erro,
// lança uma exceção com a mensagem que a própria API enviou.
async function pedir(url, opcoes) {
  const resposta = await fetch(`${API_URL}${url}`, opcoes);

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const corpo = await resposta.json();
      if (corpo.erro) mensagem = corpo.erro;
      if (corpo.detalhes) mensagem += `: ${corpo.detalhes.join('; ')}`;
    } catch {
      // a resposta não veio em JSON: fica a mensagem genérica
    }
    throw new Error(mensagem);
  }

  return resposta.status === 204 ? null : resposta.json(); // 204 = sem corpo
}

function criarBotao(texto, classe, aoClicar) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = texto;
  botao.className = `btn ${classe}`;
  botao.addEventListener('click', aoClicar);
  return botao;
}

function criarLinha(valores, ...botoes) {
  const linha = document.createElement('tr');
  for (const valor of valores) {
    const td = document.createElement('td');
    td.textContent = valor; // textContent: nunca interpreta o texto como HTML
    linha.appendChild(td);
  }
  const tdAcoes = document.createElement('td');
  botoes.forEach((b, i) => {
    if (i > 0) tdAcoes.append(' ');
    tdAcoes.append(b);
  });
  linha.appendChild(tdAcoes);
  return linha;
}

function linhaVazia(colunas, texto) {
  const linha = document.createElement('tr');
  const td = document.createElement('td');
  td.colSpan = colunas;
  td.className = 'vazio';
  td.textContent = texto;
  linha.appendChild(td);
  return linha;
}

function cursosOrdenados() {
  return [...cursos].sort((a, b) => a.nomeDoCurso.localeCompare(b.nomeDoCurso, 'pt'));
}

function nomeDoCurso(idCurso) {
  const curso = cursos.find(c => String(c.id) === String(idCurso));
  return curso ? curso.nomeDoCurso : 'Desconhecido';
}

// ---------- ALUNOS: desenhar ----------

function desenharSelectCursos() {
  const selecionado = selectCurso.value;
  selectCurso.innerHTML = '';
  for (const c of cursosOrdenados()) {
    const opcao = document.createElement('option');
    opcao.value = c.id;
    opcao.textContent = c.nomeDoCurso;
    selectCurso.appendChild(opcao);
  }
  if (selecionado) selectCurso.value = selecionado;
}

function desenharTabelaAlunos() {
  tabelaAlunos.innerHTML = '';
  if (alunos.length === 0) {
    tabelaAlunos.appendChild(linhaVazia(6, 'Ainda não há alunos.'));
    return;
  }
  for (const a of alunos) {
    tabelaAlunos.appendChild(criarLinha(
      [a.nome, a.apelido, nomeDoCurso(a.idCurso), a.anoCurricular, a.idade],
      criarBotao('Editar', 'btn-editar', () => iniciarEdicaoAluno(a)),
      criarBotao('Apagar', 'btn-apagar', () => apagarAluno(a))
    ));
  }
}

async function carregarAlunos() {
  alunos = await pedir('/alunos');
  desenharTabelaAlunos();
}

// ---------- ALUNOS: apagar / adicionar / editar ----------

async function apagarAluno(aluno) {
  if (!confirm(`Apagar o aluno ${aluno.nome} ${aluno.apelido}?`)) return;
  try {
    await pedir(`/alunos/${aluno.id}`, { method: 'DELETE' });
    await carregarAlunos();
  } catch (erro) {
    console.error(erro);
    alert(`Não foi possível apagar o aluno. ${erro.message}`);
  }
}

function iniciarEdicaoAluno(aluno) {
  inputAlunoId.value = aluno.id;
  inputNome.value = aluno.nome;
  inputApelido.value = aluno.apelido;
  selectCurso.value = aluno.idCurso;
  inputAno.value = aluno.anoCurricular;
  inputIdade.value = aluno.idade;

  tituloForm.textContent = 'Editar aluno';
  btnGuardar.textContent = 'Guardar';
  btnCancelar.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limparFormAluno() {
  formAluno.reset();
  inputAlunoId.value = '';
  tituloForm.textContent = 'Adicionar aluno';
  btnGuardar.textContent = 'Adicionar';
  btnCancelar.hidden = true;
}

btnCancelar.addEventListener('click', limparFormAluno);

// O mesmo formulário serve para criar (POST) e editar (PUT)
formAluno.addEventListener('submit', async (evento) => {
  evento.preventDefault(); // impede o browser de recarregar a página

  const id = inputAlunoId.value;
  const aluno = {
    nome: inputNome.value.trim(),
    apelido: inputApelido.value.trim(),
    idCurso: selectCurso.value, // texto: no MongoDB o id do curso é um ObjectId, não um número
    anoCurricular: Number(inputAno.value),
    idade: Number(inputIdade.value)
  };

  try {
    await pedir(id ? `/alunos/${id}` : '/alunos', {
      method: id ? 'PUT' : 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(aluno)
    });
    limparFormAluno();
    await carregarAlunos();
  } catch (erro) {
    console.error(erro);
    alert(`Não foi possível guardar o aluno. ${erro.message}`);
  }
});

// ---------- CURSOS: desenhar ----------

function desenharTabelaCursos() {
  tabelaCursos.innerHTML = '';
  if (cursos.length === 0) {
    tabelaCursos.appendChild(linhaVazia(2, 'Ainda não há cursos.'));
    return;
  }
  for (const c of cursosOrdenados()) {
    tabelaCursos.appendChild(criarLinha(
      [c.nomeDoCurso],
      criarBotao('Editar', 'btn-editar', () => iniciarEdicaoCurso(c)),
      criarBotao('Apagar', 'btn-apagar', () => apagarCurso(c))
    ));
  }
}

async function carregarCursos() {
  cursos = await pedir('/cursos');
  desenharSelectCursos();
  desenharTabelaCursos();
}

// ---------- CURSOS: apagar / adicionar / editar ----------

async function apagarCurso(curso) {
  // Aviso rápido no front-end. A regra verdadeira está na API, que recusa com 409.
  const emUso = alunos.filter(a => String(a.idCurso) === String(curso.id)).length;
  if (emUso > 0) {
    alert(`Não podes apagar "${curso.nomeDoCurso}": tem ${emUso} aluno(s) associado(s).`);
    return;
  }
  if (!confirm(`Apagar o curso "${curso.nomeDoCurso}"?`)) return;

  try {
    await pedir(`/cursos/${curso.id}`, { method: 'DELETE' });
    await carregarCursos();
  } catch (erro) {
    console.error(erro);
    alert(`Não foi possível apagar o curso. ${erro.message}`);
  }
}

function iniciarEdicaoCurso(curso) {
  inputCursoId.value = curso.id;
  inputNomeCurso.value = curso.nomeDoCurso;

  tituloFormCurso.textContent = 'Editar curso';
  btnGuardarCurso.textContent = 'Guardar';
  btnCancelarCurso.hidden = false;
  inputNomeCurso.focus();
}

function limparFormCurso() {
  formCurso.reset();
  inputCursoId.value = '';
  tituloFormCurso.textContent = 'Adicionar curso';
  btnGuardarCurso.textContent = 'Adicionar';
  btnCancelarCurso.hidden = true;
}

btnCancelarCurso.addEventListener('click', limparFormCurso);

formCurso.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = inputCursoId.value;
  const curso = { nomeDoCurso: inputNomeCurso.value.trim() };

  try {
    await pedir(id ? `/cursos/${id}` : '/cursos', {
      method: id ? 'PUT' : 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(curso)
    });
    limparFormCurso();
    await carregarCursos();
    desenharTabelaAlunos(); // o nome de um curso pode ter mudado
  } catch (erro) {
    console.error(erro);
    alert(`Não foi possível guardar o curso. ${erro.message}`);
  }
});

// ---------- Arranque ----------

async function iniciar() {
  try {
    await carregarCursos();
    await carregarAlunos();
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível contactar a API. O servidor está a correr?');
  }
}

iniciar();