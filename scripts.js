const header = document.querySelector('header');
const section = document.querySelector('section');

// Requisições das APIs JSON
let requestClientsURL = 'http://www.mocky.io/v2/598b16291100004705515ec5';
let requestHistoricURL = 'http://www.mocky.io/v2/598b16861100004905515ec7';
let requestClients = new XMLHttpRequest();
let requestHistoric = new XMLHttpRequest();
requestClients.open('GET', requestClientsURL);
requestClients.responseType = 'json';
requestClients.send();
requestHistoric.open('GET', requestHistoricURL);
requestHistoric.responseType = 'json';
requestHistoric.send();


// Inicializar as funções
requestHistoric.onload = function () {
  const historic = requestHistoric.response;
  const client = requestClients.response;

  showClients(client);
  showHistoric(historic);

  // Funções referentes aos problemas propostos
  totalValue();
  lastYear();
  faithfull();
  favorite();
}


/* 1 - Liste os clientes ordenados pelo maior valor total em compras */
function totalValue() {
  const p1 = document.querySelector('.p1');

  // Pegar conteúdo da requisição
  const client = requestClients.response;
  const historic = requestHistoric.response;

  var obj = [{ name: '', value: '' }];
  obj.pop();

  for (let i = 0; i < client.length; i++) {

    var total = 0;
    var c = 0;

    for (let j = 0; j < historic.length; j++) {
      // Compara os últimos caracteres do CPF do cliente e do histórico
      const last = historic[j].cliente.length - 1;
      if (client[i].cpf[13] == historic[j].cliente[last])
        // Acumula o total gasto por cada cliente
        total += historic[j].valorTotal;
    }

    // Adiciona o nome e o valor total gasto pelo cliente
    obj.push({
      name: client[i].nome,
      value: total,
    });
  }

  // Ordena pelo maior valor total
  obj.sort(function (a, b) {
    return b.value - a.value;
  });

  // RENDERIZA TABELA DE RESULTADOS
  const table = document.createElement('table');
  const tr = document.createElement('tr');
  const thName = document.createElement('th');
  const thValue = document.createElement('th');
 
  thName.textContent = 'NOME';
  thValue.textContent = 'VALOR TOTAL';
 
  tr.appendChild(thName);
  tr.appendChild(thValue);
  table.appendChild(tr);

  for (let a = 0; a < obj.length; a++) {
  
     const tr = document.createElement('tr');
     const tdName = document.createElement('td');
     const tdValue = document.createElement('td');
 
     tdName.textContent = obj[a].name;
     tdValue.textContent = obj[a].value.toFixed(2);
 
     tr.appendChild(tdName);
     tr.appendChild(tdValue);
     table.appendChild(tr);
     p1.appendChild(table);
  }
}


/* 2 - Mostre o cliente com maior compra única no último ano (2016) */
function lastYear() {
  const p2 = document.querySelector('.p2');

  // Pegar conteúdo da requisição
  const historic = requestHistoric.response;

  var total = 0;
  var cpf;

  for (let i = 0; i < historic.length; i++) {
    // se o ano for 2016
    if (historic[i].data[8] == "1" && historic[i].data[9] == "6") {
      if (historic[i].valorTotal > total) {
        // maior valor total da compra i
        total = historic[i].valorTotal;
        cpf = historic[i].cliente;
      }
    }
  }

  const p = document.createElement('p');
  p.textContent = 'Cliente com maior compra única de 2016: ' + nameCpf(cpf) + ', no valor de R$ ' + total;
  p2.appendChild(p);
}

// Função Auxiliar. Dado um CPF, retorna o nome do cliente
function nameCpf(cpf) {
  const client = requestClients.response;

  for (let i = 0; i < client.length; i++) {
    if (cpf[cpf.length - 1] == client[i].cpf[client[i].cpf.length - 1])
      return client[i].nome;
  }
}


/* 3 - Liste os clientes mais fiéis */
function faithfull() {
  const p3 = document.querySelector('.p3');

  // Pegar conteúdo da requisição
  const client = requestClients.response;
  const historic = requestHistoric.response;

  var obj = [{ name: '', count: 0 }];
  obj.pop();

  for (let i = 0; i < client.length; i++) {
    var c = 0;

    for (let j = 0; j < historic.length; j++) {
      // Compara os últimos caracteres do CPF do cliente e do histórico
      const last = historic[j].cliente.length - 1;
      if (client[i].cpf[13] == historic[j].cliente[last])
        // Conta quantas compras o cliente realizou
        c++;
    }

    // Adiciona o nome e o valor total gasto pelo cliente
    obj.push({
      name: client[i].nome,
      count: c
    });
  }

  // Ordena pelo maior valor total
  obj.sort(function (a, b) {
    return b.count - a.count;
  });

  // RENDERIZA TABELA DE RESULTADOS
  const table = document.createElement('table');
  const tr = document.createElement('tr');
  const thName = document.createElement('th');
  const thShop = document.createElement('th');
 
  thName.textContent = 'NOME';
  thShop.textContent = 'Nº DE COMPRAS';
 
  tr.appendChild(thName);
  tr.appendChild(thShop);
  table.appendChild(tr);

  for (let a = 0; a < obj.length; a++) {
   
     const tr = document.createElement('tr');
     const tdName = document.createElement('td');
     const tdShop = document.createElement('td');
 
     tdName.textContent = obj[a].name;
     tdShop.textContent = obj[a].count;
 
     tr.appendChild(tdName);
     tr.appendChild(tdShop);
     table.appendChild(tr);
     p3.appendChild(table);
  }

  // Destaca o mais cliente fiel
  const p0 = document.createElement('p');
  p0.classList.add('faithfull');
  p0.textContent = 'Portanto o cliente mais fiel é: ' + obj[0].name;
  p3.appendChild(p0);
}


