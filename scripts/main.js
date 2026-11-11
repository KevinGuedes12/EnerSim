import { atualizarGrafico, atualizarComparacao } from "./chart.js";
import { preencherForms, capturaDadosform, validarDados } from "./functions.js";
import { atualizarResultados } from "./calculos.js";

const arquivo = document.getElementById("json-file");
const form = document.getElementById("Formulario");
const mensagem = document.getElementById("erro-dados");

function mostrarErro(erro) {
    mensagem.textContent = erro.message;
    mensagem.hidden = false;
    mensagem.closest("details").open = true;
}

function atualizarTela(dados) {
    const resultados = atualizarResultados(dados);
    atualizarComparacao(resultados);
    atualizarGrafico(dados.consumoPorHora);
    mensagem.textContent = "";
    mensagem.hidden = true;
}

arquivo.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
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
        atualizarTela(dados);
    } catch (erro) {
        mostrarErro(erro);
    } finally {
        arquivo.value = "";
    }
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        atualizarTela(validarDados(capturaDadosform()));
    } catch (erro) {
        mostrarErro(erro);
    }
});
