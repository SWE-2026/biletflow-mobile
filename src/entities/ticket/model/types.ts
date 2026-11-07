export type TicketStatus = 'valid' | 'used' | 'cancelled' | 'refunded';

/**
 * A ticket as Event Admins see it (StaffTicket in biletflow-api/docs/api.md). It never contains the
 * QR token.
 */
export type StaffTicket = {
  id: string;
  status: TicketStatus;
  ticketTypeName: string;
  attendeeName: string;
  attendeeEmail: string;
  orderId: string;
  /** Set while the ticket is checked in; cleared when the check-in is reversed. */
  checkedInAt: string | null;
};
