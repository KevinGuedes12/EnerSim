
// função de animação
function animarNumero(elemento, valorFinal, formatar, duracao = 1000) {
    let inicio;

    function atualizar(agora) {
        if (inicio === undefined) inicio = agora;

        const progresso = Math.min((agora - inicio) / duracao, 1);
        const suavizado = 1 - Math.pow(1 - progresso, 3);
        const valorAtual = valorFinal * suavizado;

        elemento.textContent = formatar(valorAtual);

        if (progresso < 1) {
            requestAnimationFrame(atualizar);
        }
    }

    requestAnimationFrame(atualizar);
}


//formatação de compo

const formatarConsumo = valor =>
    `${valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} kWh`;

const formatarDinheiro = valor =>
    valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });


// Consumo por faixa tarifiria

export function consumoPorFaixa(consumoPorHora){
    const consumo = {
        foraPonta: 0,
        intermediario: 0,
        ponta: 0,
        total: 0
    }

    consumoPorHora.forEach((valor, hora) => {
        if (hora >= 18 && hora < 21) {
            consumo.ponta += valor;
        } else if (hora === 17 || hora === 21) {
            consumo.intermediario += valor;
        } else {
            consumo.foraPonta += valor;
        }
    })
     consumo.total = consumo.foraPonta + consumo.intermediario + consumo.ponta;
    //console.log(consumo.total);
    return consumo;
}
// função para atualizar e calculo os dados principais da simulação
export function atualizarResultados(dados){

    // calculo de consumo Diario
    function calculoDiario(){
        const outputDiario = document.getElementById("consumo-diario");
        const total = dados.consumoPorHora.reduce((total, consumo) => total + consumo, 0);

        animarNumero(outputDiario, total, formatarConsumo);
        return total;
    }
    const consumoDiarioTotal = calculoDiario();

    // calculo de consumo mensal
    function calculoMensal(){
        const outputMensal = document.getElementById("consumo-mensal");
        const consumoMensal = consumoDiarioTotal * dados.periodo.dia;

        animarNumero(outputMensal, consumoMensal, formatarConsumo);
        return consumoMensal;
    }
    const consumoMensalTotal = calculoMensal();

    // calculo da conta convencional

    function calculoConvencional(){
        const outputConvencional = document.getElementById('custo-convencional');
        const consumoConvecional = consumoMensalTotal * dados.tarifas.convencional;

        animarNumero(outputConvencional, consumoConvecional, formatarDinheiro);

    }
    calculoConvencional();

    // calculo conta brancad

    function calculoContaBranca(){
        const consumoFaixa = consumoPorFaixa(dados.consumoPorHora);

        const outputContaBranca = document.getElementById('custo-branca');
        const consumoContaBranca = (
            (consumoFaixa.foraPonta * dados.tarifas.foraPonta) +
            (consumoFaixa.intermediario * dados.tarifas.intermediaria) +
            (consumoFaixa.ponta * dados.tarifas.ponta)) * dados.periodo.dia;


        animarNumero(outputContaBranca, consumoContaBranca, formatarDinheiro);
    }
    calculoContaBranca();
}








