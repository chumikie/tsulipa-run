import json, math, random, urllib.parse
random.seed(48)
W, H = 1600, 1000
# Reutiliza os ícones originais já incorporados ao SVG publicado, sem redesenhar.
# O antigo ../arte/icons.json não foi incluído no repositório.
from pathlib import Path
import re
def carregar_icones():
    arquivo = Path(__file__).resolve().parent.parent / 'arte' / 'icons.json'
    if arquivo.is_file():
        return json.loads(arquivo.read_text(encoding='utf-8'))
    original = (Path(__file__).resolve().parents[2] / 'mapa-cidade.svg').read_text(encoding='utf-8')
    codificados = re.findall(r"<image\\b[^>]*href='data:image/svg\\+xml;utf8,([^']+)'", original)
    ordem = ['hubduo', 'hubhandshake', 'hubcafe', 'hubpet', 'hubpet',
             'hubperf', 'hubgacha', 'hubloja', 'tw-hubgame-karaoke',
             'tw-hubgame-karaoke', 'hubjornal', 'hubfa', 'hubrun',
             'tw-hubgame-sora', 'hubenc']
    if len(codificados) != len(ordem):
        raise ValueError(f'Ícones originais inesperados: {len(codificados)}; esperado {len(ordem)}')
    if codificados[3] != codificados[4] or codificados[8] != codificados[9]:
        raise ValueError('Ordem dos ícones alterada no mapa original')
    icones = {}
    for chave, dado in zip(ordem, codificados):
        icones[chave] = urllib.parse.unquote(dado)
    return icones
ICON = carregar_icones()
out = []
defs = []
A = out.append

def ic(key, x, y, s):
    uri = 'data:image/svg+xml;utf8,' + urllib.parse.quote(ICON[key])
    return f"<image href='{uri}' x='{x - s/2:.1f}' y='{y - s/2:.1f}' width='{s}' height='{s}'/>"

def grad(gid, c1, c2, x2=0, y2=1):
    defs.append(f"<linearGradient id='{gid}' x1='0' y1='0' x2='{x2}' y2='{y2}'><stop offset='0' stop-color='{c1}'/><stop offset='1' stop-color='{c2}'/></linearGradient>")
    return f"url(#{gid})"

defs.append("<filter id='stk' x='-5%' y='-8%' width='110%' height='116%' color-interpolation-filters='sRGB'>"
 "<feMorphology in='SourceAlpha' operator='dilate' radius='4' result='d'/>"
 "<feFlood flood-color='#ffffff'/><feComposite in2='d' operator='in' result='w'/>"
 "<feGaussianBlur in='d' stdDeviation='3' result='b'/><feOffset in='b' dy='5' result='o'/>"
 "<feFlood flood-color='#5a2fa8' flood-opacity='.28'/><feComposite in2='o' operator='in' result='s'/>"
 "<feMerge><feMergeNode in='s'/><feMergeNode in='w'/><feMergeNode in='SourceGraphic'/></feMerge></filter>")
# textura de bolinhas na grama (como nos cards)
defs.append("<pattern id='dots' width='18' height='18' patternUnits='userSpaceOnUse'><circle cx='4' cy='4' r='1.6' fill='#ffffff' opacity='.35'/></pattern>")

# ---------- céu ----------
sky = grad('sky', '#bfe3ff', '#fbe7ff')
A(f"<rect width='{W}' height='{H}' fill='{sky}'/>")
# bolinhas de fundo
for i in range(70):
    x, y = random.uniform(0, W), random.uniform(0, H)
    A(f"<circle cx='{x:.0f}' cy='{y:.0f}' r='{random.choice([2,2.5,3])}' fill='#fff' opacity='{random.uniform(.35,.7):.2f}'/>")
def sparkle(x, y, s, c='#fff'):
    A(f"<path d='M{x},{y-s} Q{x+s*.18},{y-s*.18} {x+s},{y} Q{x+s*.18},{y+s*.18} {x},{y+s} Q{x-s*.18},{y+s*.18} {x-s},{y} Q{x-s*.18},{y-s*.18} {x},{y-s}Z' fill='{c}'/>")
for x, y, s in [(90,120,14),(330,70,10),(620,60,12),(1040,90,9),(1520,420,12),(70,520,9),(1550,700,10),(150,860,12),(1460,900,9)]:
    sparkle(x, y, s)

def cloud(x, y, s, op=1):
    A(f"<g opacity='{op}' transform='translate({x},{y}) scale({s})'>"
      "<ellipse cx='0' cy='14' rx='78' ry='16' fill='#9bc3ec' opacity='.35'/>"
      "<path d='M-70,10 C-86,10 -88,-14 -66,-16 C-64,-38 -34,-44 -22,-28 C-14,-52 26,-54 34,-26 C52,-40 80,-26 70,-6 C88,-4 86,12 70,12 Z' fill='#fff'/>"
      "<path d='M-56,-14 C-50,-26 -38,-28 -30,-22' stroke='#eaf4ff' stroke-width='6' fill='none' stroke-linecap='round'/></g>")
cloud(180, 150, .9); cloud(470, 110, .6, .9); cloud(980, 150, .7, .9); cloud(1230, 90, .55, .85); cloud(90, 930, .6, .8); cloud(1520, 960, .7, .8)

# ---------- ilha (sem contorno: borda clara de grama, terra em camadas, raízes, pedrinhas flutuando) ----------
ilha = "M150,600 C140,430 330,300 560,285 C700,262 900,262 1060,282 C1290,300 1470,410 1460,600 C1452,780 1260,905 1000,925 C860,940 720,940 590,925 C340,905 160,790 150,600 Z"
A(f"<path d='{ilha}' transform='translate(0,58)' fill='#a8723f'/>")
A(f"<path d='{ilha}' transform='translate(0,44)' fill='{grad('terra', '#d9a26a', '#b98552')}'/>")
A(f"<path d='{ilha}' transform='translate(0,26)' fill='#e3b27c'/>")
for i in range(22):
    t = (i + .5) / 22 * math.pi
    x = 805 + 640 * math.cos(t); y = 640 + 292 * math.sin(t)
    if y > 690:
        A(f"<path d='M{x-18:.0f},{y+40:.0f} q18,-5 36,0' stroke='#c98d55' stroke-width='4' fill='none' stroke-linecap='round' opacity='.7'/>")
        if i % 3 == 0:
            A(f"<ellipse cx='{x+10:.0f}' cy='{y+52:.0f}' rx='7' ry='4.5' fill='#f0c590'/>")
