// inseir todos os dados colocados no campo na tabela quando clicar no botão
// Não deixar a pessoa enviar dados se estiver um campo faltando
// Retirar todos os dados da linha da tabela quando o código para retirada for solicitado
// Limpar os campos assim que os dados forem enviados
// Fazer a soma dos dias conforme o tempo do emprestimo, para colocar na tabela e ver quantos dias faltam para a devolução, alterando a cor conforme o dia
// enviar alertas no email da pessoa ou na interface (oque for mais plausivel) se o prazo para devolução estiver chegando



// AVISO MODAL AO ABRIR A INTERFACE (PESSOAS ATRASADAS)

function verificarAvisosEntrega() {

  const sheet = SpreadsheetApp
    .openById(ID_EMPRESTIMOS)
    .getSheetByName("Página1");

  const ultimaLinha = sheet.getLastRow();
  if (ultimaLinha < 2) return [];

  const dados = sheet.getRange(2, 1, ultimaLinha - 1, 7).getValues();
  const hoje = new Date();
  hoje.setHours(0,0,0,0);

  const avisos = [];

  for (let i = 0; i < dados.length; i++) {

    const dataEntrega = new Date(dados[i][0]);
    dataEntrega.setHours(0,0,0,0);

    const nomePessoa = dados[i][1];
    const nomeLivro = dados[i][3];

    const diferenca = Math.ceil((dataEntrega - hoje) / (1000 * 60 * 60 * 24));

    if (diferenca <= 3) {

      let mensagem;

      if (diferenca > 0) {
        mensagem = `⚠️ A pessoa "${nomePessoa}" está faltando ${diferenca} dia(s) para entregar o livro "${nomeLivro}".`;
      } else if (diferenca === 0) {
        mensagem = `🚨 A pessoa "${nomePessoa}" deve entregar HOJE o livro "${nomeLivro}".`;
      } else {
        mensagem = `❌ A pessoa "${nomePessoa}" está com ${Math.abs(diferenca)} dia(s) de atraso para entregar o livro "${nomeLivro}".`;
      }

      avisos.push(mensagem);
    }
  }

  return avisos;
}

// ENVIAR MSG PARA AS PESSOAS COM EMPRESTIMO ATRASADO

function enviarCobrancasAutomaticas() {

  const sheet = SpreadsheetApp
    .openById(ID_EMPRESTIMOS)
    .getSheetByName("Página1");

  const ultimaLinha = sheet.getLastRow();
  if (ultimaLinha < 2) return;

  const dados = sheet.getRange(2, 1, ultimaLinha - 1, 7).getValues();

  const hoje = new Date();
  hoje.setHours(0,0,0,0);

  for (let i = 0; i < dados.length; i++) {

    const dataEntrega = new Date(dados[i][0]);
    dataEntrega.setHours(0,0,0,0);

    const nomePessoa = dados[i][1];
    const email = dados[i][2];
    const nomeLivro = dados[i][3];

    if (!email || !email.includes("@")) continue;

    const diferenca = Math.ceil((dataEntrega - hoje) / (1000 * 60 * 60 * 24));

    if (diferenca <= 3) {

      let assunto = "Aviso de Devolução de Livro";
      let mensagem;

      if (diferenca > 0) {

        mensagem =
          `Olá ${nomePessoa},\n\n` +
          `Faltam ${diferenca} dia(s) para devolver o livro "${nomeLivro}".\n\n` +
          `Por favor, realize a devolução dentro do prazo.\n\n` +
          `Igreja Batista Nova Cachoeirinha`;

      } else if (diferenca === 0) {

        mensagem =
          `Olá ${nomePessoa},\n\n` +
          `O livro "${nomeLivro}" deve ser devolvido HOJE.\n\n` +
          `Evite atrasos.\n\n` +
          `Igreja Batista Nova Cachoeirinha`;

      } else {

        mensagem =
          `Olá ${nomePessoa},\n\n` +
          `O livro "${nomeLivro}" está com ${Math.abs(diferenca)} dia(s) de atraso.\n\n` +
          `Pedimos que realize a devolução o quanto antes.\n\n` +
          `Igreja Batista Nova Cachoeirinha`;
      }

      MailApp.sendEmail(email, assunto, mensagem);
    }
  }
}





