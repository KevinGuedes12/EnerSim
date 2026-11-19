import { calcularResultados, gerarDetalhamentoHorario } from "./calculos.js";

const formatoNumero = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2, maximumFractionDigits: 2
});
const formatoTarifa = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2, maximumFractionDigits: 4
});
const formatoDinheiro = new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL"
});
const bandeiras = [
    ["verde", "Verde"], ["amarelo", "Amarela"],
    ["vermelha1", "Vermelha 1"], ["vermelha2", "Vermelha 2"]
];

function preencherLinhas(id, linhas) {
    const fragmento = document.createDocumentFragment();
    for (const valores of linhas) {
        const linha = document.createElement("tr");
        for (const valor of valores) {
            const celula = document.createElement("td");
            celula.textContent = valor;
            linha.append(celula);
        }
        fragmento.append(linha);
    }
    document.getElementById(id).replaceChildren(fragmento);
}

// As tabelas, assim como os cartões, representam a última base calculada.
// O painel E se e os gráficos antes/depois apresentam o cenário alternativo.
export function atualizarTabelas(dados) {
    preencherLinhas("tabela-consumo", gerarDetalhamentoHorario(dados).map(item => [
        item.hora, formatoNumero.format(item.consumo), item.posto,
        formatoTarifa.format(item.tarifa), formatoDinheiro.format(item.custo)
    ]));

    // Reutilizar as mesmas fórmulas dos cartões evita divergência no resumo.
    const resultados = calcularResultados(dados);
    const semAdicional = calcularResultados({
        ...dados, bandeiras: { ...dados.bandeiras, [dados.bandeiraAtiva]: 0 }
    });
    const adicional = resultados.consumoMensal * dados.bandeiras[dados.bandeiraAtiva] / 100;
    for (const [id, valor] of Object.entries({
        "resumo-consumo-conv": semAdicional.custoConvencional,
        "resumo-consumo-branca": semAdicional.custoBranca,
        "resumo-bandeira-conv": adicional,
        "resumo-bandeira-branca": adicional,
        "resumo-total-conv": resultados.custoConvencional,
        "resumo-total-branca": resultados.custoBranca
    })) document.getElementById(id).textContent = formatoDinheiro.format(valor);

    preencherLinhas("tabela-bandeiras", bandeiras.map(([chave, nome]) => {
        const conta = calcularResultados({ ...dados, bandeiraAtiva: chave });
        return [nome, formatoDinheiro.format(conta.custoConvencional), formatoDinheiro.format(conta.custoBranca)];
    }));
}
