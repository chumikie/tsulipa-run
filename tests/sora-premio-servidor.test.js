// Sora⭐Jump!: o prêmio dos 500 m (★25 por dia) é do servidor quando a pessoa está logada (17/11/2026).
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'sora-jump.html'),'utf8'),index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sql=fs.readFileSync(path.join(root,'supabase/migrations/20261117200000_sora_premio_500_registro.sql'),'utf8');
assert.match(html,/var misServidor = !isTestScene && h >= 500 && soraOnlinePremioPendente\(\);/,'logado: a missão local não credita');
assert.match(html,/if\(!isTestScene && h >= 500 && !misServidor\)\{/,'convidado: a missão local de sempre continua');
assert.match(html,/soraPremioMostrar\(result && result\.data, score\);/,'a resposta do servidor decide a mensagem');
assert.match(html,/d\.ok === true && d\.stars_credited > 0/,'só mostra +25 ★ quando o servidor creditou');
assert.match(html,/reward_claimed_today/,'avisa quando o prêmio do dia já saiu');
assert.match(html,/setTimeout\(function\(\)\{ soraPremioMostrar\(null, h\); \}, soraOnlineRunStartPromise \? 15000 : 50\)/,'não fica em "conferindo" para sempre');
assert.match(html,/soraPremioMostrar\(null, score\);\n  \}\);/,'erro de rede mostra aviso');
for(const k of ['Conferindo o prêmio dos 500 m…','Prêmio dos 500 m de hoje já recebido. Volte amanhã!','Essa subida foi rápida demais para o prêmio. Tente de novo com calma!','Não deu para conferir o prêmio agora.'])
  assert.equal((html.match(new RegExp('"'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'":','g'))||[]).length,4,'traduções (en, es, th, ja): '+k);
assert.match(index,/e\.data\.type==='TW_SORA_STARS'/,'o site atualiza o saldo do topo');
assert.match(index,/dd>0&&dd<=100/,'o site só aceita um delta pequeno e positivo');
assert.match(sql,/v_elapsed >= 20 and p_score <= floor\(v_elapsed \* 25\)/,'anti-trapaça do prêmio: 20 s e até 25 m/s');
assert.match(sql,/primary key \(player_id, reward_day\)/,'uma vez por dia por conta');
console.log('✓ Sora⭐Jump!: prêmio dos 500 m confirmado pelo servidor');
