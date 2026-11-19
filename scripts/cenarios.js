import { validarDados } from "./functions.js";

// deslocar energia, sem reduzir os kWh totais.
// Cada parcela é estimada sobre a hora do perfil BASE, nunca sobre outro cenário.
export function foraDaPonta(hora) {
    return Number.isInteger(hora) && hora >= 0 && hora < 24 && (hora < 17 || hora > 21);
}

export function deslocarHabitos(dados, movimentos) {
    const base = validarDados(dados);
    const retiradas = Array(24).fill(0);
    const entradas = Array(24).fill(0);
    let deslocado = 0;
    for (const { origem, destino, percentual } of movimentos) {
        if (!Number.isInteger(origem) || origem < 0 || origem > 23) {
            throw new Error("Escolha um horário de origem válido.");
        }
        if (!foraDaPonta(destino)) {
            throw new Error("O destino deve estar fora da ponta (00h–16h, 22h ou 23h).");
        }
        if (!Number.isFinite(percentual) || percentual < 0 || percentual > 100) {
            throw new Error("A parcela de cada hábito deve estar entre 0% e 100%.");
        }
        const energia = base.consumoPorHora[origem] * percentual / 100;
        retiradas[origem] += energia;
        entradas[destino] += energia;
        if (origem !== destino) deslocado += energia;
    }
    // Verificar as retiradas juntas impede usar duas vezes a energia da mesma hora.
    for (let hora = 0; hora < 24; hora++) {
        if (retiradas[hora] > base.consumoPorHora[hora] + 1e-9) {
            throw new Error("Os hábitos ultrapassam 100% do consumo das " + hora + "h. Reduza as parcelas.");
        }
    }
    const perfil = base.consumoPorHora.map((valor, hora) =>
        Math.max(0, valor - retiradas[hora]) + entradas[hora]);
    return { dados: { ...base, consumoPorHora: perfil }, deslocado };
}

// Metade de CADA hora de ponta (18, 19, 20), somada ao destino escolhido.
export function deslocarMetadeDaPonta(dados, destino) {
    return deslocarHabitos(dados, [18, 19, 20].map(origem => ({
        origem, destino, percentual: 50
    })));
}
