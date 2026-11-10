
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

// Valores fictícios em kWh, apenas para testar o visual
const consumo = [
    0.15, 0.12, 0.10, 0.10, 0.12, 0.18,
    0.35, 0.55, 0.40, 0.30, 0.28, 0.38,
    0.48, 0.35, 0.30, 0.40, 0.55, 0.70,
    1.10, 1.40, 1.20, 0.65, 0.35, 0.20
];

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

const canvasPie = document.getElementById("chart-tarifario");

const consumoPorPosto = consumo.reduce((totais, valor, hora) => {
    const indice = hora >= 18 && hora <= 20 ? 2 : hora === 17 || hora === 21 ? 1 : 0;
    totais[indice] += valor;
    return totais;
}, [0, 0, 0]);

const graficoTarifca = new Chart(canvasPie, {
    type: "pie",
    data: {
        labels: ["Fora de ponta", "Intermediária", "Ponta"],
        datasets: [{
            data: consumoPorPosto,
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
    }
});

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

            data: [180, 150],

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

                    label: (context) =>

                        formatoMoedaComparacao.format(context.parsed.y)

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

                    callback: (valor) =>

                        formatoMoedaComparacao.format(valor)

                }

            }

        }

    }

});



