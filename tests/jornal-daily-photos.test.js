'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Isola somente a composição das fotos: sem Supabase, navegador ou desenho real.
const jornal = fs.readFileSync(path.join(__dirname, '..', 'jornal.js'), 'utf8');
const ini = jornal.indexOf('function jornalSorteio(');
const fim = jornal.indexOf('function jornalFotoDesenhar(');
assert.ok(ini > 0 && fim > ini, 'rotinas de foto devem existir');
const composicao = jornal.slice(ini, fim);

function gerar({ dia = 20761, quantidade = 20, karaoke = false, pet = false } = {}) {
  const box = { innerHTML: '', querySelector: () => null };
  const idols = Array.from({ length: quantidade }, (_, i) => ({
    nick: 'Idol' + String(i).padStart(2, '0'),
    avatar: { c: { hair: '#ff6fb5' } }
  }));
  const ctx = {
    Date: { now: () => dia * 86400000 + 10800000 },
    $: id => id === 'jornalFotosDia' ? box : null,
    hubIdolsDados: { idols },
    jornalSemanaDados: { karaoke: karaoke ? [{ nick: 'Idol00' }, { nick: 'Idol01' }] : [] },
    jornalAvatar: nick => idols.find(p => p.nick === nick)?.avatar || null,
    KaraokeRoomViews: {
      VIEWS: ['gigoia', 'liberdade', 'tailandia', 'harajuku', 'praia'],
      NAMES: { gigoia: 'Gigoia', liberdade: 'Liberdade', tailandia: 'Tailândia', harajuku: 'Harajuku', praia: 'Praia' }
    },
    tr: str => str,
    escHtml: str => String(str),
    contaJ: pet ? { nick: 'Jogador' } : null,
    petAtivo: () => pet ? { nome: 'Bolt', acc: '' } : null,
    petData: { ativo: 'dog' },
    PET_SP: { dog: { n: 'Cão' } },
    perfAvAtual: () => ({ c: { hair: '#ff6fb5' } })
  };
  vm.createContext(ctx);
  vm.runInContext(composicao, ctx, { timeout: 1000 });
  vm.runInContext('jornalFotosDia()', ctx, { timeout: 1000 });
  return { fotos: Array.from(ctx.jornalFotosHoje), html: box.innerHTML };
}

test('a foto especial tem oito membros distintos, usa uma vista oficial e é estável por dia', () => {
  const a = gerar(), b = gerar(), especial = a.fotos.find(f => f.tipo === 'janela');
  assert.equal(a.fotos.length, 4); // 3 cenas tradicionais + 1 paisagem; sem Karaoke nem pet
  assert.ok(especial);
  assert.equal(especial.grupo.length, 8);
  assert.equal(new Set(especial.grupo.map(p => p.nick)).size, 8);
  assert.ok(['gigoia', 'liberdade', 'tailandia', 'harajuku', 'praia'].includes(especial.local));
  assert.equal(especial.local, b.fotos.find(f => f.tipo === 'janela').local);
  assert.deepEqual(Array.from(especial.grupo, p => p.nick), Array.from(b.fotos.find(f => f.tipo === 'janela').grupo, p => p.nick));
});

test('a cena adicional preserva o telão e a foto privada do jogador com pet', () => {
  const resultado = gerar({ karaoke: true, pet: true });
  assert.equal(resultado.fotos.length, 6);
  assert.equal(resultado.fotos.filter(f => f.tipo === 'telao').length, 1);
  assert.equal(resultado.fotos.filter(f => f.tipo === 'pet').length, 1);
  assert.equal((resultado.html.match(/data-jfoto=/g) || []).length, 6);
});

test('sem oito membros a foto especial não duplica Idols', () => {
  const r = gerar({ quantidade: 7 });
  assert.equal(r.fotos.some(f => f.tipo === 'janela'), false);
  assert.equal(r.fotos.length, 3);
});
