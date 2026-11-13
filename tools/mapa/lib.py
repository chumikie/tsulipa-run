# Ajudantes e prédios do mapa (lidos do mapa.py) para montar outras cenas sem redesenhar.
import re, math, random
SRC = open('mapa.py').read()
L = SRC.split('\n')
G = {}
# cabeçalho (imports, ic, grad, defs)
cab = SRC[:SRC.index('# ---------- céu ----------')]
exec(cab, G)
# todas as funções de topo
for m in re.finditer(r'(?m)^def \w+\(.*\):\n(?:(?:    .*|)\n)+', SRC):
    exec(m.group(0), G)
exec("defs.append(\"<filter id='glow' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='7'/></filter>\")", G)

def bloco(cabeca, x, b):
    """Executa o bloco de um prédio do mapa.py com outra posição (x, b)."""
    i = SRC.index(cabeca)
    j = SRC.find('\n# ', i + 5)
    while j >= 0 and not re.match(r'\n# (Moon|Handshake|Happy|Backstage|Minha|Star|Zipper|Karaoke|Idol|Pedido|Center|Sora|-)', SRC[j:j + 14]):
        j = SRC.find('\n# ', j + 3)
    txt = SRC[i:j]
    txt = re.sub(r'(?m)^x, b = \d+, \d+', f'x, b = {x}, {b}', txt, count=1)
    exec(txt, G)

def novo():
    G['out'].clear(); G['defs'].clear()
    exec("defs.append(\"<filter id='glow' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='7'/></filter>\")", G)
    exec("defs.append(\"<pattern id='dots' width='18' height='18' patternUnits='userSpaceOnUse'><circle cx='4' cy='4' r='1.6' fill='#ffffff' opacity='.35'/></pattern>\")", G)

def salvar(nome, W, H):
    svg = f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {W} {H}' width='{W}' height='{H}'><defs>{''.join(G['defs'])}</defs>{''.join(G['out'])}</svg>"
    html = f"<!doctype html><html><head><meta charset='utf-8'><link rel='stylesheet' href='../../kt-fonts.css'><style>html,body{{margin:0}}</style></head><body>{svg}</body></html>"
    open(nome + '.svg', 'w').write(svg)
    open(nome + '.html', 'w').write(html)
