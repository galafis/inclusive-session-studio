# Unitree Go2 PRO development roadmap

<!-- bilingual-support -->

[English](#english) · [Português](#português)

## English

## Program direction

Inclusive Session Studio is a working software prototype in an independent Brazilian robotics program centered on the **Unitree Go2 PRO**. Its focus is inclusive educational activities with children and adults, including autistic participants.

The current release provides executable behavior, reproducible examples, a browser interface, automated tests, and written model assumptions. Physical validation has not been performed. The next step is to establish a measured, controlled relationship between the software and supported platform operation.

## Why Go2 PRO is a relevant reference platform

PRO provides a concrete reference for planning supervised quadruped demonstrations. The portfolio is organized around accessible movement, educational search exercises, and optional participant-led observation. The listed side-follow feature motivates investigation of person–platform interaction; following a person does not establish the ability to guide one.

Unitree's standard PRO configuration is not listed for secondary development. Custom integration therefore requires written confirmation of supported interfaces or a development configuration such as EDU. This is a procurement and architecture requirement, not an implemented capability. [Official Go2 configuration reference](https://www.unitree.com/go2/), checked September 10, 2026.

## Three separate implementation layers

| Layer                                      | Status      | What it contains                                                                                   |
| ------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------- |
| Software workbench                         | Implemented | Browser controls, domain rules, synthetic examples, tests, and exports                             |
| Operator-supervised platform demonstration | Planned     | Prepared environment, supported vendor controls, observation protocol, and interruption procedures |
| Custom hardware integration                | Conditional | Confirmed access, adapter implementation, interface validation, and separate test evidence         |

The browser currently sends no commands to a robot and consumes no live sensor stream. Software results must not be presented as measurements from a Go2 PRO.

## Proposed demonstration protocol

Prepare an optional observation plan together. A stationary Go2 PRO may be the object of observation only after the environment, distance, and equipment state have been assessed. The person chooses whether and how to participate. A facilitator operates the planner; another qualified person is responsible for the equipment when needed. The planner never activates the robot.

### Measurements and records

Whether the person can identify the next invitation, find a pause or end option, choose distance, decline participation, and select preferred timing or display settings. Collect only agreed usability observations.

Keep the repository version, scenario file, control settings, platform configuration, environment description, and observation record together. Label synthetic values and measured values separately. Record incomplete and interrupted demonstrations as well as successful ones.

### Acceptance criteria

- The plan can be explained in the participant’s preferred communication.
- Pausing, declining, skipping, and ending remain available throughout.
- A timer reaching zero cannot initiate movement or change the activity.
- No therapeutic or diagnostic conclusion is drawn from a usability observation.

## Development stages

| Stage                                | Deliverable                              | Completion condition                                                                             |
| ------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Software baseline                    | Versioned application and examples       | Tests pass and principal browser journeys are verified                                           |
| Platform scope                       | Configuration and interface record       | Supported controls, access, and operating boundaries confirmed                                   |
| Bench review                         | Written demonstration protocol           | Setup, stop conditions, measurements, and responsibilities reviewed                              |
| Closed-course comparison             | Reproducible observation record          | Software and physical observations can be compared without unsupported assumptions               |
| Practitioner review                  | Documented feedback and revisions        | Relevant professionals can assess usefulness and limitations                                     |
| Participant review, where applicable | Accessible review materials and findings | Appropriate review, consent or assent, withdrawal options, and agreed data handling are in place |

These are planned stages, not completed studies or promised dates. A failed acceptance criterion is a reason to revise the setup or implementation before advancing.

## Future interface boundary

The planning tool deliberately remains independent of robot actuation. Any later operator-facing event interface would require a separate design review. Participant pause, refusal, and end signals must be meaningful regardless of whether the participant operates a screen. No behavioral scoring or clinical outcome tracking is proposed.

## How the three projects fit together

- [Accessible Route Lab](https://github.com/galafis/accessible-route-lab) makes route and clearance assumptions inspectable.
- [Rescue Scenario Lab](https://github.com/galafis/rescue-scenario-lab) makes search, communication, and return decisions reproducible.
- [Inclusive Session Studio](https://github.com/galafis/inclusive-session-studio) gives educational activities predictable structure and explicit participant choice.

Together they demonstrate a focused software foundation for robotics, accessibility, and education. They do not claim vendor endorsement, a university partnership, emergency deployment, validated physical guidance, or clinical benefit.

## Maintainer

**Gabriel Demetrios Lafis** · Brazil  
Institutional contact: **gabrieldemetrioslafis@usp.br**  
[Public portfolio](https://github.com/galafis)

## Português

### Direção do programa

Inclusive Session Studio é um protótipo funcional de um programa brasileiro independente de robótica centrado no **Unitree Go2 PRO**, com foco em atividades educacionais inclusivas com crianças e adultos, incluindo participantes autistas. A versão atual entrega código executável, exemplos, interface, testes e premissas documentadas. Ainda não houve validação física.

### Plataforma de referência e acesso

O PRO é uma referência concreta para planejar demonstrações supervisionadas de quadrúpedes em mobilidade, busca educacional e observação opcional. O acompanhamento lateral anunciado motiva investigar interação pessoa–plataforma; acompanhar uma pessoa não comprova capacidade de guiá-la.

A configuração PRO padrão não está listada para desenvolvimento secundário. Integração personalizada exige confirmação escrita das interfaces suportadas ou uma configuração de desenvolvimento, como EDU. É uma condição de arquitetura e aquisição, não uma capacidade implementada. [Comparação oficial Go2](https://www.unitree.com/go2/), verificada em 10 de setembro de 2026.

| Camada                      | Estado       | Conteúdo                                                                   |
| --------------------------- | ------------ | -------------------------------------------------------------------------- |
| Bancada de software         | Implementada | Controles, regras, exemplos sintéticos, testes e exportações               |
| Demonstração supervisionada | Planejada    | Ambiente preparado, controles suportados, observação e interrupção         |
| Integração personalizada    | Condicional  | Acesso confirmado, adaptador, validação de interface e evidências próprias |

O navegador não envia comandos ao robô nem recebe sensores ao vivo. Resultados de software não são medições do Go2 PRO.

### Protocolo proposto

Preparar conjuntamente um plano de observação opcional. Um Go2 PRO parado pode ser observado após avaliar ambiente, distância e estado do equipamento. A pessoa escolhe como e se participa. Um facilitador opera o plano; outra pessoa qualificada cuida do equipamento quando necessário. O planejador nunca ativa o robô.

**Medições e registros:** Identificação do próximo convite, acesso a pausa e encerramento, escolha de distância, recusa e preferências de tempo e exibição. Coletar apenas observações de usabilidade acordadas.

Guardar versão do repositório, arquivo, controles, configuração do equipamento, ambiente e observações juntos. Identificar separadamente dados sintéticos e medidos; incluir demonstrações interrompidas e incompletas.

**Critérios de aceitação:** Explicar pela comunicação preferida; preservar pausa, recusa, pulo e encerramento; impedir que o cronômetro ative movimento ou mude a atividade; não tirar conclusões terapêuticas ou diagnósticas.

### Etapas e condições

| Etapa                                       | Entrega                               | Condição para avançar                                                      |
| ------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| Base de software                            | Aplicação e exemplos versionados      | Testes e jornadas principais verificados                                   |
| Escopo da plataforma                        | Registro de configuração e interfaces | Controles, acesso e limites confirmados                                    |
| Revisão de bancada                          | Protocolo escrito                     | Revisão de montagem, paradas, medições e responsabilidades                 |
| Comparação em percurso fechado              | Observações reproduzíveis             | Comparação sem premissas não sustentadas                                   |
| Revisão profissional                        | Comentários e revisões                | Avaliação de utilidade e limites por profissionais                         |
| Revisão com participantes, quando aplicável | Materiais acessíveis e resultados     | Revisão apropriada, consentimento/assentimento, retirada e dados acordados |

São etapas propostas, sem estudos concluídos ou datas prometidas. Se um critério falhar, revisar a implementação ou montagem antes de avançar.

### Limite da interface futura

O planejador permanece independente do acionamento do robô. Uma futura interface de eventos para o operador requer revisão própria. Sinais de pausa, recusa e encerramento valem mesmo sem operar a tela. Não se propõe pontuação comportamental ou acompanhamento de resultados clínicos.

### Como os projetos se complementam

- [Accessible Route Lab](https://github.com/galafis/accessible-route-lab): torna premissas de rota e folga inspecionáveis.
- [Rescue Scenario Lab](https://github.com/galafis/rescue-scenario-lab): reproduz decisões de busca, comunicação e retorno.
- [Inclusive Session Studio](https://github.com/galafis/inclusive-session-studio): estrutura atividades previsíveis com escolha explícita.

O conjunto apresenta uma base de software para robótica, acessibilidade e educação, sem endosso de fabricante, parceria universitária, prontidão para emergência, orientação física validada ou benefício clínico.

**Responsável:** Gabriel Demetrios Lafis · Brasil. Contato institucional: **gabrieldemetrioslafis@usp.br**. [Portfólio público](https://github.com/galafis).
