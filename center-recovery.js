/* Recuperação⭐Center! — consulta local voluntária; nunca envia ou altera dados. */
(function (root) {
  'use strict';

  var labels = {
    pt: ['Consultar corridas locais', 'Recuperação⭐Center!', 'Estes registros são apenas indícios locais, não pontos confirmados. Compartilhe o arquivo somente com a moderação.', 'Entre com sua conta Google para consultar apenas registros compatíveis com sua Idol.', 'Pontuações locais', 'Corridas pendentes', 'Nenhum registro compatível encontrado neste navegador.', 'Baixar comprovante JSON', 'Fechar', 'Arquivo salvo apenas no seu aparelho. Nenhum dado foi enviado.'],
    en: ['Check local runs', 'Center⭐Recovery!', 'These are local clues, not confirmed points. Share the file only with moderators.', 'Sign in with Google to see records matching your Idol.', 'Local scores', 'Pending runs', 'No matching records found in this browser.', 'Download JSON evidence', 'Close', 'File saved only on your device. Nothing was sent.'],
    es: ['Consultar carreras locales', '¡Recuperación⭐Center!', 'Son indicios locales, no puntos confirmados. Comparte el archivo solo con moderación.', 'Inicia sesión con Google para consultar registros de tu Idol.', 'Puntuaciones locales', 'Carreras pendientes', 'No hay registros correspondientes en este navegador.', 'Descargar comprobante JSON', 'Cerrar', 'Archivo guardado solo en tu dispositivo. No se envió nada.'],
    id: ['Periksa lari lokal', 'Pemulihan⭐Center!', 'Ini hanya bukti petunjuk lokal, bukan poin terkonfirmasi. Bagikan hanya kepada moderator.', 'Masuk dengan Google untuk melihat catatan Idol milikmu.', 'Skor lokal', 'Lari tertunda', 'Tidak ada catatan yang cocok di browser ini.', 'Unduh bukti JSON', 'Tutup', 'File hanya disimpan di perangkatmu. Tidak ada data terkirim.'],
    th: ['ตรวจสอบการวิ่งในเครื่อง', 'กู้คืน⭐Center!', 'ข้อมูลนี้เป็นเพียงหลักฐานในเครื่อง ไม่ใช่คะแนนที่ยืนยันแล้ว โปรดแบ่งปันกับผู้ดูแลเท่านั้น', 'เข้าสู่ระบบ Google เพื่อดูข้อมูลที่ตรงกับไอดอลของคุณ', 'คะแนนในเครื่อง', 'การวิ่งที่รอยืนยัน', 'ไม่พบข้อมูลที่ตรงกันในเบราว์เซอร์นี้', 'ดาวน์โหลดหลักฐาน JSON', 'ปิด', 'บันทึกไฟล์ในอุปกรณ์เท่านั้น ไม่มีการส่งข้อมูล'],
    ja: ['端末の記録を確認', 'Center⭐記録の復元調査', '端末内の参考記録であり、確定したポイントではありません。ファイルは運営にのみ共有してください。', 'Googleでログインすると、自分のアイドルに一致する記録を確認できます。', '端末内のスコア', '未送信のラン', 'このブラウザーに一致する記録はありません。', '証拠JSONをダウンロード', '閉じる', 'ファイルは端末にのみ保存され、送信されていません。']
  };

  function readJSON(storage, key) {
    try {
      var raw = storage.getItem(key);
      return raw && raw.length <= 300000 ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  // Account is mandatory: browser-wide highs cannot safely be attributed to one person.
  function collect(storage, account, now) {
    if (!account || !account.id || typeof account.nick !== 'string' || !account.nick.trim()) return null;
    var owner = String(account.id);
    var nick = account.nick.trim().slice(0, 40);
    var clock = typeof now === 'number' ? now : Date.now();
    var cutoff = Date.UTC(2020, 0, 1);
    var scores = [], seen = Object.create(null);
    [['brs48cr_lb', 'all'], ['brs48cr_lw', 'week'], ['brs48cr_ld', 'day']].forEach(function (source) {
      var saved = readJSON(storage, source[0]);
      var rows = Array.isArray(saved) ? saved : saved && saved.rows;
      if (!Array.isArray(rows)) return;
      rows.slice(0, 100).forEach(function (r) {
        if (!r || typeof r.name !== 'string' || r.name.trim().toLowerCase() !== nick.toLowerCase()) return;
        if (!Number.isInteger(r.score) || r.score < 0 || r.score > 300000) return;
        if (!Number.isInteger(r.t) || r.t < cutoff || r.t > clock + 60000) return;
        var ch = typeof r.char === 'string' ? r.char.slice(0, 48) : '';
        var key = [r.t, r.score, ch].join('|');
        if (seen[key] !== undefined) { scores[seen[key]].sources.push(source[1]); return; }
        seen[key] = scores.length;
        scores.push({ at: new Date(r.t).toISOString(), score: r.score, character: ch, sources: [source[1]] });
      });
    });
    scores.sort(function (a, b) { return b.at.localeCompare(a.at); });

    // Read the raw queue: the normal recovery helper discards entries older than 2h.
    // No replay, cleanup, mutation or access to auth/session keys takes place here.
    var rawPending = readJSON(storage, 'brs48cr_corridas_pendentes_v1');
    var pending = [];
    if (Array.isArray(rawPending)) rawPending.slice(0, 250).forEach(function (p) {
      if (!p || p.owner !== owner || typeof p.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id)) return;
      if (!Number.isInteger(p.score) || p.score < 0 || p.score > 300000) return;
      if (!Number.isInteger(p.stars) || p.stars < 0 || p.stars > 500) return;
      if (!Number.isInteger(p.at) || p.at < cutoff || p.at > clock + 60000) return;
      pending.push({ run_id: p.id, at: new Date(p.at).toISOString(), score: p.score,
        stars_proposed: p.stars, character: typeof p.char === 'string' ? p.char.slice(0, 48) : '',
        older_than_2h: clock - p.at >= 7200000 });
    });
    return { format: 'tsulipa-center-local-evidence-v1', exported_at: new Date(clock).toISOString(),
      idol_public_nick: nick, local_scores: scores, pending_runs: pending,
      notice: 'Local browser evidence only; not verified by the server. No points or stars were restored.' };
  }

  function init() {
    var menu = document.querySelector('#menu .panel');
    if (!menu || document.getElementById('cr-recovery-open')) return;
    var button = document.createElement('button'), box = document.createElement('section');
    var heading = document.createElement('h2'), warning = document.createElement('p');
    var result = document.createElement('p'), entries = document.createElement('ol');
    var download = document.createElement('button'), close = document.createElement('button');
    var report = null, reportOwner = '';
    function trIndex(i) { return (labels[typeof LANG !== 'undefined' ? LANG : 'pt'] || labels.pt)[i]; }
    button.type = 'button'; button.className = 'sec'; button.id = 'cr-recovery-open';
    button.style.margin = '6px auto';
    box.hidden = true; box.id = 'cr-recovery-panel';
    box.style.cssText = 'box-sizing:border-box;max-width:100%;max-height:42vh;overflow:auto;margin:12px 0;padding:12px;border:1px solid var(--pink);border-radius:12px;text-align:left;background:rgba(255,255,255,.92);color:#42354a';
    heading.style.cssText = 'margin:0 0 8px;font-size:1.08rem';
    warning.style.cssText = 'font-size:.82rem;line-height:1.4;margin:0 0 8px';
    result.style.cssText = 'font-weight:700;font-size:.84rem;line-height:1.4';
    entries.style.cssText = 'padding-left:22px;font-size:.82rem;line-height:1.5;overflow-wrap:anywhere';
    download.type = 'button'; download.className = 'sec'; download.style.margin = '8px 8px 8px 0';
    close.type = 'button'; close.className = 'sec'; close.style.margin = '8px 0';
    function refreshLabels() {
      button.textContent = trIndex(0); heading.textContent = trIndex(1);
      warning.textContent = trIndex(2); download.textContent = trIndex(7); close.textContent = trIndex(8);
    }
    function hide() { box.hidden = true; button.setAttribute('aria-expanded', 'false'); report = null; reportOwner = ''; entries.replaceChildren(); }
    function open() {
      refreshLabels();
      var player = typeof contaJ !== 'undefined' ? contaJ : null;
      report = collect(localStorage, player);
      reportOwner = player && player.id ? String(player.id) : '';
      entries.replaceChildren();
      download.disabled = !report || !(report.local_scores.length + report.pending_runs.length);
      if (!report) result.textContent = trIndex(3);
      else {
        result.textContent = trIndex(4) + ': ' + report.local_scores.length + ' · ' + trIndex(5) + ': ' + report.pending_runs.length;
        report.local_scores.slice(0, 30).forEach(function (r) {
          var li = document.createElement('li'); li.textContent = r.at.slice(0, 16).replace('T', ' ') + ' UTC · ' + r.score + ' pts · ' + r.character; entries.appendChild(li);
        });
        report.pending_runs.slice(0, 30).forEach(function (r) {
          var li = document.createElement('li'); li.textContent = r.at.slice(0, 16).replace('T', ' ') + ' UTC · ' + r.score + ' pts · ' + trIndex(5); entries.appendChild(li);
        });
        if (!report.local_scores.length && !report.pending_runs.length) {
          var empty = document.createElement('li'); empty.textContent = trIndex(6); entries.appendChild(empty);
        }
      }
      box.hidden = false; button.setAttribute('aria-expanded', 'true');
    }
    button.onclick = function () { if (box.hidden) open(); else hide(); };
    close.onclick = hide;
    download.onclick = function () {
      var player = typeof contaJ !== 'undefined' ? contaJ : null;
      if (!report || !player || String(player.id) !== reportOwner) { hide(); return; }
      var file = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(file), link = document.createElement('a');
      link.href = url; link.download = 'tsulipa-center-registros-' + report.exported_at.slice(0, 10) + '.json';
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      result.textContent = trIndex(9);
    };
    box.append(heading, warning, result, entries, download, close);
    var ranking = document.getElementById('lbmw');
    if (ranking && ranking.parentNode === menu) { menu.insertBefore(button, ranking); menu.insertBefore(box, ranking); }
    else menu.append(button, box);
    refreshLabels(); button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-controls', box.id);
    var langs = menu.querySelector('.lang');
    if (langs) langs.addEventListener('click', function () { setTimeout(refreshLabels, 0); });
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { collect: collect };
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
  }
})(typeof window !== 'undefined' ? window : this);
