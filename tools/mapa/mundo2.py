from lib import G, bloco, novo, salvar
import random, math
random.seed(11)
novo(); A = G['out'].append; grad = G['grad']; ic = G['ic']
G['placa'] = lambda *a, **k: None          # sem as 13 plaquinhas: só o nome do bairro
W, H = 1600, 1000
A(f"<rect width='{W}' height='{H}' fill='{grad('ceu', '#bfe3ff', '#fbe7ff')}'/>")
for i in range(60):
    A(f"<circle cx='{random.uniform(0,W):.0f}' cy='{random.uniform(0,H):.0f}' r='{random.choice([2,2.5,3])}' fill='#fff' opacity='{random.uniform(.35,.7):.2f}'/>")
for (cx, cy, s, o) in [(180, 150, .9, 1), (520, 100, .6, .9), (980, 130, .7, .9), (90, 930, .6, .8), (1520, 960, .7, .8)]:
    G['cloud'](cx, cy, s, o)
for (x, y, s) in [(90, 120, 14), (330, 70, 10), (1040, 70, 9), (1530, 430, 12), (70, 520, 9), (1550, 720, 10)]:
    G['sparkle'](x, y, s)

# ---------- ilha (a mesma do mapa original) ----------
ilha = "M150,600 C140,430 330,300 560,285 C700,262 900,262 1060,282 C1290,300 1470,410 1460,600 C1452,780 1260,905 1000,925 C860,940 720,940 590,925 C340,905 160,790 150,600 Z"
A(f"<path d='{ilha}' transform='translate(0,58)' fill='#a8723f'/>")
A(f"<path d='{ilha}' transform='translate(0,44)' fill='{grad('terra', '#d9a26a', '#b98552')}'/>")
A(f"<path d='{ilha}' transform='translate(0,26)' fill='#e3b27c'/>")
for i in range(22):
    t = (i + .5) / 22 * math.pi
    x = 805 + 640 * math.cos(t); y = 640 + 292 * math.sin(t)
    if y > 690:
        A(f"<path d='M{x-18:.0f},{y+40:.0f} q18,-5 36,0' stroke='#c98d55' stroke-width='4' fill='none' stroke-linecap='round' opacity='.7'/>")
A(f"<path d='{ilha}' fill='{grad('grama', '#c4f4cb', '#92ddb0')}'/>")
A(f"<path d='{ilha}' fill='none' stroke='#dcfbe2' stroke-width='7' opacity='.9'/>")
A(f"<path d='{ilha}' fill='url(#dots)'/>")

# ---------- chão de cada bairro (piso próprio, dá a ideia de "região") ----------
def piso(cx, cy, rx, ry, c1, c2, borda):
    A(f"<ellipse cx='{cx}' cy='{cy+7}' rx='{rx}' ry='{ry}' fill='{borda}'/>")
    A(f"<ellipse cx='{cx}' cy='{cy}' rx='{rx}' ry='{ry}' fill='{grad('piso'+str(cx), c1, c2)}'/>")
    A(f"<ellipse cx='{cx}' cy='{cy}' rx='{rx-14}' ry='{ry-9}' fill='none' stroke='#ffffff' stroke-width='3' stroke-dasharray='2 12' stroke-linecap='round' opacity='.8'/>")
piso(800, 425, 290, 70, '#efe4ff', '#dccaff', '#c3a9f5')     # Palco
piso(1235, 690, 215, 62, '#ffe6f3', '#ffd0e8', '#f2abd0')    # Harajuku
piso(375, 690, 185, 58, '#fff1df', '#ffe1bf', '#efc28e')     # Bairro Fofo

