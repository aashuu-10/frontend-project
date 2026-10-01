import { describe, expect, it } from "vitest";
import reducer, { updateTicketStatus } from "@/store/tickets-slice";
import { initialTickets } from "@/lib/mock-data";

describe("tickets-slice", () => {
  it("updates the status of an existing ticket", () => {
    const ticket = initialTickets[0];

    const state = {
      items: [...initialTickets],
    };

    const nextState = reducer(
      state,
      updateTicketStatus({
        id: ticket.id,
        status: "closed",
      })
    );

    const updatedTicket = nextState.items.find(
      (item) => item.id === ticket.id
    );

    expect(updatedTicket?.status).toBe("closed");
  });

  it("does not change tickets when the ticket ID does not exist", () => {
    const state = {
      items: [...initialTickets],
    };

    const nextState = reducer(
      state,
      updateTicketStatus({
        id: "ticket-that-does-not-exist",
        status: "closed",
      })
    );

    expect(nextState.items).toEqual(initialTickets);
  });
    it("keeps all existing tickets when no update is dispatched", () => {
    const state = {
      items: [...initialTickets],
    };

    const nextState = reducer(state, { type: "UNKNOWN_ACTION" });

    expect(nextState.items).toEqual(initialTickets);
    expect(nextState.items.length).toBe(initialTickets.length);
  });
});