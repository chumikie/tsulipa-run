// Center⭐Run! (17/11/2026): Você de perfil, Temporada 2 com luzes, telemetria, sequência de metas e luzes na batida.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const r=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const cr=r('centerrun.js'),co=r('centerrun-corrida.js'),conta=r('conta.js'),lado=r('tw-lado.js'),sql=r('supabase/migrations/20261117230000_corrida_telemetria.sql');
assert.match(cr,/c === CH\[3\] && !c\.hat/,'o Você corre de perfil quando está sem chapéu');
assert.match(lado,/var corCam = \(c\.out && /,'a camisa do perfil usa a cor da roupa');
assert.match(co,/s2DrawSceneryBg\(\);\n    crLuzesPalco\(\);/,'luzes também nos palcos da Temporada 2');
assert.match(co,/crTelemetriaAnotar\(obs\[i\]\);end\(\);return;/,'anota o que causou a batida');
assert.match(conta,/contaRpc\('corrida_telemetria',\{p_run:p\.id,p_causa:tl\.causa,p_meta:tl\.meta\}\)/,'telemetria só depois da corrida confirmada');
assert.match(sql,/and causa is null/,'telemetria grava uma vez só');
assert.match(sql,/finished_at > now\(\) - interval '10 minutes'/,'só corrida recém-terminada');
assert.match(co,/r\.extra = Math\.min\(4, r\.n - 1\)/,'sequência: até +★4 por dias seguidos');
assert.match(co,/if\(st\.dia === hoje\)\{ r\.n = st\.n \|\| 1; return r; \}/,'sequência conta uma vez por dia');
assert.match(cr,/if\(bi%2===0\)crBatidaT=performance\.now\(\);/,'a trilha marca a batida');
assert.match(co,/agoraB - crBatidaT < batMs \* 3/,'as luzes seguem a batida da trilha que está tocando');
console.log('✓ Center⭐Run!: refino v3');