A(f"<path d='{ilha}' fill='{grad('grama', '#c4f4cb', '#92ddb0')}'/>")
A(f"<path d='{ilha}' fill='none' stroke='#dcfbe2' stroke-width='7' opacity='.9'/>")
A(f"<path d='{ilha}' fill='url(#dots)'/>")
for (mx0, my0, mrx, mry, cor, op) in [(560,380,170,50,'#ffffff',.18),(1080,360,150,46,'#ffffff',.16),(420,640,120,40,'#7fcf9c',.18),(1180,700,140,42,'#7fcf9c',.16),(800,860,220,44,'#7fcf9c',.14),(300,520,90,34,'#ffffff',.16),(1380,520,80,40,'#ffffff',.14)]:
    A(f"<ellipse cx='{mx0}' cy='{my0}' rx='{mrx}' ry='{mry}' fill='{cor}' opacity='{op}'/>")

# ---------- ruas (até a praça) ----------
PRACA = (800, 610)
destinos = {
    'run': (800, 410), 'hs': (520, 470), 'cafe': (330, 670), 'duo': (300, 420), 'pet': (500, 800),
    'casa': (800, 830), 'gacha': (1110, 800), 'loja': (1300, 700), 'kt': (1150, 470), 'news': (990, 590), 'sora': (1330, 430),
}
def rua(a, b, curva=0):
    (x1, y1), (x2, y2) = a, b
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    dx, dy = x2 - x1, y2 - y1
    cx, cy = mx - dy * curva, my + dx * curva
    d = f"M{x1},{y1} Q{cx:.0f},{cy:.0f} {x2},{y2}"
    return d
ruas = [rua(PRACA, destinos[k], c) for k, c in [('run', 0), ('hs', .12), ('cafe', -.1), ('pet', .1), ('casa', 0), ('gacha', -.12), ('loja', .1), ('kt', -.12), ('sora', -.05)]]
ruas.append(rua(destinos['hs'], destinos['duo'], .15))
def qpts(a, b, curva, passo=24):
    (x1, y1), (x2, y2) = a, b
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2; dx, dy = x2 - x1, y2 - y1
    cx, cy = mx - dy * curva, my + dx * curva
    L = math.hypot(dx, dy); n = max(2, int(L / passo))
    return [((1-t)**2*x1 + 2*(1-t)*t*cx + t*t*x2, (1-t)**2*y1 + 2*(1-t)*t*cy + t*t*y2) for t in [i / n for i in range(n + 1)]]
for d in ruas:
    A(f"<path d='{d}' stroke='#e2c597' stroke-width='46' fill='none' stroke-linecap='round'/>")
for d in ruas:
    A(f"<path d='{d}' stroke='#fff1d8' stroke-width='38' fill='none' stroke-linecap='round'/>")
random.seed(7)
for (k, c) in [('run', 0), ('hs', .12), ('cafe', -.1), ('pet', .1), ('casa', 0), ('gacha', -.12), ('loja', .1), ('kt', -.12), ('sora', -.05)]:
    for (qx, qy) in qpts(PRACA, destinos[k], c)[2:-1]:
        for off in (-10, 9):
            A(f"<ellipse cx='{qx+random.uniform(-4,4)+off*.3:.0f}' cy='{qy+random.uniform(-4,4)+off*.5:.0f}' rx='{random.uniform(5,7):.1f}' ry='{random.uniform(3.2,4.2):.1f}' fill='#f2dcb2' opacity='.9'/>")
for (qx, qy) in qpts(destinos['hs'], destinos['duo'], .15)[1:-1]:
    A(f"<ellipse cx='{qx+random.uniform(-4,4):.0f}' cy='{qy+random.uniform(-4,4):.0f}' rx='6' ry='3.6' fill='#f2dcb2' opacity='.9'/>")
random.seed(48)

# ---------- praça + fonte (Encontro do dia) ----------
px, py = PRACA
A(f"<ellipse cx='{px}' cy='{py+6}' rx='132' ry='70' fill='#e9c98f'/>")
A(f"<ellipse cx='{px}' cy='{py}' rx='128' ry='66' fill='#fff2d4'/>")
for r in (100, 76):
    A(f"<ellipse cx='{px}' cy='{py}' rx='{r}' ry='{r*.52:.0f}' fill='none' stroke='#f3dcae' stroke-width='3'/>")
A(f"<ellipse cx='{px}' cy='{py+4}' rx='62' ry='30' fill='#c9a7ff'/>")
A(f"<ellipse cx='{px}' cy='{py}' rx='58' ry='27' fill='{grad('agua', '#9fe6ff', '#58b8f5')}'/>")
A(f"<ellipse cx='{px-16}' cy='{py-6}' rx='16' ry='5' fill='#fff' opacity='.7'/>")
A(f"<rect x='{px-7}' y='{py-40}' width='14' height='40' rx='6' fill='#b98bff'/>")
A(f"<path d='M{px},{py-42} C{px-30},{py-70} {px-40},{py-30} {px-34},{py-8} M{px},{py-42} C{px+30},{py-70} {px+40},{py-30} {px+34},{py-8}' stroke='#7fd3ff' stroke-width='6' fill='none' stroke-linecap='round'/>")
A(f"<circle cx='{px}' cy='{py-46}' r='10' fill='{grad('fonte', '#fff3a0', '#ffc21a')}'/><circle cx='{px-3}' cy='{py-49}' r='3' fill='#fff'/>")

# ---------- elementos ----------
def sombra(x, y, rx, ry=12):
    A(f"<ellipse cx='{x}' cy='{y}' rx='{rx}' ry='{ry}' fill='#3c8f63' opacity='.22'/>")

def arvore(x, y, s=1, cor='#6fd18f', cor2='#9ae8a9', cor0='#4fb87a'):
    A(f"<ellipse cx='{x}' cy='{y+2}' rx='{24*s:.1f}' ry='{6*s:.1f}' fill='#3c8f63' opacity='.2'/>")
    A(f"<rect x='{x-5*s:.1f}' y='{y-26*s:.1f}' width='{10*s:.1f}' height='{28*s:.1f}' rx='4' fill='{grad('tronco', '#c98d55', '#a06a3c', 1, 0)}'/>")
    A(f"<circle cx='{x}' cy='{y-42*s:.1f}' r='{27*s:.1f}' fill='{cor0}'/>")
    A(f"<circle cx='{x-12*s:.1f}' cy='{y-48*s:.1f}' r='{19*s:.1f}' fill='{cor}'/><circle cx='{x+12*s:.1f}' cy='{y-46*s:.1f}' r='{18*s:.1f}' fill='{cor}'/><circle cx='{x}' cy='{y-60*s:.1f}' r='{18*s:.1f}' fill='{cor}'/>")
    A(f"<circle cx='{x-8*s:.1f}' cy='{y-63*s:.1f}' r='{8*s:.1f}' fill='{cor2}'/><circle cx='{x-16*s:.1f}' cy='{y-50*s:.1f}' r='{5*s:.1f}' fill='{cor2}' opacity='.8'/>")

