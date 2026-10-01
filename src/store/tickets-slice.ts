
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialTickets } from "@/lib/mock-data";
import type { Ticket, TicketStatus } from "@/types/tickets";

interface TicketsState {
  items: Ticket[];
}

const initialState: TicketsState = {
  items: initialTickets,
};

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    updateTicketStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: TicketStatus;
      }>
    ) => {
      const ticket = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (ticket) {
        ticket.status = action.payload.status;
      }
    },
  },
});

export const { updateTicketStatus } = ticketsSlice.actions;
export default ticketsSlice.reducer;