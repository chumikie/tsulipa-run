from lib import G, bloco, novo, salvar
import random
random.seed(5)
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
predio('# Happy⭐Cafe!', 300)
predio('# Star⭐Gacha!', 800)
predio('# Zipper⭐Shop!', 1300)
# vasos com arvorezinhas e postes entre os prédios
for px in (550, 1050):
    G['poste'](px, 600)
for vx in (40, 1560):
    A(f"<rect x='{vx-16}' y='{580}' width='32' height='26' rx='6' fill='#ff9bd0'/>")
    G['arvore'](vx, 584, .7)
# topo: título do bairro e volta para o mapa
A(f"<g transform='translate(30,26)'><rect width='280' height='56' rx='28' fill='#fff' opacity='.92'/><text x='140' y='37' text-anchor='middle' font-family='Mochiy Pop One' font-size='24' fill='#7b3ff0'>🛍️ Rua Harajuku</text></g>")
A(f"<g transform='translate({W-200},28)'><rect width='170' height='48' rx='24' fill='#7b3ff0'/><text x='85' y='32' text-anchor='middle' font-family='Mochiy Pop One' font-size='18' fill='#fff'>◀ Mapa</text></g>")
salvar('rua', W, H)
print('ok')
