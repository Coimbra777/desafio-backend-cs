import { classifyTicket } from "../src/utils/classify-ticket";

describe("classifyTicket", () => {
  it('returns "ouvidoria" and "alta" for denúncia or assédio', () => {
    expect(classifyTicket("Quero denunciar um caso de assédio")).toEqual({
      channel: "ouvidoria",
      priority: "alta",
      requiresManualReview: false,
    });
  });

  it('returns "sac" and "baixa" for assinatura or cancelamento', () => {
    expect(classifyTicket("Quero cancelar minha assinatura")).toEqual({
      channel: "sac",
      priority: "baixa",
      requiresManualReview: false,
    });
  });

  it('returns "suporte_tecnico" and "media" for erro de acesso ao sistema', () => {
    expect(classifyTicket("Estou com erro de acesso ao sistema")).toEqual({
      channel: "suporte_tecnico",
      priority: "media",
      requiresManualReview: false,
    });
  });

  it('returns "financeiro" and "media" for reembolso ou cobrança', () => {
    expect(classifyTicket("Preciso de reembolso de uma cobrança")).toEqual({
      channel: "financeiro",
      priority: "media",
      requiresManualReview: false,
    });
  });

  it('returns "fora_do_escopo" and "baixa" for empty text', () => {
    expect(classifyTicket("")).toEqual({
      channel: "fora_do_escopo",
      priority: "baixa",
      requiresManualReview: true,
    });
  });

  it('returns "fora_do_escopo" and "baixa" for unrecognized text', () => {
    expect(
      classifyTicket("Gostaria de conversar sobre algo aleatorio"),
    ).toEqual({
      channel: "fora_do_escopo",
      priority: "baixa",
      requiresManualReview: true,
    });
  });
});
