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
# três locais de cada rua, grandes e com espaço
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
        # Arena de Idol⭐Battle!: a cena é clicável pelo mapa; treino até ativação oficial do servidor.
        A("<g data-reserva='idol-battle'><title>Idol⭐Battle! — Entrar na Arena</title>")
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
        A(f"<g data-reserva='{identificador}'><title>{legenda} — Entrar</title>")
        A(f"<ellipse cx='{cx}' cy='565' rx='166' ry='20' fill='#553280' opacity='.12'/>")
        A(f"<rect x='{cx-165}' y='410' width='330' height='145' rx='24' fill='#fff7f0' stroke='#fff' stroke-width='4'/>")
        A(f"<rect x='{cx-151}' y='421' width='302' height='15' rx='7' fill='{cor}' opacity='.28'/>")
        if flor:
            # Horta com canteiro e brotos, sem implementar cultivo ou recompensas.
            for bx in (cx-92,cx,cx+92):
                A(f"<ellipse cx='{bx}' cy='510' rx='38' ry='17' fill='#bf8e61'/>")
                A(f"<path d='M{bx},508 v-22 m0,8 q-25,-20 -24,-4 q15,12 24,4 m0,-6 q25,-20 24,-4 q-15,12 -24,4' fill='#77d39e' stroke='#61b77e' stroke-width='2'/>")
        else:
            # Moldura fotográfica e visor: símbolo original, sem usar personagem.
            A(f"<rect x='{cx-58}' y='453' width='116' height='71' rx='12' fill='#e8dcff' stroke='#b998ff' stroke-width='4'/>")
            A(f"<circle cx='{cx}' cy='489' r='24' fill='#fff' stroke='#b998ff' stroke-width='4'/>")
            A(f"<circle cx='{cx}' cy='489' r='11' fill='#ff6fb5'/>")
            A(f"<circle cx='{cx+37}' cy='465' r='5' fill='#fff'/>")
        A(f"<rect x='{cx-133}' y='374' width='266' height='49' rx='23' fill='#fff' stroke='{cor}' stroke-width='3'/>")
        A(f"<text x='{cx}' y='406' text-anchor='middle' font-family='Mochiy Pop One' font-size='19' fill='{cor}'>{legenda}</text>")
        A(f"<rect x='{cx-87}' y='531' width='174' height='27' rx='13' fill='#ff6fb5'/>")
        A(f"<text x='{cx}' y='550' text-anchor='middle' font-family='Mochiy Pop One' font-size='14' fill='#fff'>Entrar</text>")
        A("</g>")
    elif bairro == 'arena':
        # Laterais da arena são decorativas, sem slots extras inventados.
        A(f"<rect x='{cx-8}' y='425' width='16' height='128' rx='5' fill='#b98552'/>")
        A(f"<path d='M{cx+8},432 l65,18 l-65,18 z' fill='#ff6fb5'/>")
        A(f"<circle cx='{cx}' cy='415' r='13' fill='#ffe3a4'/>")
# vasos com arvorezinhas e postes entre os prédios
for px in (550, 1050):
    G['poste'](px, 600)
for vx in (40, 1560):
    A(f"<rect x='{vx-16}' y='{580}' width='32' height='26' rx='6' fill='#ff9bd0'/>")
    G['arvore'](vx, 584, .7)
# topo: título do bairro e volta para o mapa
titulo_largura = max(280, min(450, len(titulo) * 15 + 55))
A(f"<g transform='translate(30,26)'><rect width='{titulo_largura}' height='56' rx='28' fill='#fff' opacity='.92'/><text x='{titulo_largura/2:.0f}' y='37' text-anchor='middle' font-family='Mochiy Pop One' font-size='{21 if bairro == 'palco' else 24}' fill='{cor_tema}'>{titulo}</text></g>")
# o botão ◀ Mapa é HTML (tw-mapa.js): acessível, traduzido e fora da arte
salvar('rua' if len(sys.argv) == 1 else 'rua_' + bairro, W, H)
print('ok')
