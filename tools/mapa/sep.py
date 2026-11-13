import re,json
s=open('mapa.svg').read()
txt=[]
def tk(m):
    el=m.group(0)
    a=lambda k,d=None:(re.search(k+r"='([^']*)'",el) or [None,d])[1]
    inner=re.sub(r"<tspan[^>]*>(.*?)</tspan>",r"\1",re.search(r">(.*)</text>",el,re.S).group(1))
    txt.append({'x':float(a('x',0)),'y':float(a('y',0)),'t':inner,'s':float(a('font-size',16)),'f':a('fill','#fff'),'k':a('stroke'),'a':a('text-anchor','start'),'star':'<tspan' in el})
    return ''
s2=re.sub(r"<text\b.*?</text>",tk,s,flags=re.S)
# remove o título (canto superior esquerdo): fica no HTML do site
s2=re.sub(r"<g transform='translate\((40,34|70,104)\)'>.*?</g>","",s2,flags=re.S)
txt=[t for t in txt if not (t['y']<140 and t['x']<400)]
open('mapa-arte.svg','w').write(s2)
# placas: retângulos rx=18 altura 36 -> áreas de clique
pl=[(float(x),float(y),float(w)) for x,y,w in re.findall(r"<rect x='([\d.-]+)' y='([\d.-]+)' width='([\d.]+)' height='36' rx='18'",s2)]
json.dump({'t':txt},open('mapa-textos.json','w'),ensure_ascii=False)
print(len(txt),len(s2),len(pl)); print([t['t'] for t in txt])
