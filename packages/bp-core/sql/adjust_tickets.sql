-- W1-3 — Atomic ticket counter adjustment
--
-- Apply this in the Supabase SQL editor (or via `supabase db push`) BEFORE
-- merging the accompanying TypeScript change. The app's cancelOrder /
-- updateOrder paths call this RPC; until it exists, those operations will
-- fail with "function adjust_tickets does not exist".
--
-- Why: cancelOrder/updateOrder used to recompute sold_tickets in JS from a
-- possibly-stale `session` snapshot and write it back (read-modify-write).
-- With two cashiers and the realtime reload firing, those writes interleave
-- and corrupt sold_tickets. This mirrors the existing atomic reserve_tickets
-- RPC (used by addOrder) so the decrement/adjust path is server-side too.
--
-- p_delta may be negative (release, e.g. cancelling an order) or positive
-- (adding tickets when editing an order). The result is clamped to
-- [0, total_tickets] so it can never go negative or oversell.
--
-- NOTE: p_dish_id is typed uuid to match `dishes.id`. If your schema uses a
-- different id type, adjust the signature accordingly (also match how the
-- existing reserve_tickets is declared).

create or replace function adjust_tickets(p_dish_id uuid, p_delta int)
returns void
language plpgsql
as $$
begin
  update dishes
     set sold_tickets = least(total_tickets, greatest(0, sold_tickets + p_delta))
   where id = p_dish_id;
end;
$$;

-- Match the callers used by the anon client (same grants as reserve_tickets).
grant execute on function adjust_tickets(uuid, int) to anon, authenticated;