def sakura(x, y, s=1):
    arvore(x, y, s, '#ffb3d6', '#ffe0ef', '#f58fc0')
    for i in range(5):
        A(f"<circle cx='{x+random.uniform(-20,20)*s:.0f}' cy='{y-46*s+random.uniform(-18,18)*s:.0f}' r='{2.5*s:.1f}' fill='#ff7fb8'/>")

def flor(x, y, c):
    for a in range(5):
        t = a / 5 * math.tau
        A(f"<circle cx='{x+5*math.cos(t):.1f}' cy='{y+5*math.sin(t):.1f}' r='4' fill='{c}'/>")
    A(f"<circle cx='{x}' cy='{y}' r='3' fill='#ffe14d'/>")

def poste(x, y):
    A(f"<ellipse cx='{x}' cy='{y+2}' rx='9' ry='3' fill='#3c8f63' opacity='.2'/>")
    A(f"<rect x='{x-3}' y='{y-58}' width='6' height='58' rx='3' fill='{grad('poste', '#9b78e6', '#6c4fc4', 1, 0)}'/>")
    A(f"<circle cx='{x}' cy='{y-64}' r='20' fill='#fff7b8' opacity='.3'/><circle cx='{x}' cy='{y-64}' r='9' fill='#fff7b8'/><circle cx='{x-3}' cy='{y-67}' r='3' fill='#fff'/>")

def placa(x, y, nome, c1, c2, icone=None, larg=None):
    # etiqueta em pílula com o nome do jogo (a ⭐ vira estrela amarela)
    partes = nome.split('⭐')
    n = len(nome)
    w = larg or (n * 13.6 + (52 if icone else 30))
    gid = f"pl{abs(hash(nome))%99999}"
    A(f"<g><rect x='{x-w/2:.0f}' y='{y-17+4}' width='{w:.0f}' height='36' rx='18' fill='{c2}' opacity='.55'/>"
      f"<rect x='{x-w/2:.0f}' y='{y-17}' width='{w:.0f}' height='36' rx='18' fill='{grad(gid, c1, c2, 1, 0)}' stroke='#fff' stroke-width='3'/>")
    tx = x + (12 if icone else 0)
    if icone:
        A(f"<circle cx='{x-w/2+20:.0f}' cy='{y+1}' r='13' fill='#fff' opacity='.28'/>" + ic(icone, x - w / 2 + 20, y + 1, 24))
    if len(partes) == 2:
        A(f"<text x='{tx:.0f}' y='{y+8}' text-anchor='middle' font-family='Mochiy Pop One' font-size='18' fill='#fff' stroke='{c2}' stroke-width='4' paint-order='stroke'>{partes[0]}<tspan fill='#ffe14d'>★</tspan>{partes[1]}</text></g>")
    else:
        A(f"<text x='{tx:.0f}' y='{y+8}' text-anchor='middle' font-family='Mochiy Pop One' font-size='18' fill='#fff' stroke='{c2}' stroke-width='4' paint-order='stroke'>{nome}</text></g>")

def janela(x, y, w, h, c='#bfe9ff'):
    A(f"<rect x='{x}' y='{y}' width='{w}' height='{h}' rx='6' fill='{c}' stroke='#ffffff' stroke-width='3'/>")
    A(f"<path d='M{x+5},{y+h-6} L{x+w*.55:.0f},{y+5}' stroke='#fff' stroke-width='4' opacity='.8' stroke-linecap='round'/>")

def porta(x, by, w=34, h=46, c='#7b3ff0'):
    A(f"<path d='M{x-w/2},{by} V{by-h+w/2} A{w/2},{w/2} 0 0 1 {x+w/2},{by-h+w/2} V{by} Z' fill='{c}' stroke='#fff' stroke-width='3'/>")
    A(f"<circle cx='{x+w/4:.0f}' cy='{by-h/2+4:.0f}' r='3' fill='#ffe14d'/>")

def toldo(x, y, w, c1, c2, n=6):
    s = w / n
    for i in range(n):
        A(f"<path d='M{x+i*s:.1f},{y} h{s:.1f} v18 a{s/2:.1f},{s/2*0.8:.1f} 0 0 1 -{s:.1f},0 Z' fill='{c1 if i%2==0 else c2}'/>")
    A(f"<rect x='{x-4}' y='{y-8}' width='{w+8}' height='12' rx='6' fill='{c2}'/>")

def predio(cx, by, w, h, parede, borda, telhado=None, tc='#ff6fb5', tb='#d94d92'):
    sombra(cx, by + 4, w * .62, 14)
    A(f"<rect x='{cx-w/2}' y='{by-h}' width='{w}' height='{h}' rx='12' fill='{parede}' stroke='{borda}' stroke-width='4'/>")
    A(f"<rect x='{cx-w/2+8}' y='{by-h+8}' width='{w-16}' height='8' rx='4' fill='#fff' opacity='.45'/>")
    if telhado == 'tri':
        A(f"<path d='M{cx-w/2-16},{by-h+6} L{cx},{by-h-64} L{cx+w/2+16},{by-h+6} Z' fill='{tc}' stroke='{tb}' stroke-width='4' stroke-linejoin='round'/>")
        A(f"<path d='M{cx-w/2+4},{by-h-4} L{cx},{by-h-52}' stroke='#fff' stroke-width='5' opacity='.45' stroke-linecap='round'/>")

