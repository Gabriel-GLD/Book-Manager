// MOSTRAR FRONT DAS INTERFACES

function doGet(e) {
  // Pega o parâmetro 'page' da URL (ex: ?page=pagina2)
  var page = e.parameter.page;
  
  if (page === 'pagina2') {
    return HtmlService.createTemplateFromFile('index2').evaluate()
      .setTitle('Página 2');
  } else {
    // Página inicial (padrão)
    return HtmlService.createTemplateFromFile('index').evaluate()
      .setTitle('Página Inicial');
  }
}

// Função auxiliar para gerar URLs do App Script com parâmetros
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}





// function doGet(e) {
//   // verifica qual página foi solicitada via parâmetro ?page=..
//   var page = e.parameter.page;
//   if (page === '2') {
//     return HtmlService.createTemplateFromFile ('cadBuscLiv')
//     .evaluate()
//     .setTitle('Segunda Página');
//   }

//   else {
//     // Página padrão (index)
//     return HtmlService.createTemplateFromFile('index')
//     .evaluate()
//     .setTitle('Página Principal')

//   }

//   // função auxiliar para obter a URL base da aplicação
//   function getScript(){
//     return ScriptApp.getService().getUrl();
//   }

// }





// function doGet(e) {
//   return HtmlService.createTemplateFromFile('index')
//       .evaluate()
//       .setTitle('Página com Dados')
//       .addMetaTag('viewport', 'width=device-width, initial-scale=1'); // Responsividade
// }

