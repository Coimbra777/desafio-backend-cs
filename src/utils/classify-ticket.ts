type TicketClassification = {
  channel: string;
  priority: string;
  requiresManualReview: boolean;
};

const MIN_DESCRIPTION_LENGTH = 3;

const ouvidoriaKeywords = [
  "denuncia",
  "assedio",
  "fraude",
  "corrupcao",
  "etica",
  "conduta",
];

const sacKeywords = [
  "assinatura",
  "cancelamento",
  "atendimento",
  "produto",
  "entrega",
  "reclamacao",
];

const suporteTecnicoKeywords = [
  "erro",
  "acesso",
  "bug",
  "sistema",
  "falha",
  "indisponibilidade",
  "login",
  "senha",
];

const financeiroKeywords = [
  "cobranca",
  "pagamento",
  "reembolso",
  "boleto",
  "nota fiscal",
  "fatura",
];

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function hasKeyword(description: string, keywords: string[]) {
  return keywords.some((keyword) => description.includes(keyword));
}

function classifyTicket(description: string): TicketClassification {
  const normalizedDescription = normalizeText(description);

  if (normalizedDescription.length < MIN_DESCRIPTION_LENGTH) {
    return {
      channel: "fora_do_escopo",
      priority: "baixa",
      requiresManualReview: true,
    };
  }

  if (hasKeyword(normalizedDescription, ouvidoriaKeywords)) {
    return {
      channel: "ouvidoria",
      priority: "alta",
      requiresManualReview: false,
    };
  }

  if (hasKeyword(normalizedDescription, sacKeywords)) {
    return {
      channel: "sac",
      priority: "baixa",
      requiresManualReview: false,
    };
  }

  if (hasKeyword(normalizedDescription, suporteTecnicoKeywords)) {
    return {
      channel: "suporte_tecnico",
      priority: "media",
      requiresManualReview: false,
    };
  }

  if (hasKeyword(normalizedDescription, financeiroKeywords)) {
    return {
      channel: "financeiro",
      priority: "media",
      requiresManualReview: false,
    };
  }

  return {
    channel: "fora_do_escopo",
    priority: "baixa",
    requiresManualReview: true,
  };
}

export { classifyTicket };
export type { TicketClassification };
