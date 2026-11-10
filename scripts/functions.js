

// função para preencher o formulario atravez do arquivo json

export function preencherForms(dados){
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

        tarifas: {
            convencional: Number(document.getElementById("convencional").value),
            foraPonta: Number(document.getElementById("fora-ponta").value),
            intermediaria: Number(document.getElementById("intermediaria").value),
            ponta: Number(document.getElementById("ponta").value)
        },
        periodo: {
            dia: Number(document.getElementById("dia").value),
        }
    };

    return dados;
}