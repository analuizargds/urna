const candidatos = {
  1: { nome: "Ana Banana", foto: "fotos/analiana.jpeg" },
  2: { nome: "Carolaine", foto: "fotos/carol.jpeg" },
  3: { nome: "zé zé", foto: "fotos/bia.jpeg" },
  4: { nome: "Ana Li.", foto: "fotos/analidia.jpeg" },
  5: { nome: "TATA", foto: "fotos/drink5.jpeg" },
  6: { nome: "Ana Luíza Princesa", foto: "fotos/analuiza.jpeg" }
};

const criterios = [
  "APRESENTAÇÃO",
  "COMPLEXIDADE / ELABORAÇÃO",
  "SABOR",
  "CRIATIVIDADE"
];

let votante = "";
let candidato = "";
let entradaNota = "";
let criterioAtual = 0;
let totalAvaliacoes = 0;

const telas = {
  votante: document.getElementById("tela-votante"),
  candidato: document.getElementById("tela-candidato"),
  criterio: document.getElementById("tela-criterio"),
  fim: document.getElementById("tela-fim"),
  apuracao: document.getElementById("tela-apuracao")
};

const votos = {
    1: { apresentacao: 0, complexidade: 0, sabor: 0, criatividade: 0, total: 0, quantidade: 0 },
    2: { apresentacao: 0, complexidade: 0, sabor: 0, criatividade: 0, total: 0, quantidade: 0 },
    3: { apresentacao: 0, complexidade: 0, sabor: 0, criatividade: 0, total: 0, quantidade: 0 },
    4: { apresentacao: 0, complexidade: 0, sabor: 0, criatividade: 0, total: 0, quantidade: 0 },
    5: { apresentacao: 0, complexidade: 0, sabor: 0, criatividade: 0, total: 0, quantidade: 0 },
    6: { apresentacao: 0, complexidade: 0, sabor: 0, criatividade: 0, total: 0, quantidade: 0 }
  };

function mostrarTela(tela) {
  Object.values(telas).forEach(t => t.classList.add("escondida"));
  tela.classList.remove("escondida");
}

function resetar() {
  votante = "";
  candidato = "";
  entradaNota = "";
  criterioAtual = 0;

  document.getElementById("display-votante").textContent = "";
  document.getElementById("display-candidato").textContent = "";
  document.getElementById("display-nota").textContent = "";
  document.getElementById("aviso-candidato").textContent = "";
  document.getElementById("aviso-nota").textContent = "";
}

document.querySelectorAll("[data-votante]").forEach(botao => {
  botao.addEventListener("click", () => {
    votante = botao.dataset.votante;
    document.getElementById("display-votante").textContent = votante;

    const dados = candidatos[votante];

    if (dados) {
      document.getElementById("foto-votante").src = dados.foto;
      document.getElementById("nome-votante").textContent = dados.nome;
      document.getElementById("foto-votante").style.display = "block";
    }
  });
});

document.getElementById("corrige-votante").addEventListener("click", () => {
  votante = "";
  document.getElementById("display-votante").textContent = "";
});

document.getElementById("branco-votante").addEventListener("click", () => {
  alert("A identificação do votante é necessária para impedir que ele avalie o próprio drink.");
});

document.getElementById("confirma-votante").addEventListener("click", () => {
  if (!votante) {
    alert("Digite o número do candidato que está votando.");
    return;
  }

  mostrarTela(telas.candidato);
});

document.querySelectorAll("[data-candidato]").forEach(botao => {
  botao.addEventListener("click", () => {
    const numero = botao.dataset.candidato;

    if (numero === "0") return;

    if (numero === votante) {
      document.getElementById("aviso-candidato").textContent =
        "Você não pode votar no próprio drink.";
      candidato = "";
      document.getElementById("display-candidato").textContent = "";
      document.getElementById("nome-candidato").textContent = "";
      document.getElementById("numero-candidato").textContent = "";
      document.getElementById("foto-candidato").style.display = "none";
      return;
    }

    candidato = numero;
    const dados = candidatos[numero];

    document.getElementById("display-candidato").textContent = numero;
    document.getElementById("nome-candidato").textContent = dados.nome;
    document.getElementById("aviso-candidato").textContent = "";

    const foto = document.getElementById("foto-candidato");
    foto.src = dados.foto;
    foto.style.display = "block";
  });
});

document.getElementById("corrige-candidato").addEventListener("click", () => {
  candidato = "";
  document.getElementById("display-candidato").textContent = "";
  document.getElementById("nome-candidato").textContent = "---";
  document.getElementById("numero-candidato").textContent = "";
  document.getElementById("foto-candidato").style.display = "none";
  document.getElementById("aviso-candidato").textContent = "";
});

document.getElementById("branco-candidato").addEventListener("click", () => {
  candidato = "BRANCO";
  document.getElementById("display-candidato").textContent = "";
  document.getElementById("nome-candidato").textContent = "VOTO EM BRANCO";
  document.getElementById("numero-candidato").textContent = "";
  document.getElementById("foto-candidato").style.display = "none";
  document.getElementById("aviso-candidato").textContent = "";
});