/* 4 - Recomende um vinho para um determinado cliente a partir do histórico */
function favorite() {
  const p4 = document.querySelector('.p4');

  // Pegar conteúdo da requisição
  const client = requestClients.response;

  // RENDERIZA TABELA DE RESULTADOS
  const table = document.createElement('table');
  const tr = document.createElement('tr');
  const thName = document.createElement('th');
  const thRecomend = document.createElement('th');
 
  thName.textContent = 'NOME';
  thRecomend.textContent = 'VINHO RECOMENDADO';
 
  tr.appendChild(thName);
  tr.appendChild(thRecomend);
  table.appendChild(tr);

  for (let i = 0; i < client.length; i++) {
   
     const tr = document.createElement('tr');
     const tdName = document.createElement('td');
     const tdRecomend = document.createElement('td');
 
     tdName.textContent = client[i].nome;
     tdRecomend.textContent = mostFrequent(getWines(client[i]));
 
     tr.appendChild(tdName);
     tr.appendChild(tdRecomend);
     table.appendChild(tr);
     p4.appendChild(table);
  }
}

// Retorna todos os vinhos do cliente
function getWines(client) {
  // Pegar conteúdo da requisição
  const historic = requestHistoric.response;

  var wine = [];

  for (let i = 0; i < historic.length; i++) {
    // Compara os últimos caracteres do CPF do cliente e do histórico
    const last = historic[i].cliente.length - 1;
    if (client.cpf[13] == historic[i].cliente[last]) {
      // Array com os vinhos do cliente, referente a todas as compras
      const items = historic[i].itens;
      for (let j = 0; j < items.length; j++) {
        wine.push(items[j].produto);
      }
    }
  }

  return wine;
}

// Retorna o vinho comprado com mais frequência pelo cliente
function mostFrequent(array) {
  var counts = {};
  var compare = 0;
  var frequent;
  
  for (var i = 0, len = array.length; i < len; i++) {
    var word = array[i];

    if (counts[word] === undefined) {
      counts[word] = 1;
    } else {
      counts[word] = counts[word] + 1;
    }
    if (counts[word] > compare) {
      compare = counts[word];
      frequent = array[i];
    }
  }
  return frequent;
}


/* ************ Funções para listar os clientes e o histórico de compras  ************ */

// Exibir todos os clientes em uma tabela
function showClients(client) {
  const table = document.createElement('table');
  const tr = document.createElement('tr');
  const thId = document.createElement('th');
  const thName = document.createElement('th');
  const thCpf = document.createElement('th');

  thId.textContent = 'ID';
  thName.textContent = 'NOME';
  thCpf.textContent = 'CPF';

  tr.appendChild(thId);
  tr.appendChild(thName);
  tr.appendChild(thCpf);
  table.appendChild(tr);

  for (let i = 0; i < client.length; i++) {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    const tdCpf = document.createElement('td');
    const tdId = document.createElement('td');

    tdName.textContent = client[i].nome;
    tdCpf.textContent = client[i].cpf;
    tdId.textContent = client[i].id;

    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdCpf);
    table.appendChild(tr);
    header.appendChild(table);
  }
}

// Exibir o histórico completo
function showHistoric(historic) {
  const hist = document.querySelector('.hist');

  for (let i = 0; i < historic.length; i++) {
    const myArticle = document.createElement('article');
    const myPara = document.createElement('p');
    const myPara1 = document.createElement('p');
    const myPara2 = document.createElement('p');
    const myPara3 = document.createElement('p');
    const myList = document.createElement('p');
    const myPara4 = document.createElement('p');

    myPara.classList.add('boldText');
    myPara1.classList.add('boldText');
    myPara2.classList.add('boldText');
    myPara3.classList.add('boldText');
    myPara4.classList.add('boldText');

    //myPara.textContent = historic[i].codigo;
    myPara1.textContent = 'Data: ' + historic[i].data;
    myPara2.textContent = 'Cliente: ' + historic[i].cliente;
    myPara3.textContent = 'Itens:';
    myPara4.textContent = 'Total: R$' + historic[i].valorTotal;

    const items = historic[i].itens;
    for (let j = 0; j < items.length; j++) {
      const product = document.createElement('ul');
      const variety = document.createElement('li');
      const country = document.createElement('li');
      const category = document.createElement('li');
      const harvest = document.createElement('li');
      const price = document.createElement('li');

      product.textContent = 'Produto: ' + items[j].produto;
      variety.textContent = 'Variedade: ' + items[j].variedade;
      country.textContent = 'País: ' + items[j].pais;
      category.textContent = 'Categoria: ' + items[j].categoria;
      harvest.textContent = 'Safra: ' + items[j].safra;
      price.textContent = 'Preço: R$' + items[j].preco;

      myList.appendChild(product);
      product.appendChild(variety);
      product.appendChild(country);
      product.appendChild(category);
      product.appendChild(harvest);
      product.appendChild(price);
    }

    myArticle.appendChild(myPara);
    myArticle.appendChild(myPara1);
    myArticle.appendChild(myPara2);
    myArticle.appendChild(myPara3);
    myArticle.appendChild(myList);
    myArticle.appendChild(myPara4);

    hist.appendChild(myArticle);
  }
}