from lib import G, bloco, novo, salvar
import random, sys
random.seed(5)
# Sem argumento preserva a prova Harajuku; com argumento gera a rua do bairro.
CENAS = {
 'palco': ('🎤 Star Stage', ['# Handshake⭐Event!', '# Center⭐Run!', '# Karaoke⭐Time!'], '#7b3ff0'),
 'harajuku': ('🛍️ Rua das Vitrines', ['# Happy⭐Cafe!', '# Star⭐Gacha!', '# Zipper⭐Shop!'], '#7b3ff0'),
 'fofo': ('🏡 Vila das Flores', ['# Backstage⭐Pet!', '# Minha casa (Meu Perfil)', None], '#f08a52'),
 'praca': ('⛲ Praça Central', ['# Pedido de fã', None, '# Idol⭐News!'], '#4169e1'),
 'arena': ('🏟️ Star Arena', [None, None, None], '#9b30d9'),
 'ceu': ('☁️ Jardim das Nuvens', ['# Sora⭐Jump!', '# Moon⭐Duo!', None], '#4169e1')
}
bairro = sys.argv[1] if len(sys.argv) > 1 else 'harajuku'
if bairro not in CENAS:
    raise SystemExit('Bairro desconhecido: ' + bairro)
titulo, lugares, cor_tema = CENAS[bairro]
novo(); A = G['out'].append; grad = G['grad']
W, H = 1600, 760
A(f"<rect width='{W}' height='{H}' fill='{grad('ceurua', '#c7e6ff', '#ffe6f4')}'/>")
G['cloud'](230, 120, .8, .9); G['cloud'](900, 90, .6, .85); G['cloud'](1400, 140, .7, .9)
# prédios ao fundo (silhuetas suaves, dão profundidade à rua)
for i, (bx, bw, bh, c) in enumerate([(40,180,260,'#e6dcff'),(250,140,200,'#ffe0f0'),(560,200,240,'#dff0ff'),(900,150,210,'#ffe0f0'),(1120,190,250,'#e6dcff'),(1390,170,220,'#dff0ff')]):
    A(f"<rect x='{bx}' y='{560-bh}' width='{bw}' height='{bh}' rx='14' fill='{c}'/>")
    for r in range(3):
        for k in range(3):
            A(f"<rect x='{bx+22+k*(bw-44)/3:.0f}' y='{560-bh+28+r*56}' width='{(bw-44)/3-14:.0f}' height='30' rx='6' fill='#ffffff' opacity='.55'/>")
# varal de bandeirinhas atravessando a rua
for (x0, x1) in [(0, 560), (520, 1080), (1040, 1600)]:
    G['bandeiras'](x0, 170, x1 - x0, 14)
# calçada (piso de ladrilhos) e rua de pedrinha
A(f"<rect x='0' y='560' width='{W}' height='90' fill='#fff1d8'/>")
for i in range(0, W, 64):
    A(f"<path d='M{i},560 v90' stroke='#f0dcb4' stroke-width='3'/>")
A(f"<rect x='0' y='560' width='{W}' height='8' fill='#ffffff' opacity='.7'/>")
A(f"<rect x='0' y='650' width='{W}' height='{H-650}' fill='#efe3cf'/>")
for i in range(140):
    A(f"<ellipse cx='{random.uniform(0,W):.0f}' cy='{random.uniform(665,H-8):.0f}' rx='{random.uniform(8,13):.0f}' ry='{random.uniform(4,6):.0f}' fill='#f8eedd'/>")
A(f"<rect x='0' y='648' width='{W}' height='6' fill='#e2c597'/>")
# os três lugares da Rua Harajuku, grandes e com espaço
def predio(cab, cx):
    A(f"<g transform='translate({cx},566) scale(2.05)'>"); bloco(cab, 0, 0); A('</g>')
for indice, (cab, cx) in enumerate(zip(lugares, (300, 800, 1300))):
    if cab:
        predio(cab, cx)
    elif bairro == 'praca' and indice == 1:
        # Fonte do Encontro do dia
        A(f"<ellipse cx='{cx}' cy='565' rx='110' ry='27' fill='#c9a7ff'/>")
        A(f"<ellipse cx='{cx}' cy='559' rx='98' ry='22' fill='{grad('fonterua', '#a9ecff', '#58b8f5')}'/>")
        A(f"<rect x='{cx-8}' y='475' width='16' height='80' rx='8' fill='#b98bff'/>")
        A(f"<path d='M{cx},483 q-55,-50 -55,43 M{cx},483 q55,-50 55,43' stroke='#7fd3ff' stroke-width='8' fill='none' stroke-linecap='round'/>")
        A(f"<circle cx='{cx}' cy='482' r='13' fill='#ffe08a'/>")
    elif bairro == 'arena' and indice == 1:
        A(f"<ellipse cx='{cx}' cy='558' rx='195' ry='54' fill='#7951bc' opacity='.3'/>")
        A(f"<path d='M{cx-170},560 L{cx-152},370 Q{cx},300 {cx+152},370 L{cx+170},560 Z' fill='{grad('arenarua','#a37bff','#7b3ff0')}'/>")
        A(f"<path d='M{cx-128},552 L{cx-112},416 Q{cx},358 {cx+112},416 L{cx+128},552 Z' fill='#ffe0f0'/>")
        A(f"<ellipse cx='{cx}' cy='552' rx='130' ry='28' fill='#ffb56b'/>")
    elif (bairro == 'fofo' and indice == 2) or (bairro == 'ceu' and indice == 2):
        # Lote de Bloom ou Studio; não cria jogo inexistente.
        A(f"<rect x='{cx-145}' y='452' width='290' height='110' rx='26' fill='#fff1df' stroke='#ffd2e9' stroke-width='5'/>")
        A(f"<rect x='{cx-92}' y='482' width='184' height='44' rx='22' fill='#ff6fb5'/>")
        A(f"<text x='{cx}' y='512' text-anchor='middle' font-family='Mochiy Pop One' font-size='20' fill='#fff'>Em breve ★</text>")
    elif bairro == 'arena':
        A(f"<rect x='{cx-75}' y='493' width='150' height='68' rx='28' fill='#fff1df'/>")
        A(f"<text x='{cx}' y='535' text-anchor='middle' font-family='Mochiy Pop One' font-size='30' fill='#9b30d9'>★</text>")
# vasos com arvorezinhas e postes entre os prédios
for px in (550, 1050):
    G['poste'](px, 600)
for vx in (40, 1560):
    A(f"<rect x='{vx-16}' y='{580}' width='32' height='26' rx='6' fill='#ff9bd0'/>")
    G['arvore'](vx, 584, .7)
# topo: título do bairro e volta para o mapa
A(f"<g transform='translate(30,26)'><rect width='280' height='56' rx='28' fill='#fff' opacity='.92'/><text x='140' y='37' text-anchor='middle' font-family='Mochiy Pop One' font-size='{21 if bairro == 'palco' else 24}' fill='{cor_tema}'>{titulo}</text></g>")
A(f"<g transform='translate({W-200},28)'><rect width='170' height='48' rx='24' fill='{cor_tema}'/><text x='85' y='32' text-anchor='middle' font-family='Mochiy Pop One' font-size='18' fill='#fff'>◀ Mapa</text></g>")
salvar('rua' if len(sys.argv) == 1 else 'rua_' + bairro, W, H)
print('ok')
