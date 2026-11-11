// Valida todos os campos antes de alterar o formulário ou os gráficos.
export function validarDados(dados) {
    function numero(valor, campo) {
        if ((typeof valor !== "number" && typeof valor !== "string") ||
            (typeof valor === "string" && valor.trim() === "")) {
            throw new Error(campo + ": informe um número válido.");
        }
        const convertido = Number(valor);
        if (!Number.isFinite(convertido) || convertido < 0) {
            throw new Error(campo + ": informe um número não negativo.");
        }
        return convertido;
    }
    if (!Array.isArray(dados?.consumoPorHora) || dados.consumoPorHora.length !== 24) {
        throw new Error("O consumo por hora deve conter exatamente 24 valores.");
    }
    const resultado = {
        consumoPorHora: dados.consumoPorHora.map((valor, hora) => numero(valor, "Consumo da hora " + hora)),
        bandeiraAtiva: dados.bandeiraAtiva ?? "verde",
        tarifas: {},
        bandeiras: {},
        periodo: { dia: numero(dados.periodo?.dia, "Dias do mês") }
    };
    for (const campo of ["convencional", "foraPonta", "intermediaria", "ponta"]) {
        resultado.tarifas[campo] = numero(dados.tarifas?.[campo], "Tarifa " + campo);
    }
    for (const campo of ["verde", "amarelo", "vermelha1", "vermelha2"]) {
        resultado.bandeiras[campo] = numero(dados.bandeiras?.[campo], "Bandeira " + campo);
    }
    if (!Number.isInteger(resultado.periodo.dia) || resultado.periodo.dia < 28 || resultado.periodo.dia > 31) {
        throw new Error("O período deve ser um número inteiro entre 28 e 31 dias.");
    }
    if (!["verde", "amarelo", "vermelha1", "vermelha2"].includes(resultado.bandeiraAtiva)) {
        throw new Error("Selecione uma bandeira válida.");
    }
    return resultado;
}



// função para preencher o formulario atravez do arquivo json

export function preencherForms(dados){
    document.getElementById("bandeira-ativa").value = dados.bandeiraAtiva;
    dados.consumoPorHora.forEach((consumo, hora) => {
        const inputs = document.getElementById(`inputkwh-${hora}`);
        inputs.value = consumo;
    })

    // Inputs Tarifas
    const convencialInput = document.getElementById('convencional');
    convencialInput.value = dados.tarifas.convencional;

    const forainput = document.getElementById('fora-ponta')
    forainput.value = dados.tarifas.foraPonta;
    const intermediariaInput = document.getElementById('intermediaria');
    intermediariaInput.value = dados.tarifas.intermediaria;

    const pontaInput =  document.getElementById('ponta')
    pontaInput.value = dados.tarifas.ponta;

    //inputs bandeiras tarifarias

    const verdeInput = document.getElementById('verde')
    verdeInput.value = dados.bandeiras.verde;

    const amarelaInput = document.getElementById('amarelo')
    amarelaInput.value = dados.bandeiras.amarelo;

    const vermelha1Input = document.getElementById('vermelha1')
    vermelha1Input.value = dados.bandeiras.vermelha1;

    const vermelha2Input = document.getElementById('vermelha2')
    vermelha2Input.value = dados.bandeiras.vermelha2;

    //Periodos de simulação

    const inputPeriodo = document.getElementById('dia')
    inputPeriodo.value = dados.periodo.dia;

}

export function capturaDadosform(){

    const consumoPorHora = [];

    for(let hora = 0;hora < 24; hora++ ){
        const inputs = document.getElementById(`inputkwh-${hora}`);

        consumoPorHora.push(Number(inputs.value));
    }

    const dados = {
        consumoPorHora,
        bandeiraAtiva: document.getElementById("bandeira-ativa").value,

        tarifas: {
            convencional: Number(document.getElementById("convencional").value),
            foraPonta: Number(document.getElementById("fora-ponta").value),
            intermediaria: Number(document.getElementById("intermediaria").value),
            ponta: Number(document.getElementById("ponta").value)
        },
        bandeiras: {
            verde: Number(document.getElementById("verde").value),
            amarelo: Number(document.getElementById("amarelo").value),
            vermelha1: Number(document.getElementById("vermelha1").value),
            vermelha2: Number(document.getElementById("vermelha2").value)
        },
        periodo: {
            dia: Number(document.getElementById("dia").value),
        }
    };

    return dados;
}