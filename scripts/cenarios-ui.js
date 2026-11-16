import { calcularResultados } from "./calculos.js";
import { deslocarHabitos, deslocarMetadeDaPonta, foraDaPonta } from "./cenarios.js";
import { atualizarGrafico, atualizarComparacao } from "./chart.js";

const painel = document.getElementById("cenario");
const resultado = document.getElementById("cenario-resultado");
const erro = document.getElementById("cenario-erro");
const aviso = document.getElementById("aviso-base");
const moeda = valor => (Math.abs(valor) < 0.005 ? 0 : valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const numero = valor => valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
let base = null;

// As faixas são as didáticas da Tabela II.9; os dias do mês têm o mesmo perfil.
function horario(hora) {
    const faixa = foraDaPonta(hora) ? "fora de ponta" : (hora === 17 || hora === 21) ? "intermediário" : "ponta";
    return String(hora).padStart(2, "0") + "h — " + faixa;
}
for (const select of painel.querySelectorAll("select[data-horarios]")) {
    for (let hora = 0; hora < 24; hora++) {
        if (select.dataset.horarios === "fora" && !foraDaPonta(hora)) continue;
        select.add(new Option(horario(hora), hora));
    }
    select.value = select.dataset.inicial;
}

function limparResultado() {
    resultado.hidden = true;
    erro.hidden = true;
    erro.textContent = "";
}
function restaurarGraficos() {
    if (!base) return;
    atualizarGrafico(base.consumoPorHora, base.periodo.dia);
    atualizarComparacao(calcularResultados(base));
}
function atualizarEstimativas() {
    if (!base) return;
    for (const habito of ["banho", "lavagem"]) {
        const origem = Number(document.getElementById(habito + "-origem").value);
        const percentual = Number(document.getElementById(habito + "-parcela").value);
        const energia = base.consumoPorHora[origem] * percentual / 100;
        document.getElementById(habito + "-estimativa").textContent =
            "Hora original: " + numero(base.consumoPorHora[origem]) + " kWh/dia. Parcela estimada: " + numero(energia) + " kWh/dia.";
    }
}
export function prepararCenarios(dados) {
    base = structuredClone(dados);
    limparResultado();
    aviso.hidden = true;
    painel.hidden = false;
    atualizarEstimativas();
}
export function invalidarCenarios() {
    if (!base) return;
    restaurarGraficos();
    base = null;
    limparResultado();
    painel.hidden = true;
    aviso.hidden = false;
}
function exibirCenario(simulacao, titulo) {
    const antes = calcularResultados(base);
    const depois = calcularResultados(simulacao.dados);
    atualizarGrafico(base.consumoPorHora, base.periodo.dia, simulacao.dados.consumoPorHora);
    atualizarComparacao(antes, depois);
    document.getElementById("cenario-titulo-resultado").textContent = titulo;
    for (const [id, valor] of Object.entries({
        "conv-antes": antes.custoConvencional, "conv-depois": depois.custoConvencional,
        "branca-antes": antes.custoBranca, "branca-depois": depois.custoBranca,
        "economia-conv": antes.custoConvencional - depois.custoConvencional,
        "economia-branca": antes.custoBranca - depois.custoBranca
    })) document.getElementById(id).textContent = moeda(valor);
    document.getElementById("cenario-energia").textContent = simulacao.deslocado > 1e-9
        ? numero(simulacao.deslocado) + " kWh/dia deslocados. Total mantido: " + numero(depois.consumoMensal) + " kWh/mês."
        : "Nenhum consumo foi deslocado. As contas permanecem iguais.";
    const diferenca = depois.custoBranca - depois.custoConvencional;
    document.getElementById("cenario-conclusao").textContent = Math.abs(diferenca) < 0.005
        ? "Neste cenário, as duas modalidades têm o mesmo custo."
        : diferenca > 0
            ? "Neste cenário, a convencional é mais barata. A branca custa " + moeda(diferenca) + " a mais por mês."
            : "Neste cenário, a branca compensa: custa " + moeda(-diferenca) + " a menos por mês.";
    erro.hidden = true;
    resultado.hidden = false;
}
function tentarSimular(acao, titulo) {
    if (!base) return;
    try { exibirCenario(acao(), titulo); }
    catch (e) {
        restaurarGraficos();
        resultado.hidden = true;
        erro.textContent = e.message;
        erro.hidden = false;
    }
}
document.getElementById("simular-metade").addEventListener("click", () => {
    tentarSimular(() => deslocarMetadeDaPonta(base, Number(document.getElementById("destino-metade").value)),
        "50% da ponta para fora de ponta");
});
document.getElementById("form-habitos").addEventListener("submit", event => {
    event.preventDefault();
    tentarSimular(() => deslocarHabitos(base, ["banho", "lavagem"].map(habito => ({
        origem: Number(document.getElementById(habito + "-origem").value),
        destino: Number(document.getElementById(habito + "-destino").value),
        percentual: Number(document.getElementById(habito + "-parcela").value)
    }))), "Banho e lavagem fora da ponta");
});
painel.addEventListener("input", () => {
    restaurarGraficos();
    limparResultado();
    atualizarEstimativas();
});
document.getElementById("restaurar-base").addEventListener("click", () => {
    restaurarGraficos();
    limparResultado();
});