# ---------- caminhos de pedrinha (praça → bairros) ----------
PRACA = (800, 640)
def caminho(a, b, curva):
    (x1, y1), (x2, y2) = a, b
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2; dx, dy = x2 - x1, y2 - y1
    cx, cy = mx - dy * curva, my + dx * curva
    d = f"M{x1},{y1} Q{cx:.0f},{cy:.0f} {x2},{y2}"
    A(f"<path d='{d}' stroke='#e2c597' stroke-width='42' fill='none' stroke-linecap='round'/>")
    A(f"<path d='{d}' stroke='#fff1d8' stroke-width='34' fill='none' stroke-linecap='round'/>")
    for (qx, qy) in G['qpts'](a, b, curva)[2:-1]:
        for off in (-9, 8):
            A(f"<ellipse cx='{qx+random.uniform(-3,3)+off*.3:.0f}' cy='{qy+random.uniform(-3,3)+off*.5:.0f}' rx='{random.uniform(5,7):.1f}' ry='{random.uniform(3.2,4.2):.1f}' fill='#f2dcb2'/>")
for alvo, c in [((800, 470), 0), ((1100, 690), -.06), ((520, 690), .06), ((1040, 820), .1)]:
    caminho(PRACA, alvo, c)

# ---------- 🎤 Distrito do Palco: Handshake · Center · Karaoke ----------
def bl(cab, x, b, s):
    A(f"<g transform='translate({x},{b}) scale({s})'>"); bloco(cab, 0, 0); A('</g>')
bl('# Handshake⭐Event!', 575, 455, .72)
bl('# Karaoke⭐Time!', 1035, 455, .72)
bl('# Center⭐Run!', 800, 440, .8)

# ---------- 🛍️ Rua Harajuku: Café · Gacha · Shop ----------
bl('# Happy⭐Cafe!', 1100, 700, .62)
bl('# Star⭐Gacha!', 1240, 712, .62)
bl('# Zipper⭐Shop!', 1375, 700, .62)

# ---------- 🏡 Vila das Tulipas: casa · pet · Bloom⭐Garden! ----------
bl('# Backstage⭐Pet!', 275, 700, .66)
bl('# Minha casa (Meu Perfil)', 430, 705, .7)
# horta cercadinha do Bloom⭐Garden! (jogo existe; pede login para plantar)
gx, gy = 560, 820
A(f"<ellipse cx='{gx}' cy='{gy+8}' rx='78' ry='22' fill='#5a3a7a' opacity='.14'/><ellipse cx='{gx}' cy='{gy}' rx='74' ry='24' fill='#c98d55'/><ellipse cx='{gx}' cy='{gy-3}' rx='66' ry='19' fill='#a8723f'/>")
for k in range(5):
    sx = gx - 44 + k * 22
    A(f"<path d='M{sx},{gy-2} q-7,-12 -1,-18 M{sx},{gy-2} q7,-12 1,-18' stroke='#6fd18f' stroke-width='4' fill='none' stroke-linecap='round'/>")
for k in range(13):
    t = k / 12 * math.pi
    fx = gx - 82 * math.cos(t); fy = gy + 26 * math.sin(t)
    A(f"<rect x='{fx-3:.0f}' y='{fy-14:.0f}' width='6' height='16' rx='3' fill='#fff7ea'/>")
A(f"<g transform='translate({gx+70},{gy-40})'><rect x='-3' y='0' width='6' height='40' rx='3' fill='#b97a45'/><rect x='-40' y='-22' width='80' height='26' rx='8' fill='#fff' /><text x='0' y='-4' text-anchor='middle' font-family='Mochiy Pop One' font-size='12' fill='#f08a52'>Jardim</text></g>")

# ---------- ⛲ Praça Central: fonte (Encontro), banca (News), correio (Pedido de fã) ----------
px, py = PRACA
A(f"<ellipse cx='{px}' cy='{py+6}' rx='132' ry='68' fill='#e9c98f'/><ellipse cx='{px}' cy='{py}' rx='128' ry='64' fill='#fff2d4'/>")
for r in (100, 76):
    A(f"<ellipse cx='{px}' cy='{py}' rx='{r}' ry='{r*.52:.0f}' fill='none' stroke='#f3dcae' stroke-width='3'/>")
