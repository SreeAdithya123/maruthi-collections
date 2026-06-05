// Maruthi Collections — transactional email (Resend).
//
// Deployed with verify_jwt = true: the caller's Supabase access token is
// required, so the function knows who is asking. It uses the service role
// (auto-injected) to read orders / users, and Resend to send.
//
// Required secret: RESEND_API_KEY
// Optional secrets: EMAIL_FROM (e.g. "Maruthi Collections <orders@yourdomain>"),
//                   SITE_URL  (e.g. "https://maruthi-collections.pages.dev")
//
// Kinds: test | welcome | invoice (orderId) | new-arrival (productId, admin only)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') ?? 'Maruthi Collections <onboarding@resend.dev>';
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://maruthi-collections.pages.dev';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');
const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

async function sendEmail(to: string | string[], subject: string, html: string) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set on the email function');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

function shell(_title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#EDE4D2;font-family:Georgia,'Times New Roman',serif;color:#2A1F1A">
  <div style="max-width:600px;margin:0 auto;background:#F5EFE3">
    <div style="padding:28px 32px;border-bottom:1px solid rgba(184,137,90,.4);text-align:center">
      <div style="letter-spacing:.28em;text-transform:uppercase;color:#6B1F25;font-size:18px;font-weight:bold">Maruthi Collections</div>
      <div style="font-style:italic;color:#9A7B45;font-size:13px;margin-top:4px">Threads of the Godavari</div>
    </div>
    <div style="padding:32px">${body}</div>
    <div style="padding:22px 32px;border-top:1px solid rgba(184,137,90,.4);font-size:12px;color:#6B5847;text-align:center">
      Maruthi Collections · Nidadavole, West Godavari, Andhra Pradesh<br/>
      Call / WhatsApp Sai Priyanka: +91 86392 32932
    </div>
  </div></body></html>`;
}
const h1 = (t: string) => `<h1 style="font-weight:300;color:#4A1418;font-size:26px;margin:0 0 14px">${t}</h1>`;
const p = (t: string) => `<p style="color:#4a3f36;line-height:1.6;font-size:15px;margin:0 0 14px">${t}</p>`;
const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#6B1F25;color:#F5EFE3;text-decoration:none;padding:12px 24px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;margin-top:8px">${label}</a>`;

function welcomeHtml(name: string) {
  return shell('Welcome', h1(`Namaskaram, ${esc(name)}`) +
    p('Welcome to Maruthi Collections — our little Kalamkari boutique on the Godavari. Your account is ready.') +
    p('Browse hand-block Kalamkari kurtis, frocks for women and girls, cotton sarees, and easy daily-wear drapes — each chosen by Sai Priyanka.') +
    btn(`${SITE_URL}/sarees`, 'Start shopping'));
}

function invoiceHtml(order: any) {
  const rows = (order.items || []).map((i: any) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #e3d8bf;font-size:14px">${esc(i.title)}${i.size ? ' · Size ' + esc(i.size) : ''} <span style="color:#9A7B45">×${i.qty}</span></td><td style="padding:8px 0;border-bottom:1px solid #e3d8bf;text-align:right;font-size:14px">${inr(i.price * i.qty)}</td></tr>`).join('');
  const line = (l: string, v: string, bold = false) =>
    `<tr><td style="padding:5px 0;font-size:14px;${bold ? 'font-weight:bold;color:#4A1418' : 'color:#6B5847'}">${l}</td><td style="padding:5px 0;text-align:right;font-size:14px;${bold ? 'font-weight:bold;color:#4A1418' : ''}">${v}</td></tr>`;
  return shell('Order', h1('Thank you for your order') +
    p(`Order <b>${esc(order.order_no)}</b> · ${new Date(order.created_at).toLocaleString('en-IN')}`) +
    p('Sai Priyanka will confirm availability and payment with you personally. Here is your invoice:') +
    `<table style="width:100%;border-collapse:collapse;margin:8px 0 4px">${rows}</table>` +
    `<table style="width:100%;border-collapse:collapse;border-top:2px solid #6B1F25;margin-top:8px">` +
    line('Subtotal', inr(order.subtotal)) +
    (order.discount ? line('Discount', '−' + inr(order.discount)) : '') +
    line('GST (5%)', inr(order.gst)) +
    line('Total', inr(order.total), true) +
    `</table>` +
    btn(`https://wa.me/918639232932?text=Order%20${encodeURIComponent(order.order_no)}`, 'Chat with the curator'));
}

function arrivalHtml(product: any) {
  return shell('New arrival', h1('A new piece has arrived') +
    p(`<b>${esc(product.title)}</b> — ${esc(product.typeLabel || '')}`) +
    (product.description ? p(esc(product.description)) : '') +
    p(`<b>${inr(product.price)}</b>`) +
    btn(`${SITE_URL}/saree/${esc(product.id)}`, 'See it') +
    `<p style="color:#9A7B45;font-size:12px;margin-top:20px">You receive these because you opted in. Manage this in your account.</p>`);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const asUser = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await asUser.auth.getUser();
    if (!user) return json({ error: 'unauthorized' }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { kind, orderId, productId } = await req.json().catch(() => ({}));

    if (kind === 'test') {
      const r = await sendEmail(user.email!, 'Maruthi Collections — email is working',
        shell('Test', h1('It works') + p('Your transactional email is configured correctly. 🎉')));
      return json({ ok: true, id: r.id });
    }

    if (kind === 'welcome') {
      const name = (user.user_metadata?.full_name || user.email || 'friend').split(' ')[0];
      const r = await sendEmail(user.email!, 'Welcome to Maruthi Collections', welcomeHtml(name));
      return json({ ok: true, id: r.id });
    }

    if (kind === 'invoice') {
      const { data: order } = await admin.from('orders').select('*').eq('id', orderId).single();
      if (!order) return json({ error: 'order not found' }, 404);
      const { data: prof } = await admin.from('profiles').select('is_admin').eq('id', user.id).single();
      if (order.user_id && order.user_id !== user.id && !prof?.is_admin) return json({ error: 'forbidden' }, 403);
      const to = order.email || user.email!;
      const r = await sendEmail(to, `Your Maruthi order ${order.order_no}`, invoiceHtml(order));
      return json({ ok: true, id: r.id });
    }

    if (kind === 'new-arrival') {
      const { data: prof } = await admin.from('profiles').select('is_admin').eq('id', user.id).single();
      if (!prof?.is_admin) return json({ error: 'admin only' }, 403);
      const { data: product } = await admin.from('products').select('data').eq('id', productId).single();
      if (!product) return json({ error: 'product not found' }, 404);
      const { data: optins } = await admin.from('profiles').select('id').eq('email_opt_in', true);
      const optinIds = new Set((optins || []).map((o: any) => o.id));
      const recipients: string[] = [];
      let page = 1;
      while (page <= 10) {
        const { data: list } = await admin.auth.admin.listUsers({ page, perPage: 100 });
        const users = list?.users ?? [];
        for (const u of users) if (u.email && optinIds.has(u.id)) recipients.push(u.email);
        if (users.length < 100) break;
        page++;
      }
      let sent = 0;
      for (const to of recipients) {
        try { await sendEmail(to, `New arrival — ${product.data.title}`, arrivalHtml(product.data)); sent++; } catch (_) { /* skip one */ }
      }
      return json({ ok: true, recipients: recipients.length, sent });
    }

    return json({ error: 'unknown kind' }, 400);
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
