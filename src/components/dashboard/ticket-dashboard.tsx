
"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { updateTicketStatus } from "@/store/tickets-slice";
import type { TicketStatus } from "@/types/tickets";

const statusLabels: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  pending: "Pending",
  resolved: "Resolved",
};

export default function TicketDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const tickets = useSelector(
    (state: RootState) => state.tickets.items
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const text = [
        ticket.subject,
        ticket.customerName,
        ticket.customerEmail,
        ticket.externalId,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  const openCount = tickets.filter(
    (ticket) => ticket.status === "open"
  ).length;

  const progressCount = tickets.filter(
    (ticket) => ticket.status === "in_progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "resolved"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              SUPPORT CENTER
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Support Tickets
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage customer requests and track their progress.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
            <span className="text-slate-500">Total tickets: </span>
            <strong>{tickets.length}</strong>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Tickets" value={tickets.length} />
          <SummaryCard label="Open" value={openCount} color="text-blue-600" />
          <SummaryCard
            label="In Progress"
            value={progressCount}
            color="text-amber-600"
          />
          <SummaryCard
            label="Resolved"
            value={resolvedCount}
            color="text-emerald-600"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">All Tickets</h2>
              <p className="mt-1 text-sm text-slate-500">
                Search and update customer support requests.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tickets..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Ticket</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Priority</th>
                  <th className="px-5 py-4 font-semibold">Assigned To</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {ticket.subject}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {ticket.externalId} · {ticket.category}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium">{ticket.customerName}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {ticket.customerEmail}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <PriorityBadge priority={ticket.priority} />
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {ticket.assignedTo}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        aria-label={`Status for ${ticket.externalId}`}
                        value={ticket.status}
                        onChange={(event) =>
                          dispatch(
                            updateTicketStatus({
                              id: ticket.id,
                              status: event.target.value as TicketStatus,
                            })
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-medium outline-none focus:border-blue-500"
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}

                {filteredTickets.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No tickets found. Try another search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  color = "text-slate-900",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    P1: "bg-red-50 text-red-700 ring-red-200",
    P2: "bg-orange-50 text-orange-700 ring-orange-200",
    P3: "bg-blue-50 text-blue-700 ring-blue-200",
    P4: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        styles[priority] ?? styles.P4
      }`}
    >
      {priority}
    </span>
  );
}