A(f"<ellipse cx='{px}' cy='{py+4}' rx='58' ry='28' fill='#c9a7ff'/><ellipse cx='{px}' cy='{py}' rx='54' ry='25' fill='{grad('agua', '#9fe6ff', '#58b8f5')}'/><ellipse cx='{px-16}' cy='{py-6}' rx='15' ry='5' fill='#fff' opacity='.7'/>")
A(f"<rect x='{px-7}' y='{py-40}' width='14' height='40' rx='6' fill='#b98bff'/>")
A(f"<path d='M{px},{py-42} C{px-30},{py-70} {px-40},{py-30} {px-34},{py-8} M{px},{py-42} C{px+30},{py-70} {px+40},{py-30} {px+34},{py-8}' stroke='#7fd3ff' stroke-width='6' fill='none' stroke-linecap='round'/>")
A(f"<circle cx='{px}' cy='{py-46}' r='10' fill='{grad('fonte', '#fff3a0', '#ffc21a')}'/><circle cx='{px-3}' cy='{py-49}' r='3' fill='#fff'/>")
bl('# Idol⭐News!', 965, 640, .7)
bl('# Pedido de fã', 655, 655, .8)

# ---------- 🏟️ Arena: Idol⭐Battle! em treino, sem prêmio até ativar servidor ----------
ax, ay = 1040, 830
A(f"<ellipse cx='{ax}' cy='{ay+8}' rx='100' ry='30' fill='#5a3a7a' opacity='.16'/><ellipse cx='{ax}' cy='{ay}' rx='94' ry='30' fill='{grad('arenab', '#8b52ff', '#6630dc')}'/><ellipse cx='{ax}' cy='{ay-6}' rx='80' ry='22' fill='{grad('arena', '#ffe08a', '#ffad4d')}'/>")
A(f"<ellipse cx='{ax}' cy='{ay-6}' rx='54' ry='13' fill='none' stroke='#fff' stroke-width='3' opacity='.7'/>")
for dx in (-86, 86):
    A(f"<rect x='{ax+dx-4}' y='{ay-66}' width='8' height='62' rx='3' fill='#b97a45'/><path d='M{ax+dx+4},{ay-66} l20,8 l-20,8 z' fill='#ff6fb5'/>")
G['bandeiras'](ax - 86, ay - 60, 172, 9)

# ---------- ☁️ Céu: uma só ilha no alto (Sora + Moon⭐Duo!) ----------
sx, sy = 1330, 230
A(f"<path d='M{sx-150},{sy} Q{sx},{sy+140} {sx+150},{sy} Z' fill='#b98552'/><path d='M{sx-150},{sy} Q{sx},{sy+116} {sx+150},{sy} Z' fill='#d6a06a'/>")
A(f"<ellipse cx='{sx}' cy='{sy}' rx='152' ry='36' fill='#bff2c6'/><ellipse cx='{sx}' cy='{sy-3}' rx='140' ry='28' fill='{grad('ceuilha', '#d7fadb', '#a9e8bd')}'/>")
A(f"<g transform='translate({sx-48},{sy+2}) scale(.5)'>"); bloco('# Moon⭐Duo!', 0, 0); A('</g>')
A(f"<rect x='{sx+70}' y='{sy-72}' width='5' height='72' fill='#8d6ad8'/><path d='M{sx+75},{sy-72} l40,12 l-40,12 z' fill='#72c6ff'/>")
G['arvore'](sx + 118, sy + 2, .45)
for (cx2, cy2, s) in [(1290, 420, .34), (1310, 360, .3), (1320, 305, .28)]:
    G['cloud'](cx2, cy2, s)

# ---------- verde: bosquezinhos nas bordas, flores no gramado ----------
for (tx, ty, s) in [(250, 520, .85), (290, 500, .65), (1150, 360, .7), (450, 360, .7), (330, 420, .6), (370, 400, .8), (1420, 560, .7), (690, 880, .7), (860, 890, .6), (1240, 830, .7)]:
    G['arvore'](tx, ty, s)
for (tx, ty, s) in [(520, 370, .65), (1090, 370, .6), (650, 545, .55), (950, 545, .55)]:
    G['sakura'](tx, ty, s)