# ---------- ajudantes no estilo das cenas do jogo (sem contorno grosso; madeira, listras, babado, vidro, brilho) ----------
defs.append("<filter id='glow' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='7'/></filter>")
def madeira(x0, y0, w, h):
    A(f"<rect x='{x0}' y='{y0}' width='{w}' height='{h}' rx='6' fill='{grad('mad'+str(x0)+'_'+str(y0), '#dfa86f', '#b97a45')}'/>")
    A(f"<rect x='{x0}' y='{y0}' width='{w}' height='6' rx='3' fill='#f3cc98'/>")
    for k in range(max(1, int((h - 10) // 10))):
        A(f"<path d='M{x0+10},{y0+14+k*10} h{w*0.34:.0f} M{x0+w*0.52:.0f},{y0+18+k*10} h{w*0.36:.0f}' stroke='#a8693a' stroke-width='2' opacity='.4' stroke-linecap='round'/>")
def sombra2(x, b, rx):
    A(f"<ellipse cx='{x}' cy='{b+6}' rx='{rx}' ry='13' fill='#5a3a7a' opacity='.18'/>")
def listras(x0, y0, w, h, c1, c2, n=8):
    s = w / n
    for i in range(n):
        A(f"<rect x='{x0+i*s:.1f}' y='{y0}' width='{s+.5:.1f}' height='{h}' fill='{c1 if i%2 else c2}'/>")
def babado(x0, y, w, c, r=10):
    n = int(w // (2*r)) + 1
    for i in range(n):
        A(f"<circle cx='{x0+i*2*r:.1f}' cy='{y}' r='{r}' fill='{c}'/>")
def bandeiras(x0, y, w, n=8):
    cs = ['#ff6fb5', '#ffd36b', '#7fd3ff', '#b6ff3b', '#b98bff']
    A(f"<path d='M{x0},{y} Q{x0+w/2},{y+10} {x0+w},{y}' stroke='#fff' stroke-width='2' fill='none' opacity='.9'/>")
    for i in range(n):
        t = (i + .5) / n; px = x0 + w * t; py = y + 10 * 4 * t * (1 - t) * .5
        A(f"<path d='M{px-6:.1f},{py:.1f} h12 l-6,12 z' fill='{cs[i%len(cs)]}'/>")
def vidro(x0, y0, w, h, c='#c9ecff', rx=6):
    A(f"<rect x='{x0}' y='{y0}' width='{w}' height='{h}' rx='{rx}' fill='{c}'/>")
    A(f"<path d='M{x0+5},{y0+h-6} L{x0+w*0.5:.0f},{y0+5}' stroke='#fff' stroke-width='5' opacity='.7' stroke-linecap='round'/>")
    A(f"<path d='M{x0+w*0.55:.0f},{y0+h-5} L{x0+w-5},{y0+h*0.35:.0f}' stroke='#fff' stroke-width='3' opacity='.5' stroke-linecap='round'/>")
def brilhos(pts, c='#fff'):
    for (bx, by, bs) in pts:
        A(f"<path d='M{bx},{by-bs} Q{bx+bs*.2},{by-bs*.2} {bx+bs},{by} Q{bx+bs*.2},{by+bs*.2} {bx},{by+bs} Q{bx-bs*.2},{by+bs*.2} {bx-bs},{by} Q{bx-bs*.2},{by-bs*.2} {bx},{by-bs}Z' fill='{c}'/>")
def holofote(x, y, ang, comp=170, larg=70, op=.28):
    A(f"<path d='M{x},{y} L{x-larg/2},{y+comp} L{x+larg/2},{y+comp} Z' fill='#fff7c8' opacity='{op}' transform='rotate({ang} {x} {y})'/>")

# ---------- prédios ----------
A('<g>')
# Moon⭐Duo! — mirante noturno com cúpula lilás, pilares e lua brilhando
x, b = 300, 420
A(f"<ellipse cx='{x}' cy='{b-22}' rx='118' ry='58' fill='{grad('noite', '#5a4fc9', '#2d2878')}'/>")
A(f"<ellipse cx='{x}' cy='{b-30}' rx='100' ry='42' fill='#ffffff' opacity='.05'/>")
brilhos([(238,372,6),(352,360,5),(382,398,6),(222,404,4),(300,350,4)], '#fff7b8')
sombra2(x, b - 6, 70)
A(f"<rect x='{x-62}' y='{b-24}' width='124' height='14' rx='7' fill='{grad('pisoduo', '#e9dcff', '#c4b0ff')}'/>")
for dx in (-46, 46):
    A(f"<rect x='{x+dx-6}' y='{b-96}' width='12' height='74' rx='5' fill='{grad('pil'+str(dx), '#ffffff', '#ddd0ff', 1, 0)}'/>")
A(f"<path d='M{x-74},{b-92} Q{x},{b-158} {x+74},{b-92} Z' fill='{grad('cup', '#b49cff', '#7d63e6')}'/>")
A(f"<path d='M{x-48},{b-108} Q{x-10},{b-138} {x+14},{b-136}' stroke='#fff' stroke-width='6' opacity='.45' fill='none' stroke-linecap='round'/>")
babado(x-70, b-92, 140, '#e9dcff', 7)
for i in range(7):
    A(f"<circle cx='{x-54+i*18}' cy='{b-80+abs(3-i)*2}' r='3.5' fill='#fff7b8'/>")
A(f"<circle cx='{x+8}' cy='{b-176}' r='30' fill='#fff1a8' opacity='.35' filter='url(#glow)'/>")
A(f"<path d='M{x+6},{b-198} a26,26 0 1 0 22,36 a20,20 0 1 1 -22,-36 Z' fill='{grad('lua', '#fff4b8', '#ffd86b')}'/>")
placa(x, b + 32, 'Moon⭐Duo!', '#7a64e6', '#3b2d9c', 'hubduo')
# Handshake⭐Event! — salão escuro com holofotes e a mesa de madeira da cena do jogo
x, b = 520, 470
sombra2(x, b, 100)
A(f"<path d='M{x-86},{b} V{b-96} Q{x-86},{b-128} {x-54},{b-128} H{x+54} Q{x+86},{b-128} {x+86},{b-96} V{b} Z' fill='{grad('salao', '#4a33a6', '#271a6b')}'/>")
holofote(x-50, b-124, -14, 120, 46, .22); holofote(x+50, b-124, 14, 120, 46, .22)
for (dx, dy) in [(-60,-100),(-20,-112),(30,-104),(64,-90),(-40,-70),(48,-66),(0,-84)]:
    A(f"<circle cx='{x+dx}' cy='{b+dy}' r='2.2' fill='#fff' opacity='.75'/>")
A(f"<rect x='{x-56}' y='{b-146}' width='112' height='24' rx='12' fill='#fff' opacity='.95'/>")
A(f"<path d='M{x},{b-128} c-6,-8 -18,-5 -16,4 c1,7 12,12 16,16 c4,-4 15,-9 16,-16 c2,-9 -10,-12 -16,-4Z' fill='#ff6f9e' transform='translate(-28,-6) scale(.7)' transform-origin='{x} {b-128}'/>")
A(f"<text x='{x+8}' y='{b-129}' text-anchor='middle' font-family='Mochiy Pop One' font-size='10' fill='#ff5a85'>握手会</text>")
madeira(x-62, b-40, 124, 42)
A(f"<rect x='{x-24}' y='{b-30}' width='48' height='16' rx='8' fill='#f3e3ff'/><text x='{x}' y='{b-18}' text-anchor='middle' font-family='Mochiy Pop One' font-size='10' fill='#9b4bf0'>Idol</text>")
placa(x, b + 34, 'Handshake⭐Event!', '#ff9f80', '#ff5a85', 'hubhandshake')
# Happy⭐Cafe! — fachada no estilo da cena do jogo: parede listrada, babado, lousa com moldura de madeira, balcão de madeira
x, b = 330, 670
A(f"<ellipse cx='{x}' cy='{b+6}' rx='96' ry='13' fill='#5a3a7a' opacity='.18'/>")
for i in range(8):
    A(f"<rect x='{x-80+i*20}' y='{b-112}' width='20' height='86' fill='{'#ffe4f0' if i%2 else '#fff6fa'}'/>")
A(f"<rect x='{x-80}' y='{b-112}' width='160' height='86' fill='none'/>")
for i in range(9):
    A(f"<circle cx='{x-80+i*20}' cy='{b-112}' r='10' fill='#ffd0e6'/>")
A(f"<rect x='{x-84}' y='{b-126}' width='168' height='14' rx='7' fill='#ffb3d6'/>")
# lousa
A(f"<rect x='{x-14}' y='{b-104}' width='86' height='52' rx='6' fill='#a8774a'/><rect x='{x-9}' y='{b-99}' width='76' height='42' rx='4' fill='#3b3346'/>")
A(f"<text x='{x+29}' y='{b-83}' text-anchor='middle' font-family='Mochiy Pop One' font-size='9' fill='#fff'>Happy★Cafe!</text>")
A(f"<path d='M{x-2},{b-70} h62 M{x+4},{b-63} h50' stroke='#fff' stroke-width='2' opacity='.5' stroke-linecap='round'/>")
# prateleira com copinhos e vaso
A(f"<rect x='{x-74}' y='{b-74}' width='50' height='5' rx='2' fill='#d9a06a'/>")
for k,c in enumerate(['#ff9cc4','#9fd18b','#a99cff']):
    A(f"<rect x='{x-70+k*16}' y='{b-88}' width='11' height='14' rx='3' fill='{c}'/><rect x='{x-70+k*16}' y='{b-88}' width='11' height='4' rx='2' fill='#fff'/>")
madeira(x-90, b-30, 180, 32)
A(f"<rect x='{x+58}' y='{b-48}' width='14' height='18' rx='3' fill='#ff9cc4'/><circle cx='{x+65}' cy='{b-54}' r='8' fill='#ff7cc0'/><circle cx='{x+65}' cy='{b-54}' r='3' fill='#ffe14d'/>")
for i,c in enumerate(['#ff6fb5','#ffd36b','#7fd3ff','#b6ff3b','#b98bff','#ff6fb5','#ffd36b','#7fd3ff']):
    A(f"<path d='M{x-80+i*20},{b-126} l10,0 l-5,10 z' fill='{c}'/>")
placa(x, b + 34, 'Happy⭐Cafe!', '#ffc56e', '#f08a52', 'hubcafe')

# Backstage⭐Pet! — camarim dos pets: parede listrada menta, janela redonda com patinha, porta com estrela
x, b = 500, 800
sombra2(x, b, 88)
listras(x-70, b-92, 140, 92, '#d9fbf3', '#bff2e6', 7)
A(f"<path d='M{x-80},{b-92} L{x},{b-150} L{x+80},{b-92} Z' fill='{grad('telpet', '#4fd8bd', '#23a594')}'/>")
for k in range(3):
    A(f"<path d='M{x-64+k*10},{b-100-k*14} H{x+64-k*10}' stroke='#7ae6cf' stroke-width='4' opacity='.6' stroke-linecap='round'/>")
A(f"<circle cx='{x}' cy='{b-118}' r='14' fill='#fff'/>" + ic('hubpet', x, b - 118, 20).replace("href=", "style='filter:invert(48%) sepia(60%) saturate(500%) hue-rotate(125deg)' href="))
A(f"<path d='M{x-17},{b} V{b-34} a17,17 0 0 1 34,0 V{b} Z' fill='{grad('portapet', '#2bb59d', '#1e8f9a')}'/>")
brilhos([(x, b-26, 6)], '#fff7b8')
vidro(x-60, b-70, 30, 28, '#e6fffa'); vidro(x+30, b-70, 30, 28, '#e6fffa')
madeira(x-74, b-8, 148, 10)
A(f"<g transform='translate({x+92},{b-4}) rotate(-12)'><rect x='-16' y='-4' width='32' height='8' rx='4' fill='#fff'/><circle cx='-16' cy='-4' r='5' fill='#fff'/><circle cx='-16' cy='4' r='5' fill='#fff'/><circle cx='16' cy='-4' r='5' fill='#fff'/><circle cx='16' cy='4' r='5' fill='#fff'/></g>")
placa(x, b + 34, 'Backstage⭐Pet!', '#34c9ad', '#1e8f9a', 'hubpet')
# Minha casa (Meu Perfil) — casinha rosa com telhado de escamas, janela de coração, floreiras e chaminé
x, b = 800, 830
sombra2(x, b, 92)
A(f"<rect x='{x+36}' y='{b-152}' width='18' height='40' rx='4' fill='#ff8fc4'/>")
for i,(dx,dy,r) in enumerate([(45,-162,7),(54,-178,9),(48,-197,11)]):
    A(f"<circle cx='{x+dx}' cy='{b+dy}' r='{r}' fill='#fff' opacity='{.85-i*.2:.2f}'/>")
A(f"<rect x='{x-72}' y='{b-92}' width='144' height='92' rx='10' fill='{grad('parcasa', '#fff0f7', '#ffd6ea')}'/>")
A(f"<path d='M{x-86},{b-88} L{x},{b-156} L{x+86},{b-88} Z' fill='{grad('telcasa', '#ff9ccd', '#ff5aa5')}'/>")
for k in range(3):
    y = b - 98 - k * 18; w = 70 - k * 20
    babado(x - w, y, 2 * w, '#ffb8da', 6)
A(f"<path d='M{x},{b-112} c-7,-9 -21,-5 -19,5 c1,8 13,13 19,18 c6,-5 18,-10 19,-18 c2,-10 -12,-14 -19,-5Z' fill='#fff'/>")
vidro(x-62, b-68, 32, 28, '#e3f4ff'); vidro(x+30, b-68, 32, 28, '#e3f4ff')
for wx in (x-64, x+28):
    A(f"<rect x='{wx-2}' y='{b-38}' width='38' height='8' rx='4' fill='#c98a55'/>")
    for k in range(4):
        A(f"<circle cx='{wx+4+k*10}' cy='{b-40}' r='4.5' fill='{['#ff6fb5','#ffd36b','#fff','#b98bff'][k]}'/>")
A(f"<path d='M{x-17},{b} V{b-34} a17,17 0 0 1 34,0 V{b} Z' fill='{grad('portacasa', '#ff7cbc', '#e2569b')}'/><circle cx='{x+8}' cy='{b-18}' r='3' fill='#ffe14d'/>")
madeira(x-84, b-8, 168, 10)
placa(x, b + 34, 'Meu Perfil', '#ff86bf', '#ff5aa5', 'hubperf')
# Star⭐Gacha! — a barraquinha da cena do jogo: postes de madeira, toldo listrado, máquina vermelha com cúpula
x, b = 1110, 800
A(f"<ellipse cx='{x}' cy='{b+6}' rx='96' ry='13' fill='#5a3a7a' opacity='.18'/>")
for px in (x-78, x+70):
    A(f"<rect x='{px}' y='{b-172}' width='9' height='172' rx='3' fill='{grad('poste'+str(px), '#d9a06a', '#a8693a', 1, 0)}'/>")
cores = ['#ff8cc6', '#ffffff', '#62d27e', '#ffffff', '#5aa0f0', '#ffffff', '#ff8cc6', '#ffffff']
for i, c in enumerate(cores):
    A(f"<path d='M{x-84+i*21},{b-130} h21 v20 a10.5,8 0 0 1 -21,0 Z' fill='{c}'/>")
A(f"<rect x='{x-88}' y='{b-186}' width='176' height='22' rx='11' fill='#ffd3ea'/>")
A(f"<text x='{x}' y='{b-170}' text-anchor='middle' font-family='Mochiy Pop One' font-size='13' fill='#d94d92'>STAR★GACHA!</text>")
# balcão de madeira
A(f"<rect x='{x-84}' y='{b-38}' width='168' height='40' rx='6' fill='{grad('balg', '#d9a06a', '#b97a45')}'/><rect x='{x-84}' y='{b-38}' width='168' height='6' rx='3' fill='#f0c590'/>")
for k in range(2):
    A(f"<path d='M{x-74},{b-22+k*10} h60 M{x+6},{b-18+k*10} h62' stroke='#a8693a' stroke-width='2' opacity='.45' stroke-linecap='round'/>")
# máquina
A(f"<rect x='{x+4}' y='{b-96}' width='54' height='58' rx='6' fill='{grad('maq', '#ff5a6e', '#d92f48')}'/>")
A(f"<rect x='{x+16}' y='{b-70}' width='30' height='12' rx='4' fill='#3b2040'/><circle cx='{x+46}' cy='{b-52}' r='6' fill='#ffd36b'/>")
A(f"<circle cx='{x+31}' cy='{b-118}' r='30' fill='#e8f8ff' opacity='.95'/>")
for cx2, cy2, c in [(-12,-4,'#ff9bd0'),(8,-12,'#7fd3ff'),(-2,8,'#b6ff3b'),(14,6,'#ffd36b'),(-16,12,'#b98bff'),(4,-2,'#ffffff')]:
    A(f"<circle cx='{x+31+cx2}' cy='{b-118+cy2}' r='8' fill='{c}'/><circle cx='{x+29+cx2}' cy='{b-120+cy2}' r='2.5' fill='#fff' opacity='.8'/>")
A(f"<path d='M{x+12},{b-130} a20,20 0 0 1 14,-14' stroke='#fff' stroke-width='5' fill='none' stroke-linecap='round'/>")
placa(x, b + 34, 'Star⭐Gacha!', '#ffd36b', '#f39a34', 'hubgacha')

# Zipper⭐Shop! — butique de Harajuku: listras lilás, toldo rosa com babado, vitrine com arara de roupas
x, b = 1300, 700
sombra2(x, b, 96)
listras(x-80, b-118, 160, 118, '#f6efff', '#ebe0ff', 8)
A(f"<rect x='{x-88}' y='{b-152}' width='176' height='30' rx='15' fill='{grad('plshop', '#a46bff', '#7b3ff0')}'/>")
A(f"<text x='{x}' y='{b-132}' text-anchor='middle' font-family='Mochiy Pop One' font-size='14' fill='#fff'>ZIPPER★SHOP!</text>")
brilhos([(x-80, b-150, 6), (x+84, b-128, 5)], '#ffe98a')
for i in range(8):
    A(f"<path d='M{x-80+i*20},{b-122} h20 v14 a10,8 0 0 1 -20,0 Z' fill='{'#ff9bd0' if i%2==0 else '#ffffff'}'/>")
vidro(x-68, b-92, 84, 76, '#e4f5ff', 8)
A(f"<path d='M{x-62},{b-78} H{x+10}' stroke='#c9a7ff' stroke-width='3' stroke-linecap='round'/>")
for i, c in enumerate(['#ff6fb5', '#7fd3ff', '#b6ff3b', '#ffd36b']):
    A(f"<path d='M{x-56+i*17},{b-78} l-7,8 h14 z M{x-63+i*17},{b-70} h14 l3,30 h-20 z' fill='{c}'/>")
A(f"<path d='M{x+28},{b} V{b-46} a18,18 0 0 1 36,0 V{b} Z' fill='{grad('portashop', '#b98bff', '#8a52f0')}'/><circle cx='{x+56}' cy='{b-22}' r='3' fill='#ffe14d'/>")
madeira(x-88, b-8, 176, 10)
placa(x, b + 34, 'Zipper⭐Shop!', '#b886ff', '#7b3ff0', 'hubloja')
# Karaoke⭐Time! — prédio com letreiro neon brilhando, janelas coloridas acesas e bandeirinhas
x, b = 1150, 470
sombra2(x, b, 86)
A(f"<rect x='{x-70}' y='{b-172}' width='140' height='172' rx='12' fill='{grad('parkt', '#ffe3f2', '#f7c6e6')}'/>")
A(f"<rect x='{x-70}' y='{b-172}' width='14' height='172' rx='7' fill='#ffffff' opacity='.35'/>")
bandeiras(x-70, b-172, 140, 8)
A(f"<rect x='{x-62}' y='{b-212}' width='124' height='40' rx='20' fill='#ff62ab' opacity='.55' filter='url(#glow)'/>")
A(f"<rect x='{x-58}' y='{b-208}' width='116' height='34' rx='17' fill='#2d1d6b'/>")
A(f"<rect x='{x-54}' y='{b-204}' width='108' height='26' rx='13' fill='none' stroke='#ff9bd0' stroke-width='2.5'/>")
A(f"<text x='{x}' y='{b-185}' text-anchor='middle' font-family='Mochiy Pop One' font-size='14' fill='#ffd6ec'>KARAOKE</text>")
for row in range(2):
    for col in range(3):
        c = ['#ffe98a', '#d9c8ff', '#b8ecff'][(row + col) % 3]
        vidro(x - 52 + col * 38, b - 150 + row * 46, 28, 34, c)
A(f"<path d='M{x-19},{b} V{b-36} a19,19 0 0 1 38,0 V{b} Z' fill='{grad('portakt', '#d14ba8', '#9e2f8a')}'/>")
madeira(x-80, b-8, 160, 10)
A(f"<circle cx='{x+88}' cy='{b-122}' r='22' fill='#b83a9e'/>" + ic('tw-hubgame-karaoke', x + 88, b - 122, 30))
for i in range(3):
    A(f"<text x='{x-98+i*8}' y='{b-130-i*22}' font-size='20' fill='#ff62ab' font-family='Mochiy Pop One'>♪</text>")
placa(x, b + 34, 'Karaoke⭐Time!', '#ff62ab', '#b83a9e', 'tw-hubgame-karaoke')
# Idol⭐News! — banca de revistas com toldo listrado azul e balcão de madeira
x, b = 990, 590
sombra2(x, b, 62)
A(f"<rect x='{x-46}' y='{b-70}' width='92' height='70' rx='8' fill='{grad('parnews', '#eef3ff', '#d6e2ff')}'/>")
for i in range(6):
    A(f"<path d='M{x-54+i*18},{b-82} h18 v14 a9,7 0 0 1 -18,0 Z' fill='{'#6fb6ff' if i%2==0 else '#ffffff'}'/>")
A(f"<rect x='{x-58}' y='{b-92}' width='116' height='12' rx='6' fill='#6a4ff0'/>")
for i in range(3):
    A(f"<rect x='{x-36+i*26}' y='{b-58}' width='20' height='28' rx='3' fill='#fff'/><rect x='{x-33+i*26}' y='{b-54}' width='14' height='7' rx='2' fill='{['#ff6fb5','#7b3ff0','#ffd36b'][i]}'/><rect x='{x-33+i*26}' y='{b-44}' width='14' height='3' fill='#d6e2ff'/>")
madeira(x-52, b-22, 104, 24)
placa(x, b + 30, 'Idol⭐News!', '#6fb6ff', '#6a4ff0', 'hubjornal')
# Pedido de fã — caixa de correio rosa com coração, poste de madeira
x, b = 650, 640
A(f"<ellipse cx='{x}' cy='{b+3}' rx='22' ry='6' fill='#5a3a7a' opacity='.18'/>")
A(f"<rect x='{x-4}' y='{b-42}' width='8' height='42' rx='3' fill='{grad('postecor', '#dfa86f', '#b97a45', 1, 0)}'/>")
A(f"<path d='M{x-24},{b-40} V{b-64} a24,19 0 0 1 48,0 V{b-40} Z' fill='{grad('caixa', '#ff9bd0', '#ff5aa5')}'/>")
A(f"<path d='M{x-16},{b-68} a16,12 0 0 1 14,-10' stroke='#fff' stroke-width='4' opacity='.6' fill='none' stroke-linecap='round'/>")
A(f"<rect x='{x+20}' y='{b-78}' width='4' height='24' fill='#c2459a'/><rect x='{x+20}' y='{b-78}' width='16' height='10' rx='2' fill='#ffe14d'/>")
A(f"<path d='M{x-2},{b-56} c-4,-5 -12,-3 -11,3 c1,5 8,8 11,11 c3,-3 10,-6 11,-11 c1,-6 -7,-8 -11,-3Z' fill='#fff'/>")
placa(x - 10, b + 28, 'Pedido de fã', '#ff7cc4', '#9b4bf0', 'hubfa')
# Center⭐Run! — o palco do hub: fundo roxo em degradê, bandeirinhas, holofotes, estrela brilhando e confete
x, b = 800, 410
sombra2(x, b + 4, 200)
holofote(x-150, b-214, 16, 210, 80, .22); holofote(x+150, b-214, -16, 210, 80, .22)
A(f"<rect x='{x-168}' y='{b-196}' width='336' height='150' rx='18' fill='{grad('fundopalco', '#b98bff', '#7b3ff0')}'/>")
A(f"<rect x='{x-168}' y='{b-196}' width='336' height='150' rx='18' fill='url(#dots)'/>")
bandeiras(x-160, b-190, 320, 12)
for side in (-1, 1):
    A(f"<path d='M{x+side*168},{b-196} C{x+side*126},{b-160} {x+side*134},{b-96} {x+side*110},{b-46} L{x+side*168},{b-46} Z' fill='{grad('cort'+str(side), '#ff8cc6', '#e2408f')}'/>")
A(f"<rect x='{x-176}' y='{b-206}' width='352' height='20' rx='10' fill='{grad('sanefa', '#ff8cc6', '#ff5aa5')}'/>")
for (dx, dy, c) in [(-90,-150,'#ffe14d'),(60,-160,'#7fd3ff'),(110,-120,'#b6ff3b'),(-120,-110,'#ff9bd0'),(20,-130,'#fff'),(-40,-170,'#7fd3ff')]:
    A(f"<rect x='{x+dx}' y='{b+dy}' width='7' height='4' rx='1' fill='{c}' transform='rotate({dx%40} {x+dx} {b+dy})'/>")
A(f"<rect x='{x-3}' y='{b-108}' width='6' height='60' rx='3' fill='#4a1fb0'/><circle cx='{x}' cy='{b-114}' r='10' fill='#fff'/><circle cx='{x-3}' cy='{b-117}' r='3' fill='#d9d0ff'/>")
madeira(x-196, b-48, 392, 50)
for i in range(9):
    A(f"<circle cx='{x-160+i*40}' cy='{b-20}' r='5' fill='#fff7b8'/><circle cx='{x-160+i*40}' cy='{b-20}' r='10' fill='#fff7b8' opacity='.25'/>")
A(f"<circle cx='{x}' cy='{b-228}' r='46' fill='#ffe98a' opacity='.45' filter='url(#glow)'/>")
A(f"<path d='M{x},{b-270} L{x+16},{b-234} L{x+54},{b-230} L{x+25},{b-204} L{x+34},{b-166} L{x},{b-186} L{x-34},{b-166} L{x-25},{b-204} L{x-54},{b-230} L{x-16},{b-234} Z' fill='{grad('estrela', '#fff3a0', '#ffc21a')}'/>")
A(f"<path d='M{x-10},{b-244} L{x-24},{b-230}' stroke='#fff' stroke-width='5' stroke-linecap='round' opacity='.8'/>")
brilhos([(x-70, b-250, 8), (x+76, b-240, 7)], '#fff7b8')
placa(x, b + 40, 'Center⭐Run!', '#8b52ff', '#6630dc', 'hubrun')
# Sora⭐Jump! — ilha flutuante
x, y = 1400, 220
A(f"<path d='M{x-110},{y} Q{x},{y+120} {x+110},{y} Z' fill='#b98552'/>")
A(f"<path d='M{x-110},{y} Q{x},{y+100} {x+110},{y} Z' fill='#d6a06a'/>")
A(f"<ellipse cx='{x}' cy='{y}' rx='112' ry='30' fill='#bff2c6' stroke='#6cc79a' stroke-width='4'/>")
arvore(x - 50, y + 4, .6); arvore(x + 56, y + 2, .5, '#ffb3d6', '#ffd6ea')
A(f"<rect x='{x-2}' y='{y-70}' width='5' height='70' fill='#8d6ad8'/><path d='M{x+3},{y-70} l40,12 l-40,12 z' fill='#72c6ff' stroke='#4a78ef' stroke-width='3'/>")
for i, (cx2, cy2, s) in enumerate([(1300, 410, .36), (1350, 350, .32), (1390, 292, .3)]):
    cloud(cx2, cy2, s)
placa(x, y - 104, 'Sora⭐Jump!', '#72c6ff', '#4a78ef', 'tw-hubgame-sora')

# ---------- vegetação e detalhes ----------
for (tx, ty, s) in [(640,330,.8),(980,330,.9),(1010,450,.7)]:
    arvore(tx, ty, s)
for (tx, ty, s) in [(690,470,.7),(920,470,.7),(640,770,.7)]:
    sakura(tx, ty, s)
for i in range(46):
    fx, fy = random.uniform(240, 1380), random.uniform(360, 880)
    if any(abs(fx - dx) < 90 and abs(fy - dy) < 80 for dx, dy in destinos.values()) or abs(fx - 800) < 150 and abs(fy - 610) < 80:
        continue
    flor(fx, fy, random.choice(['#ff8fc4', '#fff', '#ffd36b', '#b98bff', '#7fd3ff']))


A('</g>')
for (bx, by, bs) in [(205,742,.8),(232,600,.8),(1415,600,.85),(1350,820,.8),(640,880,.7),(560,560,.6),(1060,340,.7)]:
    A(f"<ellipse cx='{bx}' cy='{by+4}' rx='{30*bs:.0f}' ry='{8*bs:.0f}' fill='#3c8f63' opacity='.18'/>")
    for (dx, dy, r) in [(-14,-6,16),(12,-8,17),(0,-18,18)]:
        A(f"<circle cx='{bx+dx*bs:.0f}' cy='{by+dy*bs:.0f}' r='{r*bs:.0f}' fill='{grad('arb'+str(bx), '#8fe3a6', '#5cc184')}'/>")
    A(f"<circle cx='{bx-6*bs:.0f}' cy='{by-24*bs:.0f}' r='{6*bs:.0f}' fill='#c9f7d4'/>")
    for k in range(3):
        A(f"<circle cx='{bx+(-14+k*14)*bs:.0f}' cy='{by-(4+k%2*10)*bs:.0f}' r='{3.2*bs:.1f}' fill='{['#ff8fc4','#fff','#ffd36b'][k]}'/>")
# laguinho com cachoeira caindo pela beira da ilha (canto de baixo à esquerda) e vitórias-régias
lx, ly = 300, 828
A(f"<path d='M{lx-34},{ly+14} C{lx-40},{ly+40} {lx-36},{ly+70} {lx-30},{ly+104} L{lx-6},{ly+104} C{lx-10},{ly+70} {lx-8},{ly+40} {lx-4},{ly+16} Z' fill='{grad('cachoeira', '#bdf0ff', '#6cc6f5')}'/>")
for k in range(3):
    A(f"<path d='M{lx-28+k*8},{ly+24} q-2,30 2,70' stroke='#fff' stroke-width='3' opacity='.6' fill='none' stroke-linecap='round'/>")
A(f"<ellipse cx='{lx-18}' cy='{ly+104}' rx='26' ry='8' fill='#fff' opacity='.7'/>")
A(f"<ellipse cx='{lx}' cy='{ly+4}' rx='66' ry='27' fill='#7fd0a0'/>")
A(f"<ellipse cx='{lx}' cy='{ly}' rx='60' ry='23' fill='{grad('lago', '#a9ecff', '#5fb9f0')}'/>")
A(f"<ellipse cx='{lx-18}' cy='{ly-7}' rx='18' ry='5' fill='#fff' opacity='.6'/>")
for (vx, vy) in [(lx+22, ly+4), (lx-8, ly+8)]:
    A(f"<path d='M{vx},{vy} m-9,0 a9,5 0 1 0 18,0 a9,5 0 1 0 -18,0 M{vx},{vy} l9,-2' fill='#6fd18f'/><circle cx='{vx+2}' cy='{vy-3}' r='3' fill='#ff9bd0'/>")

# você está aqui
x, y = 905, 765
A(f"<ellipse cx='{x}' cy='{y+3}' rx='14' ry='5' fill='#3c8f63' opacity='.3'/>")
A(f"<path d='M{x},{y} C{x-6},{y-14} {x-20},{y-24} {x-20},{y-38} a20,20 0 0 1 40,0 C{x+20},{y-24} {x+6},{y-14} {x},{y}Z' fill='#ff5aa5' stroke='#fff' stroke-width='4'/>")
A(f"<circle cx='{x}' cy='{y-38}' r='9' fill='#fff'/>")
placa(800, 610 - 100, 'Encontro do dia', '#ffb56b', '#ff5aa5', 'hubenc')

# ---------- título ----------
A(f"<g transform='translate(40,34)'><rect width='360' height='66' rx='33' fill='#fff' opacity='.9' stroke='#b98bff' stroke-width='4'/>"
  f"<text x='180' y='44' text-anchor='middle' font-family='Mochiy Pop One' font-size='28' fill='#7b3ff0' stroke='#fff' stroke-width='6' paint-order='stroke'>TsuLiPa<tspan fill='#ffc21a'>★</tspan>World</text></g>")
A(f"<g transform='translate(70,104)'><rect width='170' height='30' rx='15' fill='#ff5aa5'/><text x='85' y='21' text-anchor='middle' font-family='Mochiy Pop One' font-size='14' fill='#fff'>Mapa da cidade</text></g>")

svg = f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {W} {H}' width='{W}' height='{H}'><defs>{''.join(defs)}</defs>{''.join(out)}</svg>"
open('mapa.svg', 'w').write(svg)
css = open('../../kt-fonts.css').read()
fonte_mochiy = '' if 'Mochiy' in css else ''
html = f"<!doctype html><html><head><meta charset='utf-8'><link rel='stylesheet' href='../../kt-fonts.css'><style>html,body{{margin:0}}</style></head><body>{svg}</body></html>"
open('mapa.html', 'w').write(html)
print('ok', 'Mochiy' in css)
