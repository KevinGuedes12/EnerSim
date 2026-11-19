# Gráficos de referência do EnerSim

Imagens geradas pela interface do programa com Chart.js 4.6.1, usando os dados didáticos originais de `Dados/tema9-edital.json`. Fonte: Edital do Trabalho Prático da Unidade IV (2026), Tema 9 e Tabela II.9, páginas 17–18 e 23–24. Os intervalos 0–5 e 8–16 representam o consumo de cada hora. Todos os dias são iguais, conforme a simplificação do edital.

- `perfil-horario-base.png`: perfil diário de 10,1 kWh, com cores por posto tarifário; 303 kWh em 30 dias.
- `contas-antes-depois-50.png`: bandeira verde; deslocamento de 50% de cada hora de ponta (18h, 19h e 20h) para 22h. A conta convencional permanece R$ 287,85; a branca passa de R$ 350,10 para R$ 302,85. Economia na branca: R$ 47,25, conservando os 303 kWh/mês. A branca continua R$ 15,00 acima da convencional.
- `contas-quatro-bandeiras.png`: contas do cenário base nas quatro bandeiras, nas modalidades convencional e branca.

| Bandeira | Convencional (R$) | Branca (R$) |
|---|---:|---:|
| Verde | 287,85 | 350,10 |
| Amarela | 293,56 | 355,81 |
| Vermelha 1 | 301,37 | 363,62 |
| Vermelha 2 | 311,72 | 373,97 |

As imagens incluem o título, os eixos e as legendas dos cards do programa, após finalizar a animação. Foram capturadas em navegador Edge headless com a CLI chrome-devtools; não foram desenhadas separadamente ou preenchidas com resultados manuais.

## Regenerar com os dados finais do grupo

1. Execute o projeto conforme o README principal.
2. Importe o JSON escolhido e clique em **Calcular Simulação**.
3. Capture o card completo **Perfil de consumo diário**, incluindo título, eixos e legenda.
4. No painel **E se…?**, selecione 22h e clique em **Simular 50% da ponta**. No comparador, selecione **Antes/depois**, aguarde a animação e capture o card completo.
5. Selecione **Por bandeira**, aguarde a animação e capture o mesmo card completo.

**Estes são gráficos de referência dos dados originais.** O grupo deve regenerá-los ao definir seus dados finais e documentar no relatório as alterações de pelo menos três entradas em até ±10%, conforme item 8.2, ou as fontes de dados reais conforme item 8.3. A escolha de 22h é uma hipótese de destino fora da ponta, não uma determinação do edital.
