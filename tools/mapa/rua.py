from lib import G, bloco, novo, salvar
import random, sys
random.seed(5)
# Sem argumento preserva a prova Harajuku; com argumento gera a rua do bairro.
CENAS = {
 'palco': ('🎤 Star Stage', ['# Handshake⭐Event!', '# Center⭐Run!', '# Karaoke⭐Time!'], '#7b3ff0'),
 'harajuku': ('🛍️ Galeria do Brilho', ['# Happy⭐Cafe!', '# Star⭐Gacha!', '# Zipper⭐Shop!'], '#7b3ff0'),
 'fofo': ('🏡 Vila das Tulipas', ['# Backstage⭐Pet!', '# Minha casa (Meu Perfil)', None], '#f08a52'),
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
# ---------- fundo com identidade de cada bairro (céu, horizonte e brilho) ----------
TEMAS = {
 'palco':    ('#2c1766', '#ff9ccf', 'noite'),
 'harajuku': ('#ffd3ec', '#efe2ff', 'galeria'),
 'fofo':     ('#bfe6ff', '#effff0', 'campo'),
 'praca':    ('#c7e6ff', '#fff0dc', 'praca'),
 'arena':    ('#24165a', '#a77bff', 'estadio'),
 'ceu':      ('#9fd3ff', '#ffe9f7', 'nuvens'),
}
c_alto, c_baixo, estilo = TEMAS[bairro]
A(f"<rect width='{W}' height='{H}' fill='{grad('ceu_' + bairro, c_alto, c_baixo)}'/>")
noite = estilo in ('noite', 'estadio')
def estrelinhas(n, y0, y1, cor='#fff', s0=4, s1=10):
    for _ in range(n):
        G['sparkle'](random.uniform(20, W - 20), random.uniform(y0, y1), random.uniform(s0, s1), cor)
def predios_fundo(cores, janela, acesas=False):
    for i, (bx, bw, bh) in enumerate([(40,180,260),(250,140,200),(560,200,240),(900,150,210),(1120,190,250),(1390,170,220)]):
        c = cores[i % len(cores)]
        A(f"<rect x='{bx}' y='{560-bh}' width='{bw}' height='{bh}' rx='14' fill='{c}'/>")
        A(f"<rect x='{bx}' y='{560-bh}' width='{bw}' height='10' rx='5' fill='#ffffff' opacity='.35'/>")
        for r in range(3):
            for k in range(3):
                acesa = acesas and random.random() < .6
                A(f"<rect x='{bx+22+k*(bw-44)/3:.0f}' y='{560-bh+28+r*56}' width='{(bw-44)/3-14:.0f}' height='30' rx='6' fill='{'#ffe9a8' if acesa else janela}' opacity='{.95 if acesa else .55}'/>")
if estilo == 'noite':
    # Star Stage à noite: estrelas, lua de holofotes e prédios com janelas acesas
    estrelinhas(46, 20, 300, '#fff7c8', 2, 7)
    for (hx, ang) in ((140, -22), (560, 18), (1040, -18), (1460, 22)):
        G['holofote'](hx, 0, ang, 520, 150, .13)
    predios_fundo(['#4a2c8f', '#5b3aa8', '#3f2a7a'], '#7b62c9', acesas=True)
    for (x0, x1) in [(0, 560), (520, 1080), (1040, 1600)]:
        G['bandeiras'](x0, 190, x1 - x0, 14)
elif estilo == 'galeria':
    # Galeria do Brilho: fachadas pastel com letreiros neon, corações e muito brilho
    predios_fundo(['#ffd0e8', '#e2d4ff', '#d7efff'], '#ffffff')
    for (nx, ny, cor) in [(62, 330, '#ff6fb5'), (562, 300, '#7fd3ff'), (1046, 285, '#b98bff'), (1538, 320, '#ff6fb5')]:
        A(f"<rect x='{nx-2}' y='{ny+15}' width='4' height='{520-ny}' fill='#c9b6f0'/>")
        A(f"<rect x='{nx-46}' y='{ny-15}' width='92' height='30' rx='15' fill='none' stroke='{cor}' stroke-width='9' opacity='.35' filter='url(#glow)'/>")
        A(f"<rect x='{nx-46}' y='{ny-15}' width='92' height='30' rx='15' fill='#fff' fill-opacity='.65' stroke='{cor}' stroke-width='4'/>")
        A(f"<path d='M{nx},{ny+7} c-14,-10 -10,-20 0,-12 c10,-8 14,2 0,12z' fill='{cor}'/>")
    for (x0, x1) in [(0, 560), (520, 1080), (1040, 1600)]:
        A(f"<path d='M{x0},{150} Q{(x0+x1)/2},{196} {x1},{150}' stroke='#fff' stroke-width='3' fill='none' opacity='.9'/>")
        for k in range(9):
            t = (k + .5) / 9; hx = x0 + (x1 - x0) * t; hy = 150 + 46 * 4 * t * (1 - t) * .5
            A(f"<circle cx='{hx:.0f}' cy='{hy+7:.0f}' r='7' fill='{['#ff6fb5','#ffd36b','#7fd3ff','#b98bff'][k % 4]}'/>")
            A(f"<circle cx='{hx-2:.0f}' cy='{hy+5:.0f}' r='2.4' fill='#fff' opacity='.9'/>")
    estrelinhas(26, 30, 470, '#ffffff', 4, 11)
elif estilo == 'campo':
    # Vila das Tulipas: colinas, campo de tulipas e casinhas ao longe
    G['cloud'](230, 120, .8, .9); G['cloud'](900, 90, .6, .85); G['cloud'](1400, 140, .7, .9)
    A(f"<ellipse cx='260' cy='600' rx='520' ry='230' fill='#b8ecc0'/>")
    A(f"<ellipse cx='1300' cy='610' rx='560' ry='250' fill='#a9e4b6'/>")
    A(f"<ellipse cx='800' cy='640' rx='620' ry='220' fill='#c9f3cf'/>")
    for (cx2, cy2, cor) in [(520, 412, '#ff9bc8'), (1080, 400, '#ffd36b'), (180, 430, '#b98bff')]:
        A(f"<rect x='{cx2-26}' y='{cy2}' width='52' height='38' rx='6' fill='#fff7f0'/><path d='M{cx2-32},{cy2+2} L{cx2},{cy2-24} L{cx2+32},{cy2+2} Z' fill='{cor}'/><rect x='{cx2-7}' y='{cy2+16}' width='14' height='22' rx='5' fill='{cor}'/>")
    for fila, y0 in enumerate((470, 500, 530)):
        for k in range(36):
            fx = 20 + k * 45 + (fila % 2) * 22
            cor = ['#ff6fb5', '#ffd36b', '#b98bff', '#ff8f6b'][(k + fila) % 4]
            A(f"<path d='M{fx},{y0+18} v-12' stroke='#5fbf7e' stroke-width='3'/><path d='M{fx-7},{y0+6} q0,-12 7,-10 q7,-2 7,10 q-7,6 -14,0z' fill='{cor}'/>")
elif estilo == 'praca':
    # Praça Central: árvores ao fundo, prédios baixos e bandeirinhas
    G['cloud'](230, 120, .8, .9); G['cloud'](900, 90, .6, .85); G['cloud'](1400, 140, .7, .9)
    predios_fundo(['#e6dcff', '#ffe0f0', '#dff0ff'], '#ffffff')
    for tx in (60, 190, 470, 640, 960, 1140, 1460, 1570):
        (G['sakura'] if tx % 3 == 0 else G['arvore'])(tx, 548, 1.25)
    for (x0, x1) in [(0, 560), (520, 1080), (1040, 1600)]:
        G['bandeiras'](x0, 170, x1 - x0, 14)
elif estilo == 'estadio':
    # Star Arena: arquibancada com torcida, torres de luz e estrelas no céu da tarde
    estrelinhas(30, 20, 240, '#fff7c8', 2, 6)
    A(f"<path d='M0,560 L0,330 Q800,250 1600,330 L1600,560 Z' fill='#3d2a86'/>")
    for fila in range(5):
        y0 = 350 + fila * 40
        A(f"<path d='M0,{y0} Q800,{y0-70} 1600,{y0}' stroke='#5a43b0' stroke-width='14' fill='none'/>")
        for k in range(60):
            t = k / 59; tx = t * 1600; ty = y0 - 70 * 4 * t * (1 - t) * .5 - 12
            A(f"<circle cx='{tx:.0f}' cy='{ty:.0f}' r='6' fill='{['#ff6fb5','#ffd36b','#7fd3ff','#b6ff3b','#b98bff'][(k*3+fila) % 5]}'/>")
    for lx in (90, 1510):
        A(f"<rect x='{lx-6}' y='150' width='12' height='410' fill='#6c58b8'/><rect x='{lx-40}' y='130' width='80' height='34' rx='8' fill='#fff7c8'/>")
        A(f"<circle cx='{lx}' cy='147' r='60' fill='#fff7c8' opacity='.35' filter='url(#glow)'/>")
    for (hx, ang) in ((90, 30), (1510, -30)):
        G['holofote'](hx, 150, ang, 460, 180, .12)
else:
    # Jardim das Nuvens: só céu, arco-íris e nuvens grandes (sem prédios)
    for k, cor in enumerate(['#ff9bc8', '#ffd36b', '#b6ff3b', '#7fd3ff', '#b98bff']):
        r = 640 - k * 22
        A(f"<path d='M{800-r},620 A{r},{r*.62:.0f} 0 0 1 {800+r},620' stroke='{cor}' stroke-width='22' fill='none' opacity='.45'/>")
    for (cx2, cy2, sc) in [(150, 150, .9), (520, 90, .7), (900, 170, 1.0), (1250, 100, .8), (1500, 210, .7), (330, 330, .6), (1150, 330, .55)]:
        G['cloud'](cx2, cy2, sc, .95)
    estrelinhas(18, 30, 420, '#ffffff', 4, 10)
    for (bx, by, sc) in [(80, 545, 1.5), (560, 560, 1.3), (1060, 560, 1.4), (1560, 545, 1.5)]:
        G['cloud'](bx, by, sc, 1)
# calçada (piso de ladrilhos) e rua de pedrinha
A(f"<rect x='0' y='560' width='{W}' height='90' fill='#fff1d8'/>")
for i in range(0, W, 64):
    A(f"<path d='M{i},560 v90' stroke='#f0dcb4' stroke-width='3'/>")
A(f"<rect x='0' y='560' width='{W}' height='8' fill='#ffffff' opacity='.7'/>")
A(f"<rect x='0' y='650' width='{W}' height='{H-650}' fill='#efe3cf'/>")
for i in range(140):
    A(f"<ellipse cx='{random.uniform(0,W):.0f}' cy='{random.uniform(665,H-8):.0f}' rx='{random.uniform(8,13):.0f}' ry='{random.uniform(4,6):.0f}' fill='#f8eedd'/>")
A(f"<rect x='0' y='648' width='{W}' height='6' fill='#e2c597'/>")
# três locais de cada rua, grandes e com espaço
def predio(cab, cx):
    A(f"<g transform='translate({cx},566) scale(2.05)'>"); bloco(cab, 0, 0); A('</g>')
def sora_ilha(cx):
    # Sora⭐Jump!: degraus de nuvem subindo até uma estrela, com trampolim na nuvem de baixo
    A(f"<g transform='translate({cx},566) scale(1.7)'>")
    A("<ellipse cx='0' cy='-2' rx='80' ry='9' fill='#5a3a7a' opacity='.12'/>")
    def nuvem_degrau(x, y, w):
        A(f"<ellipse cx='{x}' cy='{y+7}' rx='{w}' ry='9' fill='#9bc3ec' opacity='.35'/>")
        A(f"<path d='M{x-w},{y+4} C{x-w-10},{y-6} {x-w+6},{y-20} {x-w*.55:.1f},{y-16} C{x-w*.45:.1f},{y-32} {x-w*.05:.1f},{y-34} {x+w*.12:.1f},{y-22} C{x+w*.35:.1f},{y-34} {x+w*.8:.1f},{y-26} {x+w*.75:.1f},{y-12} C{x+w+8},{y-12} {x+w+6},{y+6} {x+w-6},{y+6} Z' fill='#fff5fc' stroke='#ffd0e6' stroke-width='2.5'/>")
        A(f"<path d='M{x-w*.6:.1f},{y-12} q{w*.2:.1f},-12 {w*.45:.1f},-6' stroke='#eaf4ff' stroke-width='4' fill='none' stroke-linecap='round'/>")
    nuvem_degrau(0, -4, 82)
    # trampolim rosa na nuvem de baixo
    A("<rect x='-46' y='-30' width='44' height='8' rx='4' fill='#ff6fb5'/><path d='M-40,-22 l-4,14 M-8,-22 l4,14' stroke='#b98bff' stroke-width='4' stroke-linecap='round'/>")
    A("<path d='M-42,-30 q18,-10 36,0' stroke='#ffd0e6' stroke-width='3' fill='none'/>")
    nuvem_degrau(40, -58, 40)
    nuvem_degrau(-18, -104, 34)
    nuvem_degrau(36, -150, 30)
    # estrela no topo, com brilho
    A("<circle cx='36' cy='-190' r='26' fill='#fff3a8' opacity='.45' filter='url(#glow)'/>")
    A("<path d='M36,-210 l6.5,13 14.5,2 -10.5,10 2.5,14.5 -13,-7 -13,7 2.5,-14.5 -10.5,-10 14.5,-2 z' fill='#ffd84a' stroke='#f5b400' stroke-width='2' stroke-linejoin='round'/>")
    for (gx, gy, gs) in ((-40, -140, 5), (70, -110, 4), (-60, -70, 4), (10, -175, 3)):
        G['sparkle'](gx, gy, gs, '#ffffff')
    G['placa'](0, -232, 'Sora⭐Jump!', '#72c6ff', '#4a78ef', 'tw-hubgame-sora')
    A('</g>')
for indice, (cab, cx) in enumerate(zip(lugares, (300, 800, 1300))):
    if cab and 'Sora' in cab:
        sora_ilha(cx)
    elif cab:
        predio(cab, cx)
    elif bairro == 'praca' and indice == 1:
        # Fonte do Encontro do dia
        A(f"<g transform='translate({cx},565) scale(1.6) translate({-cx},-565)'>")
        A(f"<ellipse cx='{cx}' cy='565' rx='110' ry='27' fill='#c9a7ff'/>")
        A(f"<ellipse cx='{cx}' cy='559' rx='98' ry='22' fill='{grad('fonterua', '#a9ecff', '#58b8f5')}'/>")
        A(f"<rect x='{cx-8}' y='475' width='16' height='80' rx='8' fill='#b98bff'/>")
        A(f"<path d='M{cx},483 q-60,-52 -66,65 M{cx},483 q60,-52 66,65' stroke='#7fd3ff' stroke-width='8' fill='none' stroke-linecap='round' opacity='.85'/>")
        A(f"<ellipse cx='{cx-66}' cy='548' rx='14' ry='4' fill='#fff' opacity='.7'/><ellipse cx='{cx+66}' cy='548' rx='14' ry='4' fill='#fff' opacity='.7'/>")
        A(f"<circle cx='{cx}' cy='482' r='13' fill='#ffe08a'/>")
        for (gx, gy) in ((cx-60, 520), (cx+58, 515), (cx-20, 500), (cx+24, 530)):
            G['sparkle'](gx, gy, 5, '#ffffff')
        A('</g>')
    elif bairro == 'arena' and indice == 1:
        # Arena de Idol⭐Battle!: a cena é clicável pelo mapa; treino até ativação oficial do servidor.
        A(f"<g data-reserva='idol-battle' transform='translate({cx},560) scale(1.3) translate({-cx},-560)'><title>Idol⭐Battle! — Entrar na Arena</title>")
        A(f"<ellipse cx='{cx}' cy='560' rx='203' ry='54' fill='#7951bc' opacity='.19'/>")
        A(f"<path d='M{cx-170},558 L{cx-150},378 Q{cx},298 {cx+150},378 L{cx+170},558 Z' fill='{grad('arenarua','#a37bff','#7b3ff0')}'/>")
        A(f"<path d='M{cx-128},550 L{cx-108},420 Q{cx},365 {cx+108},420 L{cx+128},550 Z' fill='#ffe0f0'/>")
        A(f"<ellipse cx='{cx}' cy='552' rx='131' ry='27' fill='#ffb56b'/>")
        A(f"<rect x='{cx-140}' y='328' width='280' height='44' rx='22' fill='#fff9ff' stroke='#d3b3ff' stroke-width='3'/>")
        A(f"<text x='{cx}' y='357' font-family='Mochiy Pop One' font-size='20' fill='#7b3ff0' text-anchor='middle'>Idol★Battle!</text>")
        A(f"<text x='{cx}' y='479' font-family='Mochiy Pop One' font-size='19' fill='#7b3ff0' text-anchor='middle'>Entrar</text>")
        A("</g>")
    elif (bairro == 'fofo' and indice == 2) or (bairro == 'ceu' and indice == 2):
        # Entradas do Bloom e Photo Studio: a navegação é feita pelo Canvas.
        flor = bairro == 'fofo'
        identificador = 'bloom-garden' if flor else 'photo-studio'
        legenda = 'Bloom★Garden!' if flor else 'Photo★Studio!'
        cor = '#68bc88' if flor else '#7b3ff0'
        escala = '' if flor else f" transform='translate({cx},558) scale(1.28) translate({-cx},-558)'"
        A(f"<g data-reserva='{identificador}'{escala}><title>{legenda} — Entrar</title>")
        A(f"<ellipse cx='{cx}' cy='565' rx='166' ry='20' fill='#553280' opacity='.12'/>")
        A(f"<rect x='{cx-165}' y='410' width='330' height='145' rx='24' fill='#fff7f0' stroke='#fff' stroke-width='4'/>")
        A(f"<rect x='{cx-151}' y='421' width='302' height='15' rx='7' fill='{cor}' opacity='.28'/>")
        if flor:
            # Horta com canteiro e brotos, sem implementar cultivo ou recompensas.
            for bx in (cx-92,cx,cx+92):
                A(f"<ellipse cx='{bx}' cy='510' rx='38' ry='17' fill='#bf8e61'/>")
                A(f"<path d='M{bx},508 v-22 m0,8 q-25,-20 -24,-4 q15,12 24,4 m0,-6 q25,-20 24,-4 q-15,12 -24,4' fill='#77d39e' stroke='#61b77e' stroke-width='2'/>")
        else:
            # Photo⭐Studio!: estúdio com câmera no telhado, toldo listrado e varal de polaroids na vitrine
            A(f"<rect x='{cx-150}' y='432' width='300' height='124' rx='16' fill='{grad('studio_parede', '#f3eaff', '#e2d1ff')}'/>")
            G['listras'](cx-158, 426, 316, 22, '#ff9bc8', '#ffffff', 12)
            G['babado'](cx-150, 450, 300, '#ff9bc8', 8)
            # câmera grande no telhado
            A(f"<rect x='{cx-58}' y='352' width='116' height='70' rx='16' fill='{grad('studio_cam', '#b98bff', '#7b3ff0')}'/>")
            A(f"<rect x='{cx-40}' y='340' width='34' height='16' rx='5' fill='#9b78e6'/><circle cx='{cx+36}' cy='366' r='7' fill='#ffe14d'/>")
            A(f"<circle cx='{cx}' cy='387' r='25' fill='#fff' stroke='#e2d1ff' stroke-width='4'/><circle cx='{cx}' cy='387' r='14' fill='#3c2a8f'/><circle cx='{cx-5}' cy='382' r='4' fill='#fff'/>")
            # vitrine com varal de polaroids
            G['vidro'](cx-132, 466, 150, 68, '#e3f4ff')
            A(f"<path d='M{cx-126},476 Q{cx-57},490 {cx+12},476' stroke='#c98d55' stroke-width='2' fill='none'/>")
            for k3, (px3, py3) in enumerate(((cx-112, 482), (cx-80, 488), (cx-48, 489), (cx-16, 484))):
                A(f"<rect x='{px3}' y='{py3}' width='22' height='26' rx='2' fill='#fff' transform='rotate({(-6, 4, -3, 6)[k3]} {px3+11} {py3+13})'/>")
                A(f"<rect x='{px3+3}' y='{py3+3}' width='16' height='14' fill='{('#ffb3d6', '#bfe9ff', '#d7f7c9', '#ffe08a')[k3]}' transform='rotate({(-6, 4, -3, 6)[k3]} {px3+11} {py3+13})'/>")
            # porta com estrela
            A(f"<path d='M{cx+48},556 V500 a28,28 0 0 1 56,0 V556 Z' fill='{grad('studio_porta', '#ff7cbc', '#e2569b')}'/><circle cx='{cx+92}' cy='528' r='3.5' fill='#ffe14d'/>")
            G['sparkle'](cx+76, 486, 7, '#fff')
            G['madeira'](cx-156, 548, 312, 10)
        ly0 = 374 if flor else 288            # no Studio a plaquinha fica acima da câmera
        ex0 = cx if flor else cx + 76           # no Studio o "Entrar" fica na porta
        ew = 174 if flor else 92
        A(f"<rect x='{cx-133}' y='{ly0}' width='266' height='49' rx='23' fill='#fff' stroke='{cor}' stroke-width='3'/>")
        A(f"<text x='{cx}' y='{ly0+32}' text-anchor='middle' font-family='Mochiy Pop One' font-size='19' fill='{cor}'>{legenda}</text>")
        A(f"<rect x='{ex0-ew/2:.0f}' y='{531 if flor else 506}' width='{ew}' height='27' rx='13' fill='#ff6fb5' stroke='#fff' stroke-width='{0 if flor else 3}'/>")
        A(f"<text x='{ex0}' y='{550 if flor else 525}' text-anchor='middle' font-family='Mochiy Pop One' font-size='14' fill='#fff'>Entrar</text>")
        A("</g>")

# enfeites de cada bairro nos vãos entre os lugares (x ≈ 550 e 1050) e nas pontas
def banco(bx):
    A(f"<ellipse cx='{bx}' cy='606' rx='48' ry='6' fill='#5a3a7a' opacity='.14'/>")
    A(f"<rect x='{bx-44}' y='578' width='88' height='10' rx='5' fill='{grad('banco', '#ffb3d6', '#f58fc0')}'/>")
    A(f"<rect x='{bx-44}' y='592' width='88' height='8' rx='4' fill='#e989bb'/>")
    A(f"<rect x='{bx-36}' y='598' width='6' height='10' rx='2' fill='#9b78e6'/><rect x='{bx+30}' y='598' width='6' height='10' rx='2' fill='#9b78e6'/>")
def canteiro(fx):
    A(f"<rect x='{fx-40}' y='590' width='80' height='18' rx='9' fill='#c98d55'/>")
    for k in range(5):
        G['flor'](fx - 30 + k * 15, 584 - (k % 2) * 6, ['#ff6fb5', '#ffd36b', '#b98bff', '#7fd3ff', '#ff8f6b'][k])
if bairro == 'praca':
    for bx in (470, 1130): banco(bx)
    for fx in (640, 960): canteiro(fx)
elif bairro == 'fofo':
    for fx in (470, 640, 960, 1130): canteiro(fx)
elif bairro == 'harajuku':
    for bx in (470, 1130): banco(bx)
elif bairro == 'arena':
    for cx in (300, 1300):
        # pódio com troféu nas laterais da arena
        A(f"<g transform='translate({cx},560) scale(1.7) translate({-cx},-560)'>")
        A(f"<rect x='{cx-60}' y='520' width='120' height='40' rx='8' fill='{grad('podio', '#ffe08a', '#f5b400')}'/><rect x='{cx-60}' y='520' width='120' height='8' rx='4' fill='#fff3c4'/>")
        A(f"<path d='M{cx-22},470 h44 v14 q0,24 -22,26 q-22,-2 -22,-26z' fill='#ffd84a'/><rect x='{cx-6}' y='508' width='12' height='12' fill='#e8a400'/><rect x='{cx-16}' y='512' width='32' height='8' rx='3' fill='#ffd84a'/>")
        A(f"<circle cx='{cx}' cy='482' r='34' fill='#fff7c8' opacity='.35' filter='url(#glow)'/>")
        G['sparkle'](cx + 30, 462, 8, '#fff'); G['sparkle'](cx - 32, 488, 6, '#fff')
        A('</g>')
# postes com halo (mais forte à noite)
for px in (550, 1050):
    G['poste'](px, 600)
    if noite or bairro == 'harajuku':
        A(f"<circle cx='{px}' cy='536' r='46' fill='#fff7b8' opacity='.38' filter='url(#glow)'/>")
for vx in (40, 1560):
    A(f"<rect x='{vx-16}' y='{580}' width='32' height='26' rx='6' fill='#ff9bd0'/>")
    G['arvore'](vx, 584, .7)
# topo: título do bairro e volta para o mapa
titulo_largura = max(280, min(450, len(titulo) * 15 + 55))
A(f"<g transform='translate(30,26)'><rect width='{titulo_largura}' height='56' rx='28' fill='#fff' opacity='.92'/><text x='{titulo_largura/2:.0f}' y='37' text-anchor='middle' font-family='Mochiy Pop One' font-size='{21 if bairro == 'palco' else 24}' fill='{cor_tema}'>{titulo}</text></g>")
# o botão ◀ Mapa é HTML (tw-mapa.js): acessível, traduzido e fora da arte
salvar('rua' if len(sys.argv) == 1 else 'rua_' + bairro, W, H)
print('ok')
