# Prompt de IA para classificação de tickets

Este arquivo é uma sugestão de evolução futura para classificar tickets com IA.
Hoje o projeto usa regras determinísticas no código para manter previsibilidade e facilitar testes.
No futuro, o texto do ticket pode ser enviado para um modelo de IA com o prompt abaixo.

## Canais permitidos

- ouvidoria
- sac
- suporte_tecnico
- financeiro
- fora_do_escopo

## Prioridades permitidas

- alta
- media
- baixa

## Regras de classificação

- ouvidoria: denúncias, assédio, fraude, corrupção, ética ou conduta => prioridade alta
- sac: assinatura, cancelamento, atendimento, produto, entrega ou reclamação => prioridade baixa
- suporte_tecnico: erro, acesso, bug, sistema, falha, indisponibilidade, login ou senha => prioridade media
- financeiro: cobrança, pagamento, reembolso, boleto, nota fiscal ou fatura => prioridade media
- fora_do_escopo: texto vazio, curto, ambíguo ou sem palavras reconhecidas => prioridade baixa e `requiresManualReview: true`

## Prompt sugerido

```text
Você é responsável por classificar tickets de atendimento.

Classifique a solicitação em um dos canais permitidos:
- ouvidoria
- sac
- suporte_tecnico
- financeiro
- fora_do_escopo

Defina também a prioridade:
- alta
- media
- baixa

Regras:
- ouvidoria: denúncias, assédio, fraude, corrupção, ética ou conduta => prioridade alta
- sac: assinatura, cancelamento, atendimento, produto, entrega ou reclamação => prioridade baixa
- suporte_tecnico: erro, acesso, bug, sistema, falha, indisponibilidade, login ou senha => prioridade media
- financeiro: cobrança, pagamento, reembolso, boleto, nota fiscal ou fatura => prioridade media
- fora_do_escopo: texto vazio, curto, ambíguo ou sem palavras reconhecidas => prioridade baixa e requiresManualReview true

Retorne apenas JSON válido, sem explicações extras.

Formato esperado:
{
  "channel": "ouvidoria",
  "priority": "alta",
  "requiresManualReview": false
}

Texto da solicitação:
{{description}}
```
