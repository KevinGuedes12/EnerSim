
import { atualizarGrafico,atualizarComparacao,atualizarGraficoBandeiras} from "./chart.js";
import {preencherForms,capturaDadosform} from "./functions.js";
import {atualizarResultados,gerarDetalhamentoHorario,consumoPorFaixa} from "./calculos.js";

// Elementos principais
const arquivo = document.getElementById("json-file");
const form = document.getElementById("Formulario");

// Formatação de números
const formatoNumero = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const formatoDinheiro = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

// Atualiza a tabela de consumo por horário
function atualizarTabelaConsumo(dados) {
    const tabela = document.getElementById("tabela-consumo");

    const linhas = gerarDetalhamentoHorario(dados);

    tabela.innerHTML = linhas.map(item => `
        <tr>
            <td>${item.hora}</td>
            <td>${formatoNumero.format(item.consumo)}</td>
            <td>${item.posto}</td>
            <td>${formatoNumero.format(item.tarifa)}</td>
            <td>${formatoDinheiro.format(item.custo)}</td>
        </tr>
    `).join("");
}

// Atualiza a tabela de resumo mensal
function atualizarTabelaResumo(dados) {
    const faixas = consumoPorFaixa(dados.consumoPorHora);

    const consumoMensal = faixas.total * dados.periodo.dia;

    const custoConsumoConv =
        consumoMensal * dados.tarifas.convencional;

    const custoConsumoBranca = (
        (faixas.foraPonta * dados.tarifas.foraPonta) +
        (faixas.intermediario * dados.tarifas.intermediaria) +
        (faixas.ponta * dados.tarifas.ponta)
    ) * dados.periodo.dia;

    const adicionalBandeira =
        consumoMensal * dados.bandeiras[dados.bandeiraAtiva] / 100;

    const totalConv = custoConsumoConv + adicionalBandeira;
    const totalBranca = custoConsumoBranca + adicionalBandeira;

    document.getElementById("resumo-consumo-conv").textContent =
        formatoDinheiro.format(custoConsumoConv);

    document.getElementById("resumo-consumo-branca").textContent =
        formatoDinheiro.format(custoConsumoBranca);

    document.getElementById("resumo-bandeira-conv").textContent =
        formatoDinheiro.format(adicionalBandeira);

    document.getElementById("resumo-bandeira-branca").textContent =
        formatoDinheiro.format(adicionalBandeira);

    document.getElementById("resumo-total-conv").textContent =
        formatoDinheiro.format(totalConv);

    document.getElementById("resumo-total-branca").textContent =
        formatoDinheiro.format(totalBranca);
}

// Atualiza todos os elementos da tela
function atualizarTela(dados) {
    const resultados = atualizarResultados(dados);

    atualizarGrafico(dados.consumoPorHora);

    atualizarGraficoBandeiras(dados.bandeiras);

    atualizarTabelaConsumo(dados);

    atualizarTabelaResumo(dados);

    // O gráfico recebe os totais com a bandeira incluída
    const faixas = consumoPorFaixa(dados.consumoPorHora);
    const consumoMensal = faixas.total * dados.periodo.dia;

    const adicionalBandeira =
        consumoMensal * dados.bandeiras[dados.bandeiraAtiva] / 100;

    atualizarComparacao({
        custoConvencional: resultados.custoConvencional + adicionalBandeira,
        custoBranca: resultados.custoBranca + adicionalBandeira
    });
}


// Importação de arquivo JSON
arquivo.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    try {
        const conteudo = await file.text();
        const dados = JSON.parse(conteudo);

        preencherForms(dados);

        atualizarTela(dados);

    } catch (err) {
        console.error("Erro ao ler o arquivo:", err);
        alert("Não foi possível importar os dados. Confira o arquivo JSON.");
    } finally {
        arquivo.value = "";
    }
});


// Captura dos dados preenchidos manualmente
form.addEventListener("submit", (event) => {
    event.preventDefault();

    try {
        const dados = capturaDadosform();

        atualizarTela(dados);

    } catch (err) {
        console.error("Erro ao atualizar a simulação:", err);
        alert("Não foi possível calcular os dados. Confira os valores preenchidos.");
    }
});



