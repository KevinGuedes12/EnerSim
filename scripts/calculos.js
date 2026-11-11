
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
export function calcularResultados(dados) {
    const faixas = consumoPorFaixa(dados.consumoPorHora);
    const consumoDiario = faixas.total;
    const consumoMensal = consumoDiario * dados.periodo.dia;
    const adicionalBandeira = consumoMensal * dados.bandeiras[dados.bandeiraAtiva] / 100;
    const custoConvencional = consumoMensal * dados.tarifas.convencional + adicionalBandeira;
    const custoBranca = (
        faixas.foraPonta * dados.tarifas.foraPonta +
        faixas.intermediario * dados.tarifas.intermediaria +
        faixas.ponta * dados.tarifas.ponta
    ) * dados.periodo.dia + adicionalBandeira;
    return { consumoDiario, consumoMensal, custoConvencional, custoBranca };
}

export function atualizarResultados(dados) {
    const resultados = calcularResultados(dados);
    animarNumero(document.getElementById("consumo-diario"), resultados.consumoDiario, formatarConsumo);
    animarNumero(document.getElementById("consumo-mensal"), resultados.consumoMensal, formatarConsumo);
    animarNumero(document.getElementById("custo-convencional"), resultados.custoConvencional, formatarDinheiro);
    animarNumero(document.getElementById("custo-branca"), resultados.custoBranca, formatarDinheiro);
    return resultados;
}
