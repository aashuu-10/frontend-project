export type TicketStatus = 'open' | 'pending' | 'in-progress' | 'resolved' | 'closed' | string;
export type TicketPriority = 'P1' | 'P2' | 'P3' | 'low' | 'medium' | 'high' | string;

export interface Ticket {
  id: string;
  externalId: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  description?: string;
  category?: string;
  assignedTo?: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt?: string;
  updatedAt?: string;
}