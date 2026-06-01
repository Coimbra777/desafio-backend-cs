const TICKET_CHANNELS = [
  "ouvidoria",
  "sac",
  "suporte_tecnico",
  "financeiro",
  "fora_do_escopo",
] as const;

const TICKET_PRIORITIES = ["alta", "media", "baixa"] as const;

const TICKET_STATUSES = ["open", "in_progress", "closed"] as const;

type TicketChannel = (typeof TICKET_CHANNELS)[number];
type TicketPriority = (typeof TICKET_PRIORITIES)[number];
type TicketStatus = (typeof TICKET_STATUSES)[number];

export { TICKET_CHANNELS, TICKET_PRIORITIES, TICKET_STATUSES };
export type { TicketChannel, TicketPriority, TicketStatus };
