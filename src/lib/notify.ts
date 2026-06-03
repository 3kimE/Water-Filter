import type { Order } from "@/lib/types";
import { formatMAD } from "@/lib/utils";

/**
 * Emails the shop owner when a new order arrives (via Resend's HTTP API — no
 * extra dependency). No-ops silently if not configured yet, and never throws,
 * so it can't block an order from being saved.
 *
 * To activate: set RESEND_API_KEY and ORDER_NOTIFY_EMAIL in the environment.
 */
export async function notifyNewOrder(order: Order): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!apiKey || !to) return; // not configured — skip quietly

  const from = process.env.ORDER_FROM_EMAIL || "Filtre Maroc <onboarding@resend.dev>";
  const lines = order.items
    .map(
      (i) =>
        `${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} × ${i.qty} — ${formatMAD(i.price * i.qty)}`,
    )
    .join("<br>");

  const html = `
    <h2>🛒 Nouvelle commande ${order.id}</h2>
    <p><b>Client :</b> ${order.customerName}<br>
       <b>Téléphone :</b> ${order.phone}<br>
       <b>Ville :</b> ${order.city}<br>
       <b>Adresse :</b> ${order.address}${order.note ? `<br><b>Note :</b> ${order.note}` : ""}</p>
    <p>${lines}</p>
    <p><b>Total : ${formatMAD(order.total)}</b> — paiement à la livraison</p>
  `;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `🛒 Nouvelle commande ${order.id} — ${formatMAD(order.total)}`,
        html,
      }),
    });
  } catch {
    /* never block an order on a failed email */
  }
}
