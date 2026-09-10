# Worked examples · Exemplos comentados

[English](#english) · [Português](#português)

## English

These are complete synthetic inputs and committed expected results. Run `npm run examples` from the repository root; every case is also part of `npm test`. A mismatch exits unsuccessfully instead of silently updating the expected answer. Inspect and justify changed outputs before replacing fixtures.

Choose a template or import a plan. Each expected result lets the entire first activity expire: the index stays at 0 and the state becomes ready. Only an explicit complete action advances to index 1. Portuguese input variants are linked below; their IDs, categories and durations match the English versions.

## Português

As entradas sintéticas são completas e acompanham resultados esperados versionados. Execute `npm run examples` na raiz; cada caso também faz parte de `npm test`. Uma divergência encerra a verificação com falha, sem atualizar silenciosamente a resposta esperada. Inspecione e justifique mudanças antes de substituir os resultados.

Selecione um modelo ou importe um plano. O resultado esperado deixa expirar toda a primeira atividade: o índice permanece 0 e o estado se torna ready. Apenas uma ação explícita de conclusão avança para o índice 1. Os arquivos em português abaixo preservam identificadores, categorias e durações das versões em inglês.

## Inputs and results · Entradas e resultados

| Scenario · Cenário                                                                        | Input · Entrada                                  | Result · Resultado                                           | Expected evidence · Evidência esperada                                                                 |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Gentle introduction and explicit pacing<br>Introdução tranquila e ritmo escolhido         | [gentle.json](../examples/gentle.json)           | [Expected / Esperado](../examples/gentle.expected.json)      | 4 activities / atividades; 12 min; clock / relógio: ready, index=0; choice / escolha: running, index=1 |
| Movement with optional pauses<br>Movimento com pausas opcionais                           | [movement.json](../examples/movement.json)       | [Expected / Esperado](../examples/movement.expected.json)    | 4 activities / atividades; 11 min; clock / relógio: ready, index=0; choice / escolha: running, index=1 |
| Optional observation of stationary equipment<br>Observação opcional de equipamento parado | [observation.json](../examples/observation.json) | [Expected / Esperado](../examples/observation.expected.json) | 4 activities / atividades; 11 min; clock / relógio: ready, index=0; choice / escolha: running, index=1 |

Portuguese plans / Planos em português: [gentle.pt.json](../examples/gentle.pt.json) · [movement.pt.json](../examples/movement.pt.json) · [observation.pt.json](../examples/observation.pt.json)

No result is a hardware measurement or a participant outcome. / Nenhum resultado representa medição de hardware ou resultado com participantes.