for i in range(60):
    fx, fy = random.uniform(230, 1390), random.uniform(380, 900)
    longe = all(math.hypot((fx - a) / rx, (fy - b) / ry) > 1.15 for (a, b, rx, ry) in
                [(800, 425, 300, 90), (1235, 690, 230, 90), (375, 690, 200, 90), (800, 640, 150, 80), (1040, 820, 110, 50), (560, 810, 90, 40), (630, 770, 60, 30), (800, 560, 30, 90)])
    if longe:
        G['flor'](fx, fy, random.choice(['#ff8fc4', '#fff', '#ffd36b', '#b98bff', '#7fd3ff']))
# laguinho com cachoeira (canto de baixo à esquerda)
lx, ly = 300, 856
A(f"<path d='M{lx-34},{ly+14} C{lx-40},{ly+40} {lx-36},{ly+70} {lx-30},{ly+104} L{lx-6},{ly+104} C{lx-10},{ly+70} {lx-8},{ly+40} {lx-4},{ly+16} Z' fill='{grad('cachoeira', '#bdf0ff', '#6cc6f5')}'/>")
A(f"<ellipse cx='{lx}' cy='{ly+4}' rx='62' ry='25' fill='#7fd0a0'/><ellipse cx='{lx}' cy='{ly}' rx='56' ry='21' fill='{grad('lago', '#a9ecff', '#5fb9f0')}'/><ellipse cx='{lx-18}' cy='{ly-6}' rx='16' ry='5' fill='#fff' opacity='.6'/>")

# ---------- nomes dos bairros (só 6 plaquinhas, com os ícones do que tem dentro) ----------
def bairro(x, y, nome, c1, c2, icones):
    w = len(nome) * 15 + 54
    gid = 'b' + ''.join(ch for ch in nome if ch.isalnum())[:8]
    A(f"<rect x='{x-w/2:.0f}' y='{y-20+4}' width='{w:.0f}' height='40' rx='20' fill='{c2}' opacity='.5'/>")
    A(f"<rect x='{x-w/2:.0f}' y='{y-20}' width='{w:.0f}' height='40' rx='20' fill='{grad(gid, c1, c2, 1, 0)}' stroke='#fff' stroke-width='3'/>")
    A(f"<text x='{x}' y='{y+7}' text-anchor='middle' font-family='Mochiy Pop One' font-size='19' fill='#fff' stroke='{c2}' stroke-width='4' paint-order='stroke'>{nome}</text>")
    n = len(icones)
    for i, k in enumerate(icones):
        ix = x - (n - 1) * 17 + i * 34
        if k in ('bloom', 'studio', 'battle'):
            em = {'bloom':'🌷', 'studio':'📸', 'battle':'🎤'}[k]
            sinal = f"<text x='{ix}' y='{y+42}' text-anchor='middle' font-size='17' fill='#fff'>{em}</text>"
        else:
            sinal = ic(k, ix, y + 36, 17) if k else ''
        A(f"<circle cx='{ix}' cy='{y+36}' r='14' fill='#fff'/><circle cx='{ix}' cy='{y+36}' r='11.5' fill='{c2}'/>" + sinal)
bairro(800, 498, 'Star Stage', '#8b52ff', '#6630dc', ['hubhandshake', 'hubrun', 'tw-hubgame-karaoke'])
bairro(1238, 758, 'Galeria do Brilho', '#ff8cc6', '#b83a9e', ['hubcafe', 'hubgacha', 'hubloja'])
bairro(360, 752, 'Vila das Tulipas', '#ffb56b', '#f08a52', ['hubpet', 'hubperf', 'bloom'])
bairro(800, 730, 'Praça Central', '#6fb6ff', '#4a78ef', ['hubfa', 'hubenc', 'hubjornal'])
bairro(1040, 885, 'Star Arena', '#ffb35c', '#e0532f', ['battle'])
bairro(1330, 300, 'Jardim das Nuvens', '#72c6ff', '#4a78ef', ['tw-hubgame-sora', 'hubduo', 'studio'])
salvar('mundo2', W, H)
print('ok')
