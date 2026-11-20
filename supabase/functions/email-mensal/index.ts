// TsuLiPa⭐World · email mensal opcional (20/11/2026)
// Envia, no dia 1º, a retrospectiva do mês que acabou para quem marcou "Quero receber minha retrospectiva por email".
// NÃO está publicada. Para ligar (só a dona do projeto):
//   1. Criar conta grátis no Resend (resend.com), verificar o domínio de envio e gerar uma API key.
//   2. No Supabase → Edge Functions → Secrets: RESEND_API_KEY, EMAIL_DE ("TsuLiPa⭐World <ola@seu-dominio>") e EMAIL_CHAVE (uma senha qualquer, longa).
//   3. Publicar: supabase functions deploy email-mensal --no-verify-jwt
//   4. Agendar no dia 1º às 10h (Brasília) com pg_cron + pg_net chamando esta função com o cabeçalho x-tsulipa-chave: EMAIL_CHAVE.
// A lista vem de public.email_mensal_pacote(), que só a chave de serviço pode chamar.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SITE = "https://tsulipa-world.vercel.app";
type Retro = { ok: boolean; mes: string; dias: number; corridas: number; melhor: number; musicas: number; estrelas: number; cards: number; duo: number; fotos: number; sora: number; show: number; idol: string | null };

function esc(s: unknown) { return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)); }
function mesNome(iso: string) { const [y, m] = iso.split("-").map(Number); return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }); }

function html(nick: string, r: Retro) {
  const itens: [string, number, string][] = [["📅", r.dias, "dias jogados"], ["🏁", r.corridas, "corridas"], ["🏆", r.melhor, "melhor corrida"], ["🎤", r.musicas, "músicas cantadas"],
    ["⭐", r.estrelas, "estrelas ganhas"], ["🃏", r.cards, "cards novos"], ["🌙", r.duo, "cenas no Moon⭐Duo!"], ["📸", r.fotos, "fotos no Studio"], ["🎶", r.show, "shows de sábado"]];
  const linhas = itens.filter((i) => (i[1] || 0) > 0).map((i) => `<tr><td style="font-size:22px;padding:6px 10px">${i[0]}</td><td style="font-weight:800;font-size:20px;color:#2a1f45">${i[1].toLocaleString("pt-BR")}</td><td style="color:#6c6488;padding-left:8px">${i[2]}</td></tr>`).join("");
  return `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;background:#faf7ff;border-radius:20px;padding:24px">
  <div style="height:8px;border-radius:4px;background:linear-gradient(90deg,#9b30d9,#5cc72c,#4169e1)"></div>
  <h1 style="color:#5a2bc4;font-size:24px">Seu ${esc(mesNome(r.mes))} no TsuLiPa⭐World</h1>
  <p>Oi, <b>${esc(nick)}</b>! Olha o que você aprontou no mês:</p>
  <table style="border-collapse:collapse">${linhas || '<tr><td>Que tal voltar este mês? A gente sente sua falta 💜</td></tr>'}</table>
  ${r.idol ? `<p>💖 Idol que mais subiu ao palco com você: <b>${esc(r.idol)}</b></p>` : ""}
  <p><a href="${SITE}" style="display:inline-block;background:#7b3ff0;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:800">Ver e salvar meu cartão do mês</a></p>
  <p style="color:#6c6488;font-size:12px">Você recebe este email porque marcou a opção no jogo. Para parar, desmarque “Quero receber minha retrospectiva por email” na sua retrospectiva.</p>
  <p style="color:#6c6488;font-size:12px">— Tsu, Lirika e Pati 🌷</p></div>`;
}

Deno.serve(async (req) => {
  if (req.headers.get("x-tsulipa-chave") !== Deno.env.get("EMAIL_CHAVE")) return new Response("não autorizado", { status: 401 });
  const key = Deno.env.get("RESEND_API_KEY"), de = Deno.env.get("EMAIL_DE");
  if (!key || !de) return new Response("faltam RESEND_API_KEY e EMAIL_DE", { status: 500 });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data, error } = await sb.rpc("email_mensal_pacote", { p_mes: null });
  if (error) return new Response(error.message, { status: 500 });
  let enviados = 0, falhas = 0;
  for (const p of (data as { nick: string; email: string; retro: Retro }[]) || []) {
    if (!p.retro?.ok) continue;
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: de, to: p.email, subject: `Seu ${mesNome(p.retro.mes)} no TsuLiPa⭐World 🌷`, html: html(p.nick, p.retro) }),
    });
    if (r.ok) enviados++; else falhas++;
    await new Promise((ok) => setTimeout(ok, 600));   // respeita o limite do plano grátis
  }
  return Response.json({ enviados, falhas });
});
