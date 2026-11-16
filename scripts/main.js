import { atualizarGrafico, atualizarComparacao, atualizarBandeiras } from "./chart.js";
import { preencherForms, capturaDadosform, validarDados, minimizarCampo } from "./functions.js";
import { atualizarResultados } from "./calculos.js";
import { prepararCenarios, invalidarCenarios } from "./cenarios-ui.js";

const arquivo = document.getElementById("json-file");
const form = document.getElementById("Formulario");
const mensagem = document.getElementById("erro-dados");
const statusArquivo = document.getElementById("status-arquivo");

function mostrarErro(erro) {
    mensagem.textContent = erro.message;
    mensagem.hidden = false;
    mensagem.closest("details").open = true;
}

function atualizarTela(dados) {
    const resultados = atualizarResultados(dados);
    atualizarBandeiras(dados);
    atualizarComparacao(resultados);
    atualizarGrafico(dados.consumoPorHora, dados.periodo.dia);
    mensagem.textContent = "";
    mensagem.hidden = true;
}

arquivo.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    statusArquivo.textContent = `Lendo ${file.name}…`;
    statusArquivo.hidden = false;
    try {
        const conteudo = await file.text();
        let dados;
        try {
            dados = JSON.parse(conteudo);
        } catch {
            throw new Error("O arquivo não contém um JSON válido.");
        }
        dados = validarDados(dados);
        preencherForms(dados);
        invalidarCenarios();
        mensagem.textContent = "";
        mensagem.hidden = true;
        statusArquivo.textContent = `Arquivo “${file.name}” lido com sucesso. Dados carregados. Clique em Calcular para executar a simulação.`;

    } catch (erro) {
        statusArquivo.textContent = "";
        statusArquivo.hidden = true;
        mostrarErro(erro);
    } finally {
        arquivo.value = "";
    }
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        const dados = validarDados(capturaDadosform());
        atualizarTela(dados);
        minimizarCampo();
        prepararCenarios(dados);

    } catch (erro) {
        mostrarErro(erro);
    }
});



form.addEventListener("input", event => {
    if (event.target.type !== "file") invalidarCenarios();
});