document.getElementById("confirma-candidato").addEventListener("click", () => {
  if (!candidato) {
    document.getElementById("aviso-candidato").textContent =
      "Digite um candidato válido.";
    return;
  }

  if (candidato === "BRANCO") {
    alert("Voto em branco não entra na avaliação dos drinks. Para este protótipo, escolha um candidato.");
    candidato = "";
    return;
  }

  criterioAtual = 0;
  prepararCriterio();
  mostrarTela(telas.criterio);
});

document.querySelectorAll("[data-nota]").forEach(botao => {
  botao.addEventListener("click", () => {
    if (entradaNota.length >= 2) return;

    entradaNota += botao.dataset.nota;

    // Impede notas maiores que 10.
    const valor = Number(entradaNota);
    if (valor > 5) {
      entradaNota = "";
      document.getElementById("aviso-nota").textContent =
        "A nota deve ser de 0 a 5.";
    } else {
      document.getElementById("aviso-nota").textContent = "";
      document.getElementById("display-nota").textContent = entradaNota;
    }
  });
});

document.getElementById("corrige-nota").addEventListener("click", () => {
  entradaNota = "";
  document.getElementById("display-nota").textContent = "";
  document.getElementById("aviso-nota").textContent = "";
});

    document.getElementById("confirma-nota").addEventListener("click", () => {
    if (entradaNota === "" || Number(entradaNota) > 5) {
        document.getElementById("aviso-nota").textContent =
        "Digite uma nota de 0 a 5.";
        return;
    }

    const nota = Number(entradaNota);

    if (criterioAtual === 0) {
    votos[candidato].apresentacao += nota;
    }

    if (criterioAtual === 1) {
    votos[candidato].complexidade += nota;
    }

    if (criterioAtual === 2) {
    votos[candidato].sabor += nota;
    }

    if (criterioAtual === 3) {
    votos[candidato].criatividade += nota;
    }

  // Por enquanto, apenas avança pelas telas.
  // A gravação/apuração dos votos será adicionada depois.
  criterioAtual++;

  if (criterioAtual >= criterios.length) {

    totalAvaliacoes++;

    // Soma as notas do drink
    votos[candidato].total =
    votos[candidato].apresentacao +
    votos[candidato].complexidade +
    votos[candidato].sabor +
    votos[candidato].criatividade;

    const somUrna = document.getElementById("som-urna");

    somUrna.currentTime = 0;
    somUrna.play();

    if (totalAvaliacoes === 30) {
        finalizarVoto();

        setTimeout(() => {
        apurarVotos();
        }, 3500);

    } else {
        // Votos 1 até 29
        finalizarVoto();
    }
  } else {
    entradaNota = "";
    prepararCriterio();
  }
});

function prepararCriterio() {
  document.getElementById("titulo-criterio").textContent =
    criterios[criterioAtual];

  document.getElementById("criterio-numero").textContent =
    candidato;

  document.getElementById("criterio-nome").textContent =
    candidatos[candidato].nome;

  document.getElementById("display-nota").textContent = "";
  document.getElementById("aviso-nota").textContent = "";
}

function finalizarVoto() {
    mostrarTela(telas.fim);
  
    setTimeout(() => {

        if (totalAvaliacoes === 30) {
          // Não volta para a identificação.
          // A apuração será aberta pelo código acima.
          return;
        }
    
        resetar();
        mostrarTela(telas.votante);
    
      }, 3000);
  }

  function apurarVotos() {

    const resultados = Object.keys(votos).map(numero => {
  
      const drink = votos[numero];
  
      const media =
        drink.quantidade > 0
          ? drink.total / drink.quantidade
          : 0;
  
      return {
        numero: numero,
        nome: candidatos[numero].nome,
        apresentacao: drink.apresentacao,
        complexidade: drink.complexidade,
        sabor: drink.sabor,
        criatividade: drink.criatividade,
        total: drink.total,
        media: media
      };
  
    });
  
    // Ordena pela maior pontuação
    resultados.sort((a, b) => b.total - a.total);
  
    let html = "";
  
    resultados.forEach((drink, index) => {
  
      html += `
        <div class="resultado-drink">
  
          <div class="posicao">
            ${index + 1}º
          </div>
  
          <div class="resultado-info">
  
            <strong>
              ${drink.nome}
            </strong>
  
            <span>
              Apresentação: ${drink.apresentacao}
            </span>
  
            <span>
              Complexidade: ${drink.complexidade}
            </span>
  
            <span>
              Sabor: ${drink.sabor}
            </span>
  
            <span>
              Criatividade: ${drink.criatividade}
            </span>
  
          </div>
  
          <div class="resultado-total">
            <strong>${drink.total}</strong>
            <small>pontos</small>
          </div>
  
        </div>
      `;
  
    });
  
    document.getElementById("resultado-apuracao").innerHTML = html;
  
    mostrarTela(telas.apuracao);
  }