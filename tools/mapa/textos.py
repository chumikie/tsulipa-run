"""Tira os <text> dos SVGs do mapa e grava as posições em mapa-textos.js.

Por quê: um SVG desenhado como imagem (<img>/drawImage) não enxerga as fontes da página,
então "Mochiy Pop One" virava fonte serifada. O canvas desenha esses textos com a fonte
certa, no idioma do jogador.

Uso (depois de gerar os SVGs): python3 textos.py   — roda dentro de gerar_2_niveis.py.
"""
from pathlib import Path
import json
import math
import re
import xml.etree.ElementTree as ET

PASTA = Path(__file__).resolve().parent
RAIZ = PASTA.parent.parent
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
CENAS = {'mundo': 'mapa-mundo.svg'}
for b in ('palco', 'harajuku', 'fofo', 'praca', 'arena', 'ceu'):
    CENAS[b] = 'mapa-rua-' + b + '.svg'


def mult(m, n):
    a, b, c, d, e, f = m
    a2, b2, c2, d2, e2, f2 = n
    return (a * a2 + c * b2, b * a2 + d * b2, a * c2 + c * d2, b * c2 + d * d2,
            a * e2 + c * f2 + e, b * e2 + d * f2 + f)


def matriz(txt):
    m = (1, 0, 0, 1, 0, 0)
    for nome, args in re.findall(r'(\w+)\(([^)]*)\)', txt or ''):
        v = [float(x) for x in re.split(r'[\s,]+', args.strip()) if x]
        if nome == 'translate':
            m = mult(m, (1, 0, 0, 1, v[0], v[1] if len(v) > 1 else 0))
        elif nome == 'scale':
            m = mult(m, (v[0], 0, 0, v[1] if len(v) > 1 else v[0], 0, 0))
        elif nome == 'rotate':
            r = math.radians(v[0])
            rot = (math.cos(r), math.sin(r), -math.sin(r), math.cos(r), 0, 0)
            if len(v) == 3:
                rot = mult(mult((1, 0, 0, 1, v[1], v[2]), rot), (1, 0, 0, 1, -v[1], -v[2]))
            m = mult(m, rot)
        elif nome == 'matrix':
            m = mult(m, tuple(v))
    return m


def extrair(arquivo):
    arvore = ET.parse(arquivo)
    raiz = arvore.getroot()
    saida = []

    def andar(el, m):
        m = mult(m, matriz(el.get('transform')))
        for filho in list(el):
            if filho.tag == '{%s}text' % NS:
                mm = mult(m, matriz(filho.get('transform')))
                x, y = float(filho.get('x', 0)), float(filho.get('y', 0))
                esc = math.hypot(mm[0], mm[1])
                t = ''.join(filho.itertext()).strip()
                if t:
                    item = {
                        'x': round(mm[0] * x + mm[2] * y + mm[4], 1),
                        'y': round(mm[1] * x + mm[3] * y + mm[5], 1),
                        't': t,
                        's': round(float(filho.get('font-size', 16)) * esc, 1),
                        'f': filho.get('fill', '#fff'),
                        'a': {'middle': 'm', 'end': 'e'}.get(filho.get('text-anchor'), 's'),
                    }
                    if filho.get('stroke'):
                        item['k'] = filho.get('stroke')
                        item['w'] = round(float(filho.get('stroke-width', 3)) * esc, 1)
                    ang = math.degrees(math.atan2(mm[1], mm[0]))
                    if abs(ang) > .5:
                        item['r'] = round(ang, 1)
                    saida.append(item)
                el.remove(filho)
            else:
                andar(filho, m)

    andar(raiz, (1, 0, 0, 1, 0, 0))
    arvore.write(arquivo, encoding='unicode')
    return saida


def main():
    dados = {}
    for cena, nome in CENAS.items():
        arq = RAIZ / nome
        if arq.exists():
            dados[cena] = extrair(arq)
            # O letreiro Sora vinha com coordenada acima de 3.000 por uma
            # transformação aninhada na fachada. Textos fora de 1600x760
            # somem no Canvas: reencaixa apenas esse letreiro à primeira loja.
            if cena == 'ceu':
                for item in dados[cena]:
                    if 'Sora' in item['t'] and not 0 <= item['x'] <= 1600:
                        item.update(x=324.6, y=652.1, s=36.9, a='m', r=0)
    js = ('/* Gerado por tools/mapa/textos.py — não editar à mão. Textos do mapa desenhados no canvas. */\n'
          'window.TW_MAPA_TEXTOS=' + json.dumps(dados, ensure_ascii=False, separators=(',', ':')) + ';\n')
    (RAIZ / 'mapa-textos.js').write_text(js, encoding='utf-8')
    print('Textos:', {k: len(v) for k, v in dados.items()})


if __name__ == '__main__':
    main()
