function processarEmprestimo(dados) {

  const sheet = SpreadsheetApp
    .openById(ID_EMPRESTIMOS)
    .getSheetByName("Página1");

  const colunaA = sheet.getRange("A:A")
                       .getDisplayValues()
                       .filter(r => r[0] !== "");

  const novaLinha = colunaA.length + 1;

  sheet.getRange(novaLinha, 1, 1, 7).setValues([[
    new Date(dados.dataDevolucao),
    dados.pessoa,
    dados.contato,
    dados.titulo,
    dados.autor,
    dados.codigo,
    dados.preco
  ]]);

  return "✅ Empréstimo registrado com sucesso!";
}



function devolverLivro(codigo) {

  const sheet = SpreadsheetApp
    .openById(ID_EMPRESTIMOS)
    .getSheetByName("Página1");

  const ultimaLinha = sheet.getLastRow();

  if (ultimaLinha < 2) {
    throw new Error("⚠️ Não há registros na tabela.");
  }

  const dados = sheet.getRange(2, 1, ultimaLinha - 1, 7).getValues();

  for (let i = 0; i < dados.length; i++) {

    if (String(dados[i][5]) === String(codigo)) {

      sheet.deleteRow(i + 2);
      return "🔄 Livro devolvido com sucesso!";
    }
  }

  // Só chega aqui se NÃO encontrou o código
  throw new Error("❌ O código informado não existe ou está incorreto.");

}





// FUNCTION DE CADASTRAR LIVROS PARA MANDAR PARA O SCRIPT
function cadastrarLivroDisponivel(nomeLivro) {

  if (!nomeLivro || nomeLivro.trim() === "") {
    throw new Error("⚠️ O nome do livro não pode estar vazio.");
  }

  const sheet = SpreadsheetApp
    .openById(ID_EMPRESTIMOS)
    .getSheetByName("Página1");

  // Pega todos os valores da coluna I
  const colunaI = sheet.getRange("I:I").getValues();

  // Descobre última linha preenchida na coluna I
  let ultimaLinha = 0;
  for (let i = 0; i < colunaI.length; i++) {
    if (colunaI[i][0] !== "") {
      ultimaLinha = i + 1;
    }
  }

  // Verifica se já existe
  const livrosExistentes = colunaI
    .flat()
    .map(l => String(l).toLowerCase().trim());

  if (livrosExistentes.includes(nomeLivro.toLowerCase().trim())) {
    throw new Error("❌ Este livro já está cadastrado.");
  }

  // Insere na próxima linha disponível da coluna I
  sheet.getRange(ultimaLinha + 1, 9).setValue(nomeLivro);

  return "✅ Livro cadastrado com sucesso!";
}


// REMOVE OS LIVRO DA TABELA DE LIVROS PARA CADASTRO

function removerLivroDisponivel(nomeLivro) {

  if (!nomeLivro || nomeLivro.trim() === "") {
    throw new Error("⚠️ Digite o nome do livro para remover.");
  }

  const sheet = SpreadsheetApp
    .openById(ID_EMPRESTIMOS)
    .getSheetByName("Página1");

  const dados = sheet.getRange("I:I").getValues();
  let encontrado = false;

  // Remove o livro
  for (let i = 0; i < dados.length; i++) {

    if (String(dados[i][0]).toLowerCase().trim() === nomeLivro.toLowerCase().trim()) {
      sheet.getRange(i + 1, 9).clearContent();
      encontrado = true;
      break;
    }

  }

  if (!encontrado) {
    throw new Error("❌ Livro não encontrado na lista.");
  }

  // 🔥 REORGANIZA A COLUNA I (remove espaços vazios)

  const livrosAtualizados = sheet
    .getRange("I:I")
    .getValues()
    .flat()
    .filter(l => l !== "");

  // Limpa toda coluna I
  sheet.getRange("I:I").clearContent();

  // Reescreve sem espaços vazios
  if (livrosAtualizados.length > 0) {
    sheet.getRange(1, 9, livrosAtualizados.length)
      .setValues(livrosAtualizados.map(l => [l]));
  }

  return "🗑️ Livro removido com sucesso!";
}

// BUSCADOR DE LIVROS

function buscarLivroSistema(nomeLivro) {

  if (!nomeLivro || nomeLivro.trim() === "") {
    throw new Error("⚠️ Digite o nome do livro para buscar.");
  }

  const sheet = SpreadsheetApp
    .openById(ID_EMPRESTIMOS)
    .getSheetByName("Página1");

  const dados = sheet.getDataRange().getValues();

  const livrosColunaI = sheet.getRange("I:I").getValues().flat();

  let encontradoNaColunaI = false;
  let emprestado = false;
  let nomePessoa = "";
  let codigoLivro = "";

  // Verifica se está cadastrado (coluna I)
  for (let i = 0; i < livrosColunaI.length; i++) {
    if (String(livrosColunaI[i]).toLowerCase().trim() === nomeLivro.toLowerCase().trim()) {
      encontradoNaColunaI = true;
      break;
    }
  }

  // Verifica se está emprestado (coluna D)
  for (let i = 1; i < dados.length; i++) {

    const livroEmprestado = String(dados[i][3]).toLowerCase().trim(); // Coluna D
    const pessoa = dados[i][1]; // Coluna B
    const codigo = dados[i][5]; // Coluna F

    if (livroEmprestado === nomeLivro.toLowerCase().trim()) {
      emprestado = true;
      nomePessoa = pessoa;
      codigoLivro = codigo;
      break;
    }
  }

  //  CASOS

  if (encontradoNaColunaI && !emprestado) {
    return {
      tipo: "disponivel",
      mensagem: `✅ O livro "${nomeLivro}" está DISPONÍVEL.`,
    };
  }

  if (encontradoNaColunaI && emprestado) {
    return {
      tipo: "emprestado",
      mensagem: `📕 O livro "${nomeLivro}" está EMPRESTADO para "${nomePessoa}".`,
      codigo: codigoLivro
    };
  }

  if (!encontradoNaColunaI && emprestado) {
    return {
      tipo: "naoCadastrado",
      mensagem: `⚠️ O livro "${nomeLivro}" está com "${nomePessoa}" (código ${codigoLivro}), MAS não está cadastrado no sistema.`,
      codigo: codigoLivro
    };
  }

  throw new Error("❌ Livro não encontrado no sistema.");
}