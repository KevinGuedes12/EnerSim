import { consumoPorFaixa } from "./calculos.js";

const canvasConsumo = document.getElementById("chart-hourly");
const formatoConsumo = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

// Horários de 00h até 23h
const horarios = Array.from(
    { length: 24 },
    (_, hora) => `${String(hora).padStart(2, "0")}h`
);


//função para atualizar dados do grafico de consumo
let consumo = Array(24).fill(0);


export function atualizarGrafico(consumoPorHora){
    consumo = consumoPorHora;
    graficoConsumo.data.datasets[0].data = consumo;
    graficoConsumo.update();
    atualizarConsumoTarifario(consumoPorHora);
}


// Cores de acordo com o posto tarifário
const cores = horarios.map((_, hora) => {
    if (hora >= 18 && hora <= 20) {
        return "#F46368"; // Ponta
    }

    if (hora === 17 || hora === 21) {
        return "#F5BC42"; // Intermediária
    }

    return "#25C99A"; // Fora de ponta
});

const graficoConsumo = new Chart(canvasConsumo, {
    type: "bar",

    data: {
        labels: horarios,

        datasets: [{
            label: "Consumo (kWh)",
            data: consumo,
            backgroundColor: cores,
            borderRadius: 4,
            maxBarThickness: 22
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,
        locale: "pt-BR",

        plugins: {
            legend: {
                display: false
            },

            tooltip: {
                callbacks: {
                    label: (context) =>
                        `Consumo: ${formatoConsumo.format(context.parsed.y)} kWh`
                }
            }
        },

        scales: {
            x: {
                grid: {
                    display: false
                },

                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    autoSkipPadding: 12,
                    color: "#52677D",
                    font: {
                        size: 14
                    }
                },

                title: {
                    display: true,
                    text: "Horário",
                    font: {
                        size: 18
                    }
                }
            },

            y: {
                beginAtZero: true,
                grid: {
                    color: "#E8EEF4"
                },

                title: {
                    display: true,
                    text: "Consumo (kWh)",
                    font: {
                        size: 14
                    }
                },

                ticks: {
                    color: "#52677D",
                    font: {
                        size: 14
                    }
                }
            }
        }
    }
});

// grafico de Consumo por postos tarifários

const canvasdoughnut = document.getElementById("chart-tarifario");
const textoCentral = {
    id: 'textoCentral',
    afterDraw(chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const centroX = (chartArea.left + chartArea.right) / 2;
        const centroY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        //valor central do doughunt
        ctx.font = '600 20px Inter, sans-serif';
        ctx.fillStyle = "#1e293b";
        const valores = chart.data.datasets[0].data;
        const total = valores.reduce((soma, valor) => soma + Number(valor), 0);
        ctx.fillText(formatoConsumo.format(total), centroX, centroY - 10);

        // texto segundario
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = "#64748b";
        ctx.fillText('kWh / dia', centroX, centroY + 15);

        ctx.restore();
    }
}

const graficoTarifca = new Chart(canvasdoughnut, {
    type: "doughnut",
    data: {
        labels: ["Fora de ponta", "Intermediária", "Ponta"],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: ["#25C99A", "#F5BC42", "#F46368"],
            borderColor: "#FFFFFF",
            borderWidth: 3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        locale: "pt-BR",
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: ${formatoConsumo.format(context.parsed)} kWh`
                }
            }
        }
    },
    plugins: [textoCentral]

});

function atualizarConsumoTarifario(consumoPorHora) {
    const totalConsumo = consumoPorFaixa(consumoPorHora);
    const valores = [
        totalConsumo.foraPonta,
        totalConsumo.intermediario,
        totalConsumo.ponta
    ];
    const postos = ["fora", "inter", "ponta"];

    valores.forEach((consumo, indice) => {
        const percentual = totalConsumo.total > 0
            ? (consumo / totalConsumo.total) * 100
            : 0;
        const legenda = document.getElementById(`legenda-${postos[indice]}`);

        legenda.textContent = `${formatoConsumo.format(consumo)} kWh (${formatoConsumo.format(percentual)}%)`;
    });

    graficoTarifca.data.datasets[0].data = valores;
    graficoTarifca.update();
}

// gráfico de Comparação de custos mensais
const canvasComparacao = document.getElementById("chart-comparacao");
const formatoMoedaComparacao = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

const graficoComparacao = new Chart(canvasComparacao, {
    type: "bar",
    data: {
        labels: ["Convencional", "Branca"],
        datasets: [{
            label: "Custo mensal",
            data: [0, 0],
            backgroundColor: ["#0067FF", "#25C99A"],
            borderRadius: 4,
            maxBarThickness: 48
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        locale: "pt-BR",
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => formatoMoedaComparacao.format(context.parsed.y)
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#52677D"
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "#E8EEF4"
                },
                ticks: {
                    color: "#52677D",
                    callback: (valor) => formatoMoedaComparacao.format(valor)
                }
            }
        }
    }
});

export function atualizarComparacao(resultados) {
    graficoComparacao.data.datasets[0].data = [resultados.custoConvencional, resultados.custoBranca];
    graficoComparacao.update();
}
