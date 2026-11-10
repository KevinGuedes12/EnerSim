import {atualizarGrafico} from "./chart.js";
import {preencherForms, capturaDadosform} from "./functions.js";
import {atualizarResultados} from "./calculos.js";

//captura e leitura de arquivos json

const arquivo = document.getElementById("json-file")

arquivo.addEventListener("change", async(event) => {
        const file = event.target.files[0];

        if(!file) return;
        try{
            // leitura do arquivo
            const conteudo = await file.text();
            // converção para json
            const dados = JSON.parse(conteudo);
            const consumoPorHora = dados.consumoPorHora;
            atualizarGrafico(consumoPorHora);
            preencherForms(dados);
            atualizarResultados(dados);
            //console.log(dados);
        }catch(err){
            console.error("Error ao ler o arquivo:", err);
        }
})

// captura de dados manuais

const form = document.getElementById('Formulario')

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const dados = capturaDadosform();

    atualizarResultados(dados);
    atualizarGrafico(dados.consumoPorHora);
    //console.log(data);
})




