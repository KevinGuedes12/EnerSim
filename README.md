<div align="center">

# ⚡ EnerSim

### Simulador de Conta de Energia e Uso Racional

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

[🔗 Acessar projeto](https://enersim.vercel.app/)

</div>

---
## 🛠️ Tecnologias utilizadas
    
- HTML5 — Estrutura da aplicação.
- CSS3 — Estilização e responsividade.
- JavaScript (ES2022, com módulos ES) — Lógica e cálculos da simulação.
- Chart.js — Visualização dos dados em gráficos, carregada por CDN.
- Font Awesome 6.7.2 — Ícones, carregados por CDN.

Use uma versão atual do Edge, Chrome ou Firefox. A aplicação não precisa de
compilação nem instalação de pacotes; requer um servidor HTTP local e internet
para carregar Chart.js e Font Awesome. Abrir o HTML diretamente com `file://`
pode bloquear os módulos JavaScript.

## 🚀 Como executar
1. Clone o repositório do GitHub.
2. Abra a pasta no VS Code.
3. Instale a extensão Live Server.
4. Clique com o botão direito no index.html.
5. Selecione "Open with Live Server"

Alternativa com Python 3 instalado: na pasta do projeto, execute
`python -m http.server 8000 --bind 127.0.0.1` e abra `http://127.0.0.1:8000`.

## Como simular

1. Importe `Dados/tema9-edital.json` (referência didática) ou preencha as 24 horas,
   tarifas, bandeiras e período manualmente. `Dados/Cenario_test.json` continua
   disponível como outro exemplo do projeto.
2. Revise os campos e clique em **Calcular Simulação**. A importação apenas
   preenche o formulário; não calcula automaticamente.
3. Consulte cartões, consumo por posto, tabela horária, resumo mensal e as oito
   contas da tabela modalidade × bandeira.
4. Em **E se…?**, desloque 50% da ponta ou ajuste as parcelas estimadas do banho
   e da máquina de lavar. Os gráficos comparam antes/depois sem alterar a base.
5. No gráfico de custos, selecione **Por bandeira** para comparar as duas
   modalidades nas quatro bandeiras. **Restaurar cenário base** remove a comparação
   do cenário; alterar entradas exige clicar novamente em Calcular.

Os cartões, a distribuição por posto e as tabelas sempre mostram a última base
calculada. O gráfico adicional de bandeiras mostra os valores em R$/100 kWh;
o comparador por bandeira mostra o custo mensal completo das duas modalidades.

## Modelo e fontes

Fonte didática: Edital do Trabalho Prático da Unidade IV (2026), Tema 9
(pp. 17–18) e Tabela II.9 (pp. 23–24). O modelo repete o mesmo perfil diário
em todos os dias do mês, conforme simplificação expressa do edital.

- Fora de ponta: 00–16h e 22–23h; intermediário: 17h e 21h; ponta: 18–20h.
- Consumo mensal = soma dos 24 consumos horários × dias do período.
- Convencional = consumo mensal × tarifa única + adicional da bandeira.
- Branca = soma diária de consumo × tarifa de cada posto, multiplicada pelos
  dias, mais adicional da bandeira.
- Adicional = consumo mensal × valor da bandeira / 100.
- O detalhamento horário apresenta o custo da tarifa branca sem bandeira.
  Arredondamos apenas para exibição; somar linhas já arredondadas pode produzir
  diferença de centavos em relação ao total calculado.

As parcelas de banho e lavagem são hipóteses editáveis sobre o consumo da hora
original, não medições por aparelho. Deslocar energia conserva o total de kWh;
as retiradas combinadas de uma hora não podem ultrapassar 100%.

Com os dados originais: 10,1 kWh/dia e 303 kWh/mês; bandeira verde:
R$ 287,85 na convencional e R$ 350,10 na branca. Mover 50% da ponta para 22h
mantém 303 kWh/mês e reduz a branca para R$ 302,85 (economia de R$ 47,25).

As imagens de `graficos/` registram a execução desses dados e indicam sua origem.
Elas devem ser regeneradas para os dados finais escolhidos pelo grupo.
A referência original não substitui as três variações de até ±10%, com
justificativa, exigidas pelo item 8.2, nem a alternativa de fontes reais do 8.3.
O grupo também deve documentar as hipóteses dos hábitos no relatório.

## Validação local

A suíte local usa Node.js 24, Playwright e Edge. Quando os arquivos de testes
locais estiverem presentes, execute `npm ci` e `npm test` (no PowerShell,
`npm.cmd test`). Esses arquivos estão excluídos do Git pela configuração
preexistente do projeto; não são necessários para executar o simulador.

## Execução Online
- Também é possível acessar diretamente a versão hospedada na Vercel:

[🔗 Acessar projeto](https://enersim.vercel.app/)